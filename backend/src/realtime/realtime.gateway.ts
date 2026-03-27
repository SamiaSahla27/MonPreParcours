import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JwtSocketAuthService } from './security/jwt-socket-auth.service';
import { RealtimeService } from './realtime.service';
import type {
  ConversationId,
  SocketUser,
  UserRole,
} from './types/realtime.types';

type AuthedSocket = Socket & { user?: SocketUser };

interface JoinConversationPayload {
  mentorId: string;
  etudiantId: string;
}

interface MentorNotificationPayload {
  conversationId: ConversationId;
  mentorId: string;
  etudiantId: string;
  type: 'contact' | 'message' | 'call';
  previewText?: string;
  createdAt: string;
}

interface SendMessagePayload {
  conversationId: ConversationId;
  toUserId: string;
  toRole: UserRole;
  text: string;
}

interface StartCallPayload {
  mentorId: string;
  etudiantId: string;
}

interface AcceptCallPayload {
  conversationId: ConversationId;
}

interface SignalPayload {
  conversationId: ConversationId;
  toUserId: string;
  data: unknown;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: '/realtime',
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly auth: JwtSocketAuthService,
    private readonly realtime: RealtimeService,
  ) {
    // mark missed calls (30s policy) every 2s
    setInterval(() => {
      const missed = this.realtime.checkMissedCalls(30_000);
      for (const call of missed) {
        this.server.to(call.conversationId).emit('call.missed', call);
      }
    }, 2000).unref?.();
  }

  // Socket.IO auth happens on connection; we validate per-event too.
  private getUser(socket: AuthedSocket): SocketUser {
    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      socket.handshake.headers?.authorization;

    const user = this.auth.authenticate(token);
    if (!user) {
      throw new Error('UNAUTHORIZED');
    }
    socket.user = user;
    return user;
  }

  @SubscribeMessage('conversation.join')
  async joinConversation(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: JoinConversationPayload,
  ) {
    const user = this.getUser(socket);

    const { mentorId, etudiantId } = payload ?? ({} as JoinConversationPayload);
    if (!mentorId || !etudiantId) throw new Error('INVALID_PAYLOAD');

    if (!this.realtime.canJoinConversation(user, mentorId, etudiantId)) {
      throw new Error('FORBIDDEN');
    }

    const conversationId = this.realtime.getConversationId(
      mentorId,
      etudiantId,
    );

    await socket.join(conversationId);

    // Safety net: ensure user is also in their personal room (userId)
    // so they can receive direct events even outside the conversation room.
    await socket.join(user.userId);

    const messages = await this.realtime.listRecentMessages(conversationId);
    socket.emit('conversation.history', { conversationId, messages });

    // Mentor notifications (real-time only): when an étudiant initiates contact
    // by joining the conversation, notify the mentor via their userId room.
    if (user.role === 'etudiant') {
      const notif: MentorNotificationPayload = {
        conversationId,
        mentorId,
        etudiantId,
        type: 'contact',
        createdAt: new Date().toISOString(),
      };
      // eslint-disable-next-line no-console
      console.log('[realtime] mentor.notification emit', { to: mentorId, type: notif.type, conversationId });
      this.server.to(mentorId).emit('mentor.notification', notif);
      // Also emit to the conversation room so mentors already in the chat always receive it.
      this.server.to(conversationId).emit('mentor.notification', notif);
    }

    return { conversationId };
  }

  @SubscribeMessage('chat.send')
  async chatSend(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const user = this.getUser(socket);
    const { conversationId, toUserId, toRole, text } =
      payload ?? ({} as SendMessagePayload);

    if (!conversationId || !toUserId || !toRole)
      throw new Error('INVALID_PAYLOAD');

    // pairing rule: must already be in room to send
    if (!socket.rooms.has(conversationId)) {
      throw new Error('FORBIDDEN');
    }

    const msg = await this.realtime.sendMessage({
      conversationId,
      from: user,
      toUserId,
      toRole,
      text,
    });

    this.server.to(conversationId).emit('chat.message', msg);

    // Mentor notifications (real-time only): if an étudiant sends a message,
    // notify the mentor via their userId room.
    if (user.role === 'etudiant') {
      const conversationParts = conversationId.split('|');
      const mentorPart = conversationParts.find((p) => p.startsWith('mentor:'));
      const etudiantPart = conversationParts.find((p) => p.startsWith('etudiant:'));
      const mentorId = mentorPart?.slice('mentor:'.length);
      const etudiantId = etudiantPart?.slice('etudiant:'.length);

      if (mentorId && etudiantId) {
        const notif: MentorNotificationPayload = {
          conversationId,
          mentorId,
          etudiantId,
          type: 'message',
          previewText: text?.trim?.() ? text.trim().slice(0, 120) : undefined,
          createdAt: new Date().toISOString(),
        };
        // eslint-disable-next-line no-console
        console.log('[realtime] mentor.notification emit', { to: mentorId, type: notif.type, conversationId });
        this.server.to(mentorId).emit('mentor.notification', notif);
        this.server.to(conversationId).emit('mentor.notification', notif);
      }
    }

    return msg;
  }

  @SubscribeMessage('call.start')
  async callStart(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: StartCallPayload,
  ) {
    const user = this.getUser(socket);
    const { mentorId, etudiantId } = payload ?? ({} as StartCallPayload);
    if (!mentorId || !etudiantId) throw new Error('INVALID_PAYLOAD');

    const conversationId = this.realtime.getConversationId(
      mentorId,
      etudiantId,
    );
    if (!socket.rooms.has(conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.startCall(
      conversationId,
      mentorId,
      etudiantId,
      user,
    );
    this.server.to(conversationId).emit('call.ringing', call);

    // Mentor notifications (real-time only): if an étudiant initiates a call,
    // notify the mentor via their userId room.
    if (user.role === 'etudiant') {
      const notif: MentorNotificationPayload = {
        conversationId,
        mentorId,
        etudiantId,
        type: 'call',
        createdAt: new Date().toISOString(),
      };
      // eslint-disable-next-line no-console
      console.log('[realtime] mentor.notification emit', { to: mentorId, type: notif.type, conversationId });
      this.server.to(mentorId).emit('mentor.notification', notif);
      this.server.to(conversationId).emit('mentor.notification', notif);
    }

    return call;
  }

  @SubscribeMessage('call.connected')
  async callConnected(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: { conversationId: ConversationId },
  ) {
    this.getUser(socket);
    if (!payload?.conversationId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(payload.conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.markConnected(payload.conversationId);
    this.server.to(payload.conversationId).emit('call.connected', call);
    return call;
  }

  @SubscribeMessage('call.accept')
  async callAccept(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: AcceptCallPayload,
  ) {
    this.getUser(socket);
    if (!payload?.conversationId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(payload.conversationId)) throw new Error('FORBIDDEN');

    // Relay to conversation room so caller can renegotiate if needed.
    this.server.to(payload.conversationId).emit('call.accepted', {
      conversationId: payload.conversationId,
    });

    return { ok: true };
  }

  @SubscribeMessage('call.end')
  async callEnd(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody()
    payload: { conversationId: ConversationId; reason?: 'ended' | 'missed' },
  ) {
    this.getUser(socket);
    if (!payload?.conversationId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(payload.conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.markEnded(
      payload.conversationId,
      payload.reason ?? 'ended',
    );
    this.server.to(payload.conversationId).emit('call.ended', call);
    return call;
  }

  @SubscribeMessage('webrtc.signal')
  async webrtcSignal(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: SignalPayload,
  ) {
    const user = this.getUser(socket);
    const { conversationId, toUserId, data } = payload ?? ({} as SignalPayload);

    if (!conversationId || !toUserId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(conversationId)) throw new Error('FORBIDDEN');

    // deliver directly to user room (userId) if they joined it
    this.server.to(toUserId).emit('webrtc.signal', {
      conversationId,
      fromUserId: user.userId,
      data,
    });

    return { ok: true };
  }

  @SubscribeMessage('presence.register')
  async presenceRegister(@ConnectedSocket() socket: AuthedSocket) {
    const user = this.getUser(socket);
    await socket.join(user.userId);
    // Debug: confirm room join (can be removed later)
    // eslint-disable-next-line no-console
    console.log('[realtime] presence.register', { userId: user.userId, role: user.role, socketId: socket.id });
    return { ok: true };
  }
}
