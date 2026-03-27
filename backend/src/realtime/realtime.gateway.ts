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
import type { ConversationId, SocketUser, UserRole } from './types/realtime.types';

type AuthedSocket = Socket & { user?: SocketUser };

interface JoinConversationPayload {
  mentorId: string;
  etudiantId: string;
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
      (socket.handshake.headers?.authorization as string | undefined);

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

    const conversationId = this.realtime.getConversationId(mentorId, etudiantId);

    await socket.join(conversationId);

    const messages = await this.realtime.listRecentMessages(conversationId);
    socket.emit('conversation.history', { conversationId, messages });

    return { conversationId };
  }

  @SubscribeMessage('chat.send')
  async chatSend(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const user = this.getUser(socket);
    const { conversationId, toUserId, toRole, text } = payload ?? ({} as SendMessagePayload);

    if (!conversationId || !toUserId || !toRole) throw new Error('INVALID_PAYLOAD');

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

    const conversationId = this.realtime.getConversationId(mentorId, etudiantId);
    if (!socket.rooms.has(conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.startCall(conversationId, mentorId, etudiantId, user);
    this.server.to(conversationId).emit('call.ringing', call);

    return call;
  }

  @SubscribeMessage('call.connected')
  async callConnected(@ConnectedSocket() socket: AuthedSocket, @MessageBody() payload: { conversationId: ConversationId }) {
    this.getUser(socket);
    if (!payload?.conversationId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(payload.conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.markConnected(payload.conversationId);
    this.server.to(payload.conversationId).emit('call.connected', call);
    return call;
  }

  @SubscribeMessage('call.end')
  async callEnd(
    @ConnectedSocket() socket: AuthedSocket,
    @MessageBody() payload: { conversationId: ConversationId; reason?: 'ended' | 'missed' },
  ) {
    this.getUser(socket);
    if (!payload?.conversationId) throw new Error('INVALID_PAYLOAD');
    if (!socket.rooms.has(payload.conversationId)) throw new Error('FORBIDDEN');

    const call = this.realtime.markEnded(payload.conversationId, payload.reason ?? 'ended');
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
    return { ok: true };
  }
}
