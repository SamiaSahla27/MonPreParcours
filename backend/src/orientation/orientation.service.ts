import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GroqOrientationService } from './groq-orientation.service';
import { getFollowUpQuestions, getIntroQuestions } from './question-bank';
import {
  CompleteOrientationSessionInput,
  CreateOrientationSessionInput,
  OrientationQuestionsResponse,
  OrientationSession,
  OrientationSessionStartResponse,
  OrientationVerdictResponse,
} from './orientation.types';

@Injectable()
export class OrientationService {
  private readonly sessions = new Map<string, OrientationSession>();

  constructor(private readonly groqService: GroqOrientationService) {}

  getIntroQuestions(): OrientationQuestionsResponse {
    return getIntroQuestions();
  }

  startSession(
    payload: CreateOrientationSessionInput,
  ): OrientationSessionStartResponse {
    const sessionId = randomUUID();
    const session: OrientationSession = {
      id: sessionId,
      educationLevel: payload.educationLevel,
      answers: payload.initialAnswers ?? [],
      createdAt: new Date(),
    };

    this.sessions.set(sessionId, session);

    const followUp = getFollowUpQuestions(payload.educationLevel);
    return {
      sessionId,
      ...followUp,
    };
  }

  async completeSession(
    sessionId: string,
    payload: CompleteOrientationSessionInput,
  ): Promise<OrientationVerdictResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(
        `Aucune session active pour lidentifiant ${sessionId}`,
      );
    }

    session.answers.push(...payload.followUpAnswers);

    const verdict = await this.groqService.generateVerdict({
      educationLevel: session.educationLevel,
      answers: session.answers,
      followUpAnswers: payload.followUpAnswers,
      studentNotes: payload.studentNotes,
    });

    this.sessions.delete(sessionId);
    return { verdict };
  }
}
