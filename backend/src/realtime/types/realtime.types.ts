export type UserRole = 'mentor' | 'etudiant';

export type ConversationId = string;

export interface SocketUser {
  userId: string;
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  conversationId: ConversationId;
  fromUserId: string;
  fromRole: UserRole;
  toUserId: string;
  toRole: UserRole;
  text: string;
  createdAt: string;
}

export type CallState = 'ringing' | 'connected' | 'missed' | 'ended';

export interface CallSession {
  conversationId: ConversationId;
  mentorId: string;
  etudiantId: string;
  state: CallState;
  updatedAt: number;
}

export interface JwtClaims {
  sub: string;
  role: UserRole;
}
