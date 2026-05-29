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

export type AppNotification = {
  id: string;
  type: "mentor_request_pending" | "mentor_request_accepted" | "mentor_request_refused";
  title: string;
  body?: string | null;
  mentorId?: string | null;
  etudiantId?: string | null;
  requestId?: string | null;
  conversationId?: string | null;
  requestStatus?: "pending" | "accepted" | "refused";
  requesterEmail?: string;
  createdAt: string;
};

type ConversationHistory = { conversationId: string; messages: ChatMessage[] };

type SignalEvent = { conversationId: string; fromUserId: string; data: unknown };

function normalizeRealtimeBaseUrl(baseUrl: string): string {
  const trimmed = (baseUrl ?? "").trim();
  if (!trimmed || trimmed === "/") return "";

  // API base often ends with /api; realtime namespace lives at /realtime.
  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/api$/, "");
}

export class RealtimeClient {
  private socket: Socket;
  private connectionPromise: Promise<void> | null = null;

  constructor(params: { baseUrl: string; token: string }) {
    const normalizedBase = normalizeRealtimeBaseUrl(params.baseUrl);
    const url = `${normalizedBase}/realtime`;
    console.log("[RealtimeClient] Connecting to", url, "from baseUrl", params.baseUrl);

    this.socket = io(url, {
      transports: ["websocket", "polling"], // Add polling as fallback
      auth: { token: params.token },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 20,
    });

    // Log connection events
    this.socket.on("connect", () => {
      console.log("[RealtimeClient] Connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[RealtimeClient] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("[RealtimeClient] Connect error:", error);
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

  onNotificationCreated(cb: (n: AppNotification) => void) {
    this.socket.on("notification.created", cb);
  }

  async registerPresence() {
    return this.socket.emit("presence.register");
  }

  async joinConversation(mentorId: string, etudiantId: string): Promise<{ conversationId: string }> {
    console.log("[RealtimeClient] joinConversation starting", { mentorId, etudiantId });
    
    // Wait for socket to connect if not already connected
    if (!this.socket.connected) {
      console.log("[RealtimeClient] Socket not connected, waiting for connection...");
      await this.waitForConnection(15000); // 15 second timeout
    }
    
    console.log("[RealtimeClient] Socket connected, emitting conversation.join");
    try {
      const result = await this.emitAsync<{ conversationId: string }>("conversation.join", { mentorId, etudiantId });
      console.log("[RealtimeClient] joinConversation succeeded", result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("[RealtimeClient] joinConversation failed:", errorMsg);
      throw error;
    }
  }

  private waitForConnection(timeoutMs: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.socket.connected) {
        console.log("[RealtimeClient] Already connected");
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        console.error("[RealtimeClient] Connection timeout after", timeoutMs, "ms");
        reject(new Error("CONNECTION_TIMEOUT"));
      }, timeoutMs);

      const onConnect = () => {
        clearTimeout(timeout);
        cleanup();
        console.log("[RealtimeClient] Connection established");
        resolve();
      };

      const onConnectError = (err: any) => {
        clearTimeout(timeout);
        cleanup();
        console.error("[RealtimeClient] Connection failed:", err);
        reject(err || new Error("CONNECTION_FAILED"));
      };

      const cleanup = () => {
        this.socket.off("connect", onConnect);
        this.socket.off("connect_error", onConnectError);
      };

      this.socket.once("connect", onConnect);
      this.socket.once("connect_error", onConnectError);
    });
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
      // Increase timeout to 20s for slow networks
      const timeoutMs = 20000;
      console.log(`[RealtimeClient] Emitting ${event} with timeout ${timeoutMs}ms`);

      try {
        this.socket.timeout(timeoutMs).emit(event, payload, (err: unknown, res: T) => {
          if (err) {
            const message =
              typeof err === "string"
                ? err
                : (err as any)?.message || (err as any)?.toString?.() || "SOCKET_ERROR";
            console.error(`[RealtimeClient] ${event} failed:`, message);
            reject(new Error(message));
            return;
          }
          console.log(`[RealtimeClient] ${event} succeeded`);
          resolve(res);
        });
      } catch (e) {
        console.error(`[RealtimeClient] ${event} emit error:`, e);
        reject(e);
      }
    });
  }
}
