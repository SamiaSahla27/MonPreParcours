export const SIMULATION_CATEGORIES = [
  "Tous",
  "Sante",
  "Tech",
  "Commerce",
  "Art & Design",
  "Social",
  "Droit",
  "Nature",
] as const;

export type SimulationCategory = (typeof SIMULATION_CATEGORIES)[number];
export type SimulationLevel = "Decouverte" | "Intermediaire" | "Avance";

export interface SimulationDefinition {
  id: string;
  slug: string;
  title: string;
  categorie: Exclude<SimulationCategory, "Tous">;
  duree: string;
  niveau: SimulationLevel;
  compatibilityScore?: number;
  description: string;
}

export const SIMULATION_CATEGORY_STYLES: Record<
  Exclude<SimulationCategory, "Tous">,
  { color: string; background: string; border: string }
> = {
  Sante: { color: "#BE185D", background: "#FCE7F3", border: "#F9A8D4" },
  Tech: { color: "#1D4ED8", background: "#DBEAFE", border: "#93C5FD" },
  Commerce: { color: "#B45309", background: "#FEF3C7", border: "#FCD34D" },
  "Art & Design": { color: "#7C3AED", background: "#EDE9FE", border: "#C4B5FD" },
  Social: { color: "#0F766E", background: "#CCFBF1", border: "#5EEAD4" },
  Droit: { color: "#92400E", background: "#FDE68A", border: "#FBBF24" },
  Nature: { color: "#15803D", background: "#DCFCE7", border: "#86EFAC" },
};

export const SIMULATION_LEVEL_STYLES: Record<
  SimulationLevel,
  { color: string; background: string; border: string }
> = {
  Decouverte: { color: "#166534", background: "#ECFDF5", border: "#86EFAC" },
  Intermediaire: { color: "#9A3412", background: "#FFF7ED", border: "#FDBA74" },
  Avance: { color: "#9F1239", background: "#FFF1F2", border: "#FDA4AF" },
};

export const simulationCatalog: SimulationDefinition[] = [
  {
    id: "sim-dev-1h",
    slug: "developpeur-1h",
    title: "Developpeur",
    categorie: "Tech",
    duree: "~1h",
    niveau: "Decouverte",
    compatibilityScore: 92,
    description:
      "Entre dans une mission guidee pour comprendre un besoin, corriger un bug, tester une regle et deployer.",
  },
];
