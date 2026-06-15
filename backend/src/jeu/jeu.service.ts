import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  ParticipantJeu,
  RejoindrePayload,
  RepondrePayload,
  ResultatsLivePayload,
  SessionJeu,
} from './jeu.types';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
const QUIZ_CORRECT_ANSWERS: Array<number | null> = [
  null,
  2,
  null,
  null,
  1,
  null,
  null,
  0,
  1,
  1,
  null,
  1,
  null,
  1,
  null,
  1,
  null,
  1,
  1,
  1,
];

@Injectable()
export class JeuService {
  private readonly sessions = new Map<string, SessionJeu>();

  creerSession(animatriceId: string) {
    let pin = this.genererPin();
    while (this.sessions.has(pin)) pin = this.genererPin();

    const session: SessionJeu = {
      pin,
      animatriceId,
      recoveryKey: randomUUID(),
      currentQuestion: -1,
      phase: 'lobby',
      participants: new Map(),
      resultats: {},
      repondants: {},
    };
    this.sessions.set(pin, session);
    return session;
  }

  trouverSession(pin: string) {
    return this.sessions.get(pin.trim());
  }

  sessionAnimatrice(socketId: string) {
    return [...this.sessions.values()].find(
      (session) => session.animatriceId === socketId,
    );
  }

  reprendreSession(pin: string, recoveryKey: string, socketId: string) {
    const session = this.trouverSession(pin);
    if (!session || session.recoveryKey !== recoveryKey) return null;
    session.animatriceId = socketId;
    session.phase = session.phaseAvantPause ?? session.phase;
    session.phaseAvantPause = undefined;
    return session;
  }

  rejoindre(payload: RejoindrePayload, socketId: string) {
    const session = this.trouverSession(payload.pin);
    if (!session) return null;

    const existing = session.participants.get(payload.participantId);
    const participant: ParticipantJeu = existing
      ? { ...existing, socketId, connected: true }
      : {
          participantId: payload.participantId,
          socketId,
          score: 0,
          reponses: [],
          connected: true,
        };
    session.participants.set(payload.participantId, participant);
    return { session, participant };
  }

  repondre(payload: RepondrePayload) {
    const session = this.trouverSession(payload.pin);
    const participant = session?.participants.get(payload.participantId);
    if (!session || !participant) return null;
    if (payload.questionIndex !== session.currentQuestion) return null;

    const repondants =
      session.repondants[payload.questionIndex] ?? new Set<string>();
    if (repondants.has(payload.participantId)) {
      return { session, participant, dejaRepondu: true };
    }
    repondants.add(payload.participantId);
    session.repondants[payload.questionIndex] = repondants;

    const resultats = session.resultats[payload.questionIndex] ?? {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      total: 0,
    };
    const optionKey = OPTION_KEYS[payload.optionIndex];
    if (optionKey) resultats[optionKey] += 1;
    resultats.total += 1;
    session.resultats[payload.questionIndex] = resultats;

    participant.reponses[payload.questionIndex] = payload.optionIndex;
    const correctIndex = QUIZ_CORRECT_ANSWERS[payload.questionIndex];
    const isPoll =
      payload.questionIndex >= QUIZ_CORRECT_ANSWERS.length ||
      correctIndex === null;
    if (isPoll) {
      participant.score += 20;
    } else if (correctIndex === payload.optionIndex) {
      const elapsedSeconds = 20 - payload.timeLeft;
      participant.score += elapsedSeconds < 10 ? 100 : 50;
    }

    return { session, participant, dejaRepondu: false };
  }

  resultatsLive(session: SessionJeu): ResultatsLivePayload {
    const resultats = session.resultats[session.currentQuestion] ?? {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      total: 0,
    };
    const participantCount = this.nombreParticipantsConnectes(session);
    return {
      questionIndex: session.currentQuestion,
      resultats,
      participantCount,
      responsePercentage:
        participantCount === 0
          ? 0
          : Math.min(
              100,
              Math.round((resultats.total / participantCount) * 100),
            ),
    };
  }

  classement(session: SessionJeu) {
    return [...session.participants.values()]
      .sort((a, b) => b.score - a.score)
      .map((participant, index) => ({
        rank: index + 1,
        participantId: participant.participantId,
        score: participant.score,
      }));
  }

  deconnecter(socketId: string) {
    for (const session of this.sessions.values()) {
      if (session.animatriceId === socketId) {
        session.phaseAvantPause = session.phase;
        session.phase = 'pause';
        return { session, role: 'animatrice' as const };
      }
      const participant = [...session.participants.values()].find(
        (item) => item.socketId === socketId,
      );
      if (participant) {
        participant.connected = false;
        return { session, role: 'participant' as const };
      }
    }
    return null;
  }

  nombreParticipantsConnectes(session: SessionJeu) {
    return [...session.participants.values()].filter(
      (participant) => participant.connected,
    ).length;
  }

  bonneReponse(questionIndex: number) {
    return QUIZ_CORRECT_ANSWERS[questionIndex];
  }

  private genererPin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
