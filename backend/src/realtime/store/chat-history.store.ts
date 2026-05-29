import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import type { ChatMessage, ConversationId } from '../types/realtime.types';

interface StoreShape {
  messages: ChatMessage[];
}

@Injectable()
export class ChatHistoryStore {
  private readonly storePath: string;
  private writeChain: Promise<void> = Promise.resolve();

  constructor() {
    const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'data');
    this.storePath = path.join(dataDir, 'chat-history.json');
  }

  async appendMessage(
    input: Omit<ChatMessage, 'id' | 'createdAt'>,
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await this.enqueueWrite(async (state) => {
      state.messages.push(message);
      // keep last 1000 messages (basic bound)
      if (state.messages.length > 1000) {
        state.messages.splice(0, state.messages.length - 1000);
      }
    });

    return message;
  }

  async getConversation(
    conversationId: ConversationId,
    limit = 50,
  ): Promise<ChatMessage[]> {
    const state = await this.readState();
    const items = state.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    return items.slice(Math.max(0, items.length - limit));
  }

  private async enqueueWrite(
    mutator: (state: StoreShape) => Promise<void> | void,
  ): Promise<void> {
    this.writeChain = this.writeChain.then(async () => {
      const state = await this.readState();
      await mutator(state);
      await this.writeState(state);
    });

    return this.writeChain;
  }

  private async readState(): Promise<StoreShape> {
    await fs.mkdir(path.dirname(this.storePath), { recursive: true });

    try {
      const raw = await fs.readFile(this.storePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoreShape>;
      return {
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    } catch {
      return { messages: [] };
    }
  }

  private async writeState(state: StoreShape): Promise<void> {
    const tmp = `${this.storePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(state, null, 2), 'utf-8');
    await fs.rename(tmp, this.storePath);
  }
}
