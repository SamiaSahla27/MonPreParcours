import { Injectable } from '@nestjs/common';
import type {
  CallSession,
  ConversationId,
  SocketUser,
  UserRole,
} from './types/realtime.types';
import { ChatMessageStore } from './store/chat-message.store';
import { PrismaService } from '../db/prisma.service';
import { MentorContactRequestStatus } from '@prisma/client';

function conversationIdFor(
  mentorId: string,
  etudiantId: string,
): ConversationId {
  return `mentor:${mentorId}|etudiant:${etudiantId}`;
}

@Injectable()
export class RealtimeService {
  private readonly calls = new Map<ConversationId, CallSession>();

  constructor(
    private readonly store: ChatMessageStore,
    private readonly prisma: PrismaService,
  ) {}

  getConversationId(mentorId: string, etudiantId: string): ConversationId {
    return conversationIdFor(mentorId, etudiantId);
  }

  // Check if user can join the conversation:
  // 1. Must be one of the two participants
  // 2. Must have an accepted MentorContactRequest OR existing Conversation
  async canJoinConversation(
    user: SocketUser,
    mentorId: string,
    etudiantId: string,
  ): Promise<boolean> {
    const isParticipant =
      (user.role === 'mentor' && user.userId === mentorId) ||
      (user.role === 'etudiant' && user.userId === etudiantId);

    console.log('[RealtimeService.canJoinConversation] Checking participant', {
      userId: user.userId,
      userRole: user.role,
      mentorId,
      etudiantId,
      isParticipant,
    });

    if (!isParticipant) {
      console.warn('[RealtimeService.canJoinConversation] User is not a participant');
      return false;
    }

    // Check if conversation already exists
    console.log('[RealtimeService.canJoinConversation] Checking conversation table...');
    const conversation = await this.prisma.conversation.findUnique({
      where: { mentorId_etudiantId: { mentorId, etudiantId } },
      select: { id: true },
    });

    if (conversation) {
      console.log('[RealtimeService.canJoinConversation] Conversation found');
      return true;
    }

    // Fallback: check for accepted request (in case join happens immediately)
    console.log('[RealtimeService.canJoinConversation] Checking MentorContactRequest table...');
    const acceptedRequest = await this.prisma.mentorContactRequest.findFirst({
      where: {
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.accepted,
      },
      select: { id: true },
    });

    const hasAccess = Boolean(acceptedRequest);
    console.log('[RealtimeService.canJoinConversation] MentorContactRequest check result:', {
      hasAccess,
      requestId: acceptedRequest?.id,
    });

    return hasAccess;
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
