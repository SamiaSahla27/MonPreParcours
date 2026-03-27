import { Injectable } from '@nestjs/common';
import type {
  CallSession,
  ConversationId,
  SocketUser,
  UserRole,
} from './types/realtime.types';
import { ChatMessageStore } from './store/chat-message.store';

function conversationIdFor(
  mentorId: string,
  etudiantId: string,
): ConversationId {
  return `mentor:${mentorId}|etudiant:${etudiantId}`;
}

@Injectable()
export class RealtimeService {
  private readonly calls = new Map<ConversationId, CallSession>();

  constructor(private readonly store: ChatMessageStore) {}

  getConversationId(mentorId: string, etudiantId: string): ConversationId {
    return conversationIdFor(mentorId, etudiantId);
  }

  // Option B pairing rule: require explicit mentor+etudiant IDs in join.
  // We trust pairing exists (out of scope); server enforces roles.
  canJoinConversation(
    user: SocketUser,
    mentorId: string,
    etudiantId: string,
  ): boolean {
    if (user.role === 'mentor') return user.userId === mentorId;
    if (user.role === 'etudiant') return user.userId === etudiantId;
    return false;
  }

  async listRecentMessages(conversationId: ConversationId): Promise<unknown[]> {
    return this.store.listRecentMessages(conversationId, 50);
  }

  async sendMessage(params: {
    conversationId: ConversationId;
    from: SocketUser;
    toUserId: string;
    toRole: UserRole;
    text: string;
  }) {
    const { conversationId, from, toUserId, toRole, text } = params;

    if (!text || !text.trim()) throw new Error('INVALID_TEXT');

    return this.store.appendMessage({
      conversationId,
      from,
      toUserId,
      toRole,
      text: text.trim(),
    });
  }

  startCall(
    conversationId: ConversationId,
    mentorId: string,
    etudiantId: string,
    requestedBy: SocketUser,
  ) {
    // both roles can start; but must belong to conversation
    if (requestedBy.userId !== mentorId && requestedBy.userId !== etudiantId) {
      throw new Error('FORBIDDEN');
    }

    const session: CallSession = {
      conversationId,
      mentorId,
      etudiantId,
      state: 'ringing',
      updatedAt: Date.now(),
    };
    this.calls.set(conversationId, session);
    return session;
  }

  markConnected(conversationId: ConversationId) {
    const session = this.calls.get(conversationId);
    if (!session) throw new Error('CALL_NOT_FOUND');
    session.state = 'connected';
    session.updatedAt = Date.now();
    return session;
  }

  markEnded(conversationId: ConversationId, reason: 'ended' | 'missed') {
    const session = this.calls.get(conversationId);
    if (!session) return null;
    session.state = reason;
    session.updatedAt = Date.now();
    // keep in memory briefly; cleanup handled elsewhere
    return session;
  }

  checkMissedCalls(timeoutMs: number) {
    const now = Date.now();
    const missed: CallSession[] = [];
    for (const session of this.calls.values()) {
      if (session.state === 'ringing' && now - session.updatedAt > timeoutMs) {
        session.state = 'missed';
        session.updatedAt = now;
        missed.push({ ...session });
      }
    }
    return missed;
  }

  // helper for tests
  _dangerousClearAll() {
    this.calls.clear();
  }
}
