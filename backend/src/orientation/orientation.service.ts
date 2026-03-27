import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GroqOrientationService } from './groq-orientation.service';
import { INTRO_QUESTION_COUNT, getIntroQuestions } from './question-bank';
import {
  CompleteOrientationSessionInput,
  CreateOrientationSessionInput,
  OrientationQuestionsResponse,
  OrientationSession,
  OrientationSessionStartResponse,
  OrientationVerdictResponse,
  OrientationQuizAnswer,
  OrientationQuizQuestion,
} from './orientation.types';
import {
  getFallbackFollowUpQuestions,
  inferOrientationProfile,
} from './profiles';

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
    const introAnswers = payload.initialAnswers ?? [];
    if (introAnswers.length !== INTRO_QUESTION_COUNT) {
      throw new BadRequestException(
        `Les ${INTRO_QUESTION_COUNT} questions de la phase 1 doivent etre renseignees avant de poursuivre.`,
      );
    }

    const profile = inferOrientationProfile(introAnswers);
    const phase2Questions = this.cloneQuestions(
      getFallbackFollowUpQuestions(profile.id),
    );

    const sessionId = randomUUID();
    const session: OrientationSession = {
      id: sessionId,
      educationLevel: payload.educationLevel,
      profileId: profile.id,
      phase1Answers: introAnswers,
      phase2Questions,
      createdAt: new Date(),
    };

    this.sessions.set(sessionId, session);

    return {
      sessionId,
      stage: 'follow-up',
      questions: phase2Questions,
      profile,
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

    this.assertFollowUpCompleteness(
      session.phase2Questions,
      payload.followUpAnswers,
    );

    const verdict = await this.groqService.generateVerdict({
      educationLevel: session.educationLevel,
      profileId: session.profileId,
      phase1Answers: session.phase1Answers,
      phase2Answers: payload.followUpAnswers,
      studentNotes: payload.studentNotes,
    });

    this.sessions.delete(sessionId);
    return { verdict };
  }
  private cloneQuestions(
    questions: OrientationQuizQuestion[],
  ): OrientationQuizQuestion[] {
    return questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    }));
  }

  private assertFollowUpCompleteness(
    expectedQuestions: OrientationQuizQuestion[],
    providedAnswers: OrientationQuizAnswer[],
  ): void {
    const expectedCount = expectedQuestions.length;
    if (providedAnswers.length !== expectedCount) {
      throw new BadRequestException(
        `Merci de renseigner les ${expectedCount} questions de precision avant generation du verdict.`,
      );
    }

    const expectedIds = new Set(
      expectedQuestions.map((question) => question.id),
    );
    for (const answer of providedAnswers) {
      expectedIds.delete(answer.questionId);
    }

    if (expectedIds.size > 0) {
      throw new BadRequestException(
        'Certaines questions de precision sont manquantes ou invalides.',
      );
    }
  }
}
