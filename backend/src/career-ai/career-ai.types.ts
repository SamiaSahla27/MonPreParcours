export type TransformationImpact = 'faible' | 'modéré' | 'élevé';

export type TimeHorizon = '0-3 ans' | '3-7 ans' | '7+ ans';

export type SkillPriority = 'haute' | 'moyenne' | 'basse';

export interface AnalyzeCareerInput {
    jobTitle: string;
    sector?: string;
    country?: string;
    educationLevel?: string;
}

export interface SkillRecommendation {
    skill: string;
    priority: SkillPriority;
    reason: string;
}

export interface CareerAiAnalysis {
    jobTitle: string;
    aiCompatibilityScore: number;
    transformationImpact: TransformationImpact;
    timeHorizon: TimeHorizon;
    resilienceDrivers: string[];
    automationRisks: string[];
    skillsToDevelop: SkillRecommendation[];
    emergingAdjacentRoles: string[];
    adviceForYoungPeople: string[];
    confidence: number;
    disclaimer: string;
}
