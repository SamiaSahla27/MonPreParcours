export type SessionPhase = "quiz" | "generating" | "ai-quiz" | "chat";

export type OrientationSegment = "collegien" | "lyceen" | "etudiant" | "adulte";

export type PhaseQuestionType = "single" | "multi" | "libre";

export interface PhaseQuestionOption {
  title: string;
  value: string;
  subtitle?: string;
}

export interface PhaseQuestionUiConfig {
  allowFreeText: boolean;
  freeTextPrompt?: string;
  freeTextPlaceholder?: string;
  submitButtonText: string;
  helperNote?: string;
  maxSelections?: number;
}

export interface BaseOrientationQuestion {
  id: string;
  db_key: string;
  type: PhaseQuestionType;
  questionText: string;
  subText: string;
  options: PhaseQuestionOption[];
  ui_config: PhaseQuestionUiConfig;
}

export interface PreProfileQuestion extends BaseOrientationQuestion {}

export interface PhaseQuestion extends BaseOrientationQuestion {
  segment: OrientationSegment;
}

export type PhaseQuestionBank = Record<OrientationSegment, PhaseQuestion[]>;

export interface SegmentProfileOption {
  segment: OrientationSegment;
  label: string;
  helper: string;
}

export interface QuizOption {
  id: string;
  label: string;
  helper?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  inputPlaceholder: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId?: string;
  selectedOptionLabel?: string;
  freeText?: string;
}

export interface PhaseQuestionAnswer {
  questionId: string;
  dbKey: string;
  selectedValues: string[];
  selectedTitles: string[];
  freeText?: string;
}

export interface TimelineStep {
  id: string;
  yearLabel: string;
  title: string;
  focus: string;
  milestones: string[];
}

export type SchoolType = "Public" | "Prive";

export interface SchoolRecommendation {
  id: string;
  name: string;
  city: string;
  status: SchoolType;
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

export interface ChatAttachment {
  type: "timeline" | "schools";
  timeline?: TimelineStep[];
  schools?: SchoolRecommendation[];
}

export type ChatRole = "assistant" | "user" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  attachments?: ChatAttachment[];
}
