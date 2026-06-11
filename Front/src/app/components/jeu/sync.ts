import type { Question } from "./types";

export const GAME_SYNC_KEY = "jeu-stereotypes-live-state";
const PARTICIPANT_ID_KEY = "jeu-stereotypes-participant-id";

export interface LiveGameState {
  questionIndex: number;
  participants: string[];
  responses: Record<string, number[]>;
  respondents: Record<string, string[]>;
  updatedAt: number;
}

export function createLiveGameState(): LiveGameState {
  return {
    questionIndex: 0,
    participants: [],
    responses: {},
    respondents: {},
    updatedAt: Date.now(),
  };
}

export function readLiveGameState(): LiveGameState {
  const stored = window.localStorage.getItem(GAME_SYNC_KEY);
  if (!stored) return createLiveGameState();

  try {
    return { ...createLiveGameState(), ...JSON.parse(stored) as LiveGameState };
  } catch {
    return createLiveGameState();
  }
}

export function writeLiveGameState(state: LiveGameState) {
  window.localStorage.setItem(GAME_SYNC_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
}

export function getParticipantId() {
  const existing = window.localStorage.getItem(PARTICIPANT_ID_KEY);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(PARTICIPANT_ID_KEY, id);
  return id;
}

export function registerParticipant(participantId: string) {
  const state = readLiveGameState();
  if (!state.participants.includes(participantId)) {
    state.participants = [...state.participants, participantId];
    writeLiveGameState(state);
  }
}

export function recordLiveResponse(question: Question, optionIndex: number, participantId: string) {
  const state = readLiveGameState();
  const key = String(question.id);
  if (state.respondents[key]?.includes(participantId)) return;

  const counts = state.responses[key] ?? question.opts.map(() => 0);
  if (optionIndex >= 0 && optionIndex < counts.length) counts[optionIndex] += 1;
  state.responses[key] = counts;
  state.respondents[key] = [...(state.respondents[key] ?? []), participantId];
  writeLiveGameState(state);
}
