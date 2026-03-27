import simulationDeveloppeur from "./developpeur-1h.json";
import simulationDeveloppeurJournee from "./developpeur-1h-journee.json";

export type SimulationCategory =
  | "tech"
  | "sante"
  | "commerce"
  | "social"
  | "art-design"
  | "droit"
  | "nature";

export type SimulationLevel = "decouverte" | "intermediaire" | "avance";
export type SimulationBadgeIcon = "steps" | "bolt" | "code" | "rocket";

export interface SimulationBadgeData {
  icon: SimulationBadgeIcon;
  label: string;
}

export interface SimulationChoiceData {
  id?: string;
  label: string;
  correct?: boolean;
  feedback: string;
}

export interface SimulationScenarioData {
  texte: string;
  consigne: string;
}

export interface SimulationScenarioStepData {
  id: string;
  type: "scenario";
  tag: string;
  label_type: string;
  titre: string;
  sous_titre: string;
  scenario: SimulationScenarioData;
  indice: string;
  choices: SimulationChoiceData[];
}

export interface SimulationJourneyStepData {
  id: string;
  type: "journee";
  tag: string;
  label_type: string;
  titre: string;
  sous_titre: string;
  redirect: string;
}

export type SimulationStepData =
  | SimulationScenarioStepData
  | SimulationJourneyStepData;

export interface SimulationData {
  slug: string;
  titre: string;
  categorie: SimulationCategory;
  duree: string;
  niveau: SimulationLevel;
  description: string;
  compatibilityScore?: number;
  badges: SimulationBadgeData[];
  etapes: SimulationStepData[];
}

export type JourneySlotState = "done" | "active" | "locked";

export interface JourneySlotData {
  id: string;
  heure: string;
  titre: string;
  description: string;
  state: JourneySlotState;
  choices: SimulationChoiceData[];
}

export interface SimulationJourneyData {
  slug: string;
  slots: JourneySlotData[];
}

export const simulationCatalog = [simulationDeveloppeur as SimulationData];

const journeyCatalog: Record<string, SimulationJourneyData> = {
  [simulationDeveloppeurJournee.slug]: simulationDeveloppeurJournee as SimulationJourneyData,
};

export const simulationFilters = [
  { key: "tous", label: "Tous" },
  { key: "tech", label: "Tech" },
  { key: "sante", label: "Santé" },
  { key: "commerce", label: "Commerce" },
  { key: "social", label: "Social" },
  { key: "art-design", label: "Art & Design" },
  { key: "droit", label: "Droit" },
  { key: "nature", label: "Nature" },
] as const;

export type SimulationFilterKey = (typeof simulationFilters)[number]["key"];

export const categoryLabels: Record<SimulationCategory, string> = {
  tech: "Tech",
  sante: "Santé",
  commerce: "Commerce",
  social: "Social",
  "art-design": "Art & Design",
  droit: "Droit",
  nature: "Nature",
};

export const levelLabels: Record<SimulationLevel, string> = {
  decouverte: "Découverte",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export function getSimulationBySlug(slug?: string) {
  return simulationCatalog.find((simulation) => simulation.slug === slug);
}

export function getSimulationJourneyBySlug(slug?: string) {
  return slug ? journeyCatalog[slug] : undefined;
}

export function getSimulationStepIndex(
  simulation: SimulationData,
  type: SimulationStepData["type"],
) {
  return simulation.etapes.findIndex((step) => step.type === type);
}
