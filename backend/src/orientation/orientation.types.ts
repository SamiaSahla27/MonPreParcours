export type EducationLevel =
  | 'college'
  | 'lycee'
  | 'terminal'
  | 'bac_plus_2'
  | 'reconversion';

export interface OrientationQuizOption {
  id: string;
  label: string;
  helper?: string;
}

export interface OrientationQuizQuestion {
  id: string;
  prompt: string;
  inputPlaceholder: string;
  options: OrientationQuizOption[];
}

export interface OrientationQuizAnswer {
  questionId: string;
  selectedOptionId?: string;
  selectedOptionLabel?: string;
  freeText?: string;
}

export interface TimelineStep {
  id: string;
  yearLabel: string;
  title: string;
  focus: string;
  milestones: string[];
}

export interface SchoolRecommendation {
  id: string;
  name: string;
  city: string;
  status: 'Public' | 'Prive';
  program: string;
  duration: string;
  annualCost: string;
  whyItFits: string;
}

export interface AdvisorVerdict {
  title: string;
  summary: string;
  recommendedPath: string;
  confidenceLabel: string;
  keySkills: string[];
  timeline: TimelineStep[];
  schools: SchoolRecommendation[];
}

export interface OrientationSession {
  id: string;
  educationLevel: EducationLevel;
  answers: OrientationQuizAnswer[];
  createdAt: Date;
}

export interface OrientationQuestionsResponse {
  stage: 'intro' | 'follow-up';
  questions: OrientationQuizQuestion[];
}

export interface CreateOrientationSessionInput {
  educationLevel: EducationLevel;
  initialAnswers: OrientationQuizAnswer[];
  contextNotes?: string;
}

export interface OrientationSessionStartResponse extends OrientationQuestionsResponse {
  sessionId: string;
}

export interface CompleteOrientationSessionInput {
  followUpAnswers: OrientationQuizAnswer[];
  studentNotes?: string;
}

export interface OrientationVerdictResponse {
  verdict: AdvisorVerdict;
}

export interface OrientationGroqPayload {
  educationLevel: EducationLevel;
  answers: OrientationQuizAnswer[];
  followUpAnswers: OrientationQuizAnswer[];
  studentNotes?: string;
}
