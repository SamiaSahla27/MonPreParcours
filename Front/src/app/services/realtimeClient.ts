import { io, Socket } from "socket.io-client";

export type UserRole = "mentor" | "etudiant";

export type ChatMessage = {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromRole: UserRole;
  toUserId: string;
  toRole: UserRole;
  text: string;
  createdAt: string;
};

export type CallSession = {
  conversationId: string;
  mentorId: string;
  etudiantId: string;
  state: "ringing" | "connected" | "missed" | "ended";
  updatedAt: number;
};

export type MentorNotification = {
  conversationId: string;
  mentorId: string;
  etudiantId: string;
  type: "contact" | "message" | "call";
  previewText?: string;
  createdAt: string;
};

type ConversationHistory = { conversationId: string; messages: ChatMessage[] };

type SignalEvent = { conversationId: string; fromUserId: string; data: unknown };

export class RealtimeClient {
  private socket: Socket;

  constructor(params: { baseUrl: string; token: string }) {
    this.socket = io(`${params.baseUrl}/realtime`, {
      transports: ["websocket"],
      auth: { token: params.token },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
    });
  }

  onConnected(cb: () => void) {
    this.socket.on("connect", cb);
  }

  onDisconnected(cb: () => void) {
    this.socket.on("disconnect", cb);
  }

  onHistory(cb: (h: ConversationHistory) => void) {
    this.socket.on("conversation.history", cb);
  }

  onMessage(cb: (m: ChatMessage) => void) {
    this.socket.on("chat.message", cb);
  }

  onCallRinging(cb: (c: CallSession) => void) {
    this.socket.on("call.ringing", cb);
  }

  onCallConnected(cb: (c: CallSession) => void) {
    this.socket.on("call.connected", cb);
  }

  onCallMissed(cb: (c: CallSession) => void) {
    this.socket.on("call.missed", cb);
  }

  onCallEnded(cb: (c: CallSession | null) => void) {
    this.socket.on("call.ended", cb);
  }

  onCallAccepted(cb: (p: { conversationId: string }) => void) {
    this.socket.on("call.accepted", cb);
  }

  onSignal(cb: (s: SignalEvent) => void) {
    this.socket.on("webrtc.signal", cb);
  }

  onMentorNotification(cb: (n: MentorNotification) => void) {
    this.socket.on("mentor.notification", cb);
  }

  async registerPresence() {
    return this.socket.emit("presence.register");
  }

  async joinConversation(mentorId: string, etudiantId: string): Promise<{ conversationId: string }> {
    return await this.emitAsync("conversation.join", { mentorId, etudiantId });
  }

  async sendMessage(payload: { conversationId: string; toUserId: string; toRole: UserRole; text: string }) {
    return await this.emitAsync("chat.send", payload);
  }

  async startCall(payload: { mentorId: string; etudiantId: string }) {
    return await this.emitAsync("call.start", payload);
  }

  async markCallConnected(payload: { conversationId: string }) {
    return await this.emitAsync("call.connected", payload);
  }

  async acceptCall(payload: { conversationId: string }) {
    return await this.emitAsync("call.accept", payload);
  }

  async endCall(payload: { conversationId: string; reason?: "ended" | "missed" }) {
    return await this.emitAsync("call.end", payload);
  }

  async signal(payload: { conversationId: string; toUserId: string; data: unknown }) {
    return await this.emitAsync("webrtc.signal", payload);
  }

  disconnect() {
    this.socket.disconnect();
  }

  private emitAsync<T>(event: string, payload?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      this.socket.timeout(8000).emit(event, payload, (err: unknown, res: T) => {
        if (err) {
          const message =
            typeof err === "string"
              ? err
              : (err as any)?.message || (err as any)?.toString?.() || "SOCKET_ERROR";
          reject(new Error(message));
          return;
        }
        else resolve(res);
      });
    });
  }
}
