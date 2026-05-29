import { RealtimeService } from './realtime.service';
import type { SocketUser } from './types/realtime.types';

class InMemoryStore {
  messages: any[] = [];
  async appendMessage(m: any) {
    this.messages.push({ ...m, id: 'id', createdAt: new Date().toISOString() });
    return this.messages[this.messages.length - 1];
  }
  async getConversation(conversationId: string) {
    return this.messages.filter((m) => m.conversationId === conversationId);
  }
}

describe(RealtimeService.name, () => {
  const mentor: SocketUser = { userId: 'm1', role: 'mentor' };
  const etudiant: SocketUser = { userId: 'e1', role: 'etudiant' };

  const mockPrisma = {
    conversation: {
      findUnique: jest.fn().mockResolvedValue({ id: 'conv1' }),
    },
    mentorContactRequest: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  it('enforces join permissions based on roles', async () => {
    const svc = new RealtimeService(
      new InMemoryStore() as any,
      mockPrisma as any,
    );
    await expect(svc.canJoinConversation(mentor, 'm1', 'e1')).resolves.toBe(
      true,
    );
    await expect(svc.canJoinConversation(mentor, 'm2', 'e1')).resolves.toBe(
      false,
    );
    await expect(svc.canJoinConversation(etudiant, 'm1', 'e1')).resolves.toBe(
      true,
    );
    await expect(svc.canJoinConversation(etudiant, 'm1', 'e2')).resolves.toBe(
      false,
    );
  });

  it('creates deterministic conversationId', () => {
    const svc = new RealtimeService(
      new InMemoryStore() as any,
      mockPrisma as any,
    );
    expect(svc.getConversationId('m1', 'e1')).toBe('mentor:m1|etudiant:e1');
  });

  it('starts and marks a call missed after timeout', () => {
    const svc = new RealtimeService(
      new InMemoryStore() as any,
      mockPrisma as any,
    );
    const conversationId = svc.getConversationId('m1', 'e1');
    svc.startCall(conversationId, 'm1', 'e1', mentor);

    // simulate time passing
    const calls = (svc as any).calls as Map<string, any>;
    const session = calls.get(conversationId);
    session.updatedAt = Date.now() - 31_000;

    const missed = svc.checkMissedCalls(30_000);
    expect(missed).toHaveLength(1);
    expect(missed[0].state).toBe('missed');
  });
});
