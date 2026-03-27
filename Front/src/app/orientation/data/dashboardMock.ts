import { AdvisorVerdict, TimelineStep } from "../types";

export type SchoolStatus = "Public" | "Prive";

export interface OrientationVerdict {
  profile: string;
  description: string;
  mainTarget: string;
  confidence: number;
  skillsToImprove: string[];
}

export interface OrientationTimelineStep {
  id: string;
  yearTitle: string;
  subtitle: string;
  details: string[];
}

export interface SchoolRecommendationCard {
  id: string;
  name: string;
  location: string;
  status: SchoolStatus;
  program: string;
  duration: string;
  cost: string;
  conclusion: string;
}

export interface OrientationResultSession {
  id: string;
  tabLabel: string;
  generatedAt: string;
  modificationPrompt: string;
  verdict: OrientationVerdict;
  timeline: OrientationTimelineStep[];
  schools: SchoolRecommendationCard[];
}

const PROFILE_VARIANTS = [
  {
    profile: "Analytique collaboratif",
    description:
      "Profil structure, a l'aise avec la logique et la coordination. Recommande pour des trajectoires progressives avec impact concret.",
    confidenceDelta: 0,
    skillShift: ["Priorisation produit", "Communication ecrite", "Analyse de donnees"],
  },
  {
    profile: "Creatif structure",
    description:
      "Profil hybride, capable de transformer une idee en execution solide. Bon fit pour roles UX, produit et innovation.",
    confidenceDelta: 3,
    skillShift: ["Storytelling", "Prototype rapide", "Pilotage agile"],
  },
  {
    profile: "Pragmatique social",
    description:
      "Profil oriente action et relationnel. Excellente base pour conseil, accompagnement et gestion de parcours.",
    confidenceDelta: -2,
    skillShift: ["Ecoute active", "Animation d'ateliers", "Planification"],
  },
] as const;

function parseConfidencePercent(confidenceLabel: string): number {
  const match = confidenceLabel.match(/(\d+)/);
  if (!match) {
    return 82;
  }

  const confidence = Number(match[1]);
  if (Number.isNaN(confidence)) {
    return 82;
  }

  return Math.max(0, Math.min(100, confidence));
}

function mapTimeline(steps: TimelineStep[]): OrientationTimelineStep[] {
  return steps.map((step) => ({
    id: step.id,
    yearTitle: step.yearLabel,
    subtitle: step.title,
    details: [step.focus, ...step.milestones],
  }));
}

function nowLabel(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function buildSchoolsFromVerdict(verdict: AdvisorVerdict): SchoolRecommendationCard[] {
  return verdict.schools.map((school) => ({
    id: school.id,
    name: school.name,
    location: school.city,
    status: school.status,
    program: school.program,
    duration: school.duration,
    cost: school.annualCost,
    conclusion: school.whyItFits,
  }));
}

function buildVerdictVariant(
  source: AdvisorVerdict,
  generationNumber: number,
  modificationPrompt: string,
  segmentLabel?: string
): OrientationVerdict {
  const variant = PROFILE_VARIANTS[(generationNumber - 1) % PROFILE_VARIANTS.length];
  const confidence = Math.max(
    55,
    Math.min(98, parseConfidencePercent(source.confidenceLabel) + variant.confidenceDelta)
  );

  const segmentLine = segmentLabel ? `Profil segment: ${segmentLabel}.` : "";
  const modificationLine = modificationPrompt
    ? `Ajustement demande: ${modificationPrompt}.`
    : "";

  return {
    profile: variant.profile,
    description: `${variant.description} ${segmentLine} ${modificationLine}`.trim(),
    mainTarget: source.recommendedPath,
    confidence,
    skillsToImprove: [...variant.skillShift],
  };
}

function buildTimelineVariant(
  source: AdvisorVerdict,
  generationNumber: number,
  modificationPrompt: string
): OrientationTimelineStep[] {
  return mapTimeline(source.timeline).map((step, index) => {
    if (!modificationPrompt) {
      return step;
    }

    if (index !== 0) {
      return step;
    }

    return {
      ...step,
      details: [...step.details, `Ajustement de generation ${generationNumber}: ${modificationPrompt}`],
    };
  });
}

function buildSchoolsVariant(
  source: AdvisorVerdict,
  generationNumber: number,
  modificationPrompt: string
): SchoolRecommendationCard[] {
  const schools = buildSchoolsFromVerdict(source);

  if (!modificationPrompt) {
    return schools;
  }

  return schools.map((school, index) => {
    if (index !== 0) {
      return school;
    }

    return {
      ...school,
      conclusion: `${school.conclusion} Ajustement specifique (${generationNumber}): ${modificationPrompt}`,
    };
  });
}

export function createBaseResultSessions(
  source: AdvisorVerdict,
  segmentLabel?: string
): OrientationResultSession[] {
  const first: OrientationResultSession = {
    id: "session-1",
    tabLabel: "Recherche #1",
    generatedAt: nowLabel(),
    modificationPrompt: "",
    verdict: buildVerdictVariant(source, 1, "", segmentLabel),
    timeline: buildTimelineVariant(source, 1, ""),
    schools: buildSchoolsVariant(source, 1, ""),
  };

  const secondPrompt = "Affiner la projection long terme";
  const second: OrientationResultSession = {
    id: "session-2",
    tabLabel: "Recherche #2",
    generatedAt: nowLabel(),
    modificationPrompt: secondPrompt,
    verdict: buildVerdictVariant(source, 2, secondPrompt, segmentLabel),
    timeline: buildTimelineVariant(source, 2, secondPrompt),
    schools: buildSchoolsVariant(source, 2, secondPrompt),
  };

  return [first, second];
}

export function buildNextMockSession(
  source: AdvisorVerdict,
  generationNumber: number,
  modificationPrompt: string,
  segmentLabel?: string
): OrientationResultSession {
  return {
    id: `session-${generationNumber}`,
    tabLabel: `Recherche #${generationNumber}`,
    generatedAt: nowLabel(),
    modificationPrompt,
    verdict: buildVerdictVariant(source, generationNumber, modificationPrompt, segmentLabel),
    timeline: buildTimelineVariant(source, generationNumber, modificationPrompt),
    schools: buildSchoolsVariant(source, generationNumber, modificationPrompt),
  };
}
