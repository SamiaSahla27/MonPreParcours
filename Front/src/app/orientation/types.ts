export type SessionPhase = "quiz" | "generating" | "chat";

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
