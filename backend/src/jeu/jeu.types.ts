export type JeuPhase = 'lobby' | 'quiz' | 'cercle' | 'termine' | 'pause';

export interface ParticipantJeu {
  participantId: string;
  socketId: string;
  score: number;
  reponses: number[];
  connected: boolean;
}

export interface ResultatQuestion {
  A: number;
  B: number;
  C: number;
  D: number;
  total: number;
}

export interface SessionJeu {
  pin: string;
  animatriceId: string;
  recoveryKey: string;
  currentQuestion: number;
  phase: JeuPhase;
  phaseAvantPause?: JeuPhase;
  participants: Map<string, ParticipantJeu>;
  resultats: Record<number, ResultatQuestion>;
  repondants: Record<number, Set<string>>;
}

export interface CreerSessionPayload {
  accessCode: string;
}

export interface RejoindrePayload {
  pin: string;
  participantId: string;
}

export interface RepondrePayload {
  pin: string;
  participantId: string;
  questionIndex: number;
  optionIndex: number;
  correctIndex?: number;
  isPoll: boolean;
  timeLeft: number;
}

export interface QuestionSuivantePayload {
  pin: string;
  questionIndex: number;
  phase?: 'quiz' | 'cercle';
}

export interface AfficherReponsePayload {
  pin: string;
  questionIndex: number;
  correctIndex?: number;
}

export interface TerminerJeuPayload {
  pin: string;
}

export interface ReprendreSessionPayload {
  pin: string;
  recoveryKey: string;
}

export interface ResultatsLivePayload {
  questionIndex: number;
  resultats: ResultatQuestion;
  participantCount: number;
  responsePercentage: number;
}
