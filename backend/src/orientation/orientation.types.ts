export type EducationLevel =
  | 'college'
  | 'lycee'
  | 'terminal'
  | 'bac_plus_2'
  | 'reconversion';

export type OrientationProfileId =
  | 'builder'
  | 'strategist'
  | 'creative'
  | 'mentor';

export interface OrientationProfile {
  id: OrientationProfileId;
  label: string;
  summary: string;
}

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
  profileId: OrientationProfileId;
  phase1Answers: OrientationQuizAnswer[];
  phase2Questions: OrientationQuizQuestion[];
  createdAt: Date;
}

export interface OrientationQuestionsResponse {
  stage: 'intro' | 'follow-up';
  questions: OrientationQuizQuestion[];
  profile?: OrientationProfile;
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
  profileId: OrientationProfileId;
  phase1Answers: OrientationQuizAnswer[];
  phase2Answers: OrientationQuizAnswer[];
  studentNotes?: string;
}
