import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import type { ChatMessage, ConversationId, SocketUser, UserRole } from '../types/realtime.types';

@Injectable()
export class ChatMessageStore {
  constructor(private readonly prisma: PrismaService) {}

  async ensureConversation(mentorId: string, etudiantId: string) {
    return this.prisma.conversation.upsert({
      where: { mentorId_etudiantId: { mentorId, etudiantId } },
      update: {},
      create: { mentorId, etudiantId },
      select: { id: true, mentorId: true, etudiantId: true },
    });
  }

  async listRecentMessages(conversationId: ConversationId, limit = 50): Promise<ChatMessage[]> {
    // conversationId is our room id ("mentor:{id}|etudiant:{id}")
    const ids = this.parseRoomConversationId(conversationId);
    const convo = await this.prisma.conversation.findUnique({
      where: { mentorId_etudiantId: ids },
      select: { id: true, mentorId: true, etudiantId: true },
    });
    if (!convo) return [];

    const rows = await this.prisma.message.findMany({
      where: { conversationId: convo.id },
      orderBy: { createdAt: 'asc' },
      take: Math.max(1, Math.min(limit, 200)),
      select: { id: true, fromUserId: true, toUserId: true, text: true, createdAt: true },
    });

    return rows.map((m) => ({
      id: m.id,
      conversationId,
      fromUserId: m.fromUserId,
      fromRole: m.fromUserId === convo.mentorId ? 'mentor' : 'etudiant',
      toUserId: m.toUserId,
      toRole: m.toUserId === convo.mentorId ? 'mentor' : 'etudiant',
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  async appendMessage(params: {
    conversationId: ConversationId;
    from: SocketUser;
    toUserId: string;
    toRole: UserRole;
    text: string;
  }): Promise<ChatMessage> {
    const { conversationId, from, toUserId, toRole, text } = params;
    const ids = this.parseRoomConversationId(conversationId);

    const convo = await this.ensureConversation(ids.mentorId, ids.etudiantId);

    const created = await this.prisma.message.create({
      data: {
        conversationId: convo.id,
        fromUserId: from.userId,
        toUserId,
        text,
      },
      select: { id: true, fromUserId: true, toUserId: true, text: true, createdAt: true },
    });

    return {
      id: created.id,
      conversationId,
      fromUserId: created.fromUserId,
      fromRole: from.role,
      toUserId: created.toUserId,
      toRole,
      text: created.text,
      createdAt: created.createdAt.toISOString(),
    };
  }

  private parseRoomConversationId(conversationId: ConversationId): { mentorId: string; etudiantId: string } {
    // Expected format: mentor:{mentorId}|etudiant:{etudiantId}
    const match = /^mentor:(.+)\|etudiant:(.+)$/.exec(conversationId);
    if (!match) {
      throw new Error('INVALID_CONVERSATION_ID');
    }
    const mentorId = match[1];
    const etudiantId = match[2];
    if (!mentorId || !etudiantId) throw new Error('INVALID_CONVERSATION_ID');
    return { mentorId, etudiantId };
  }
}
