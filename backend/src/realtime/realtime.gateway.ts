import {
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { RealtimeEventsService } from './realtime-events.service';

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
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly auth: JwtSocketAuthService,
    private readonly realtime: RealtimeService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {
    // mark missed calls (30s policy) every 2s
    setInterval(() => {
      const missed = this.realtime.checkMissedCalls(30_000);
      for (const call of missed) {
        this.server.to(call.conversationId).emit('call.missed', call);
      }
    }, 2000).unref?.();
  }

  afterInit(server: Server) {
    this.realtimeEvents.bindServer(server);
  }

  // Socket.IO auth happens on connection; we validate per-event too.
  private getUser(socket: AuthedSocket): SocketUser {
    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      socket.handshake.headers?.authorization;

    console.log('[RealtimeGateway.getUser] Extracting token from socket', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    const user = this.auth.authenticate(token);
    if (!user) {
      console.error(
        '[RealtimeGateway.getUser] Authentication failed for token:',
        {
          tokenLength: token?.length || 0,
        },
      );
      throw new Error('UNAUTHORIZED');
    }

    console.log('[RealtimeGateway.getUser] User authenticated', {
      userId: user.userId,
      role: user.role,
    });

    socket.user = user;
    return user;
  }

  @SubscribeMessage('conversation.join')
  async joinConversation(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: JoinConversationPayload,
  ) {
    console.log(
      '[RealtimeGateway] joinConversation called with payload:',
      payload,
    );

    const user = this.getUser(socket);
    console.log('[RealtimeGateway] User from socket:', {
      userId: user.userId,
      role: user.role,
    });

    const { mentorId, etudiantId } = payload ?? ({} as JoinConversationPayload);
    if (!mentorId || !etudiantId) {
      console.error('[RealtimeGateway] Missing mentorId or etudiantId', {
        mentorId,
        etudiantId,
      });
      throw new Error('INVALID_PAYLOAD');
    }

    console.log('[RealtimeGateway] Checking access control for', {
      mentorId,
      etudiantId,
    });
    const hasAccess = await this.realtime.canJoinConversation(
      user,
      mentorId,
      etudiantId,
    );
    if (!hasAccess) {
      console.warn('[RealtimeGateway] Access denied for user', {
        userId: user.userId,
        mentorId,
        etudiantId,
      });
      throw new Error('FORBIDDEN');
    }

    const conversationId = this.realtime.getConversationId(
      mentorId,
      etudiantId,
    );
    console.log('[RealtimeGateway] Access granted, joining room', {
      conversationId,
    });

    await socket.join(conversationId);

    // Safety net: ensure user is also in their personal room (userId)
    // so they can receive direct events even outside the conversation room.
    await socket.join(user.userId);
    console.log('[RealtimeGateway] Socket joined to rooms', {
      conversationId,
      userId: user.userId,
    });

    const messages = await this.realtime.listRecentMessages(conversationId);
    console.log(
      '[RealtimeGateway] Fetched recent messages count:',
      messages.length,
    );
    socket.emit('conversation.history', { conversationId, messages });

    console.log('[RealtimeGateway] joinConversation completed successfully');
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
      const etudiantPart = conversationParts.find((p) =>
        p.startsWith('etudiant:'),
      );
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

        console.log('[realtime] mentor.notification emit', {
          to: mentorId,
          type: notif.type,
          conversationId,
        });
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

      console.log('[realtime] mentor.notification emit', {
        to: mentorId,
        type: notif.type,
        conversationId,
      });
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

    console.log('[realtime] presence.register', {
      userId: user.userId,
      role: user.role,
      socketId: socket.id,
    });
    return { ok: true };
  }

  handleConnection(socket: AuthedSocket) {
    console.log('[RealtimeGateway] Socket connected', {
      socketId: socket.id,
      remoteAddress: socket.handshake.address,
    });

    try {
      const token = socket.handshake.auth?.token as string | undefined;
      console.log('[RealtimeGateway.handleConnection] Token present:', !!token);

      const user = this.getUser(socket);
      console.log('[RealtimeGateway.handleConnection] Socket authenticated', {
        socketId: socket.id,
        userId: user.userId,
        role: user.role,
      });
    } catch (error) {
      console.error(
        '[RealtimeGateway.handleConnection] Failed to authenticate',
        {
          socketId: socket.id,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      // Note: The socket will still be connected, but not in user.userId room
      // Future events will fail the getUser() check
    }
  }

  handleDisconnect(socket: AuthedSocket) {
    const user = socket.user;
    console.log('[RealtimeGateway] Socket disconnected', {
      socketId: socket.id,
      userId: user?.userId,
      role: user?.role,
    });
  }
}
