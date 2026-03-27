export type ResultType = "career" | "simulator" | "professional" | "company" | "resource";

export interface CareerResult {
  type: "career";
  id: string;
  title: string;
  sector: string;
  description: string;
  matchScore: number;
  matchLabel: string;
  salaryRange: string;
  tags: string[];
}

export interface SimulatorResult {
  type: "simulator";
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  color: string;
  participants: number;
}

export interface ProfessionalResult {
  type: "professional";
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  avatar: string;
  available: boolean;
  availabilityLabel: string;
  expertise: string[];
  sessionsCount: number;
}

export interface CompanyResult {
  type: "company";
  id: string;
  name: string;
  sector: string;
  logo: string;
  labels: { text: string; color: string; bg: string }[];
  description: string;
  diversityScore?: number;
}

export interface ResourceResult {
  type: "resource";
  id: string;
  title: string;
  source: string;
  readTime: string;
  resilienceScore: number;
  description: string;
  tag: string;
}

export type SearchResult =
  | CareerResult
  | SimulatorResult
  | ProfessionalResult
  | CompanyResult
  | ResourceResult;

export const MOCK_RESULTS: SearchResult[] = [
  // Featured / top match
  {
    type: "career",
    id: "ux-designer",
    title: "UX Designer",
    sector: "Design & Numérique",
    description:
      "Conçois des interfaces et des expériences numériques centrées sur l'utilisateur. Un métier créatif et analytique à la croisée du design et de la technologie.",
    matchScore: 96,
    matchLabel: "Très proche de ton profil",
    salaryRange: "38 000 – 65 000 €/an",
    tags: ["Créatif", "Tech", "Recherche utilisateur"],
  },
  {
    type: "simulator",
    id: "sim-dev-1h",
    title: "Simulation metier : Je suis developpeur pendant 1h",
    description:
      "Comprends un besoin, reperes un bug, testes une regle et mets une application en ligne dans une mini mission guidee.",
    duration: "12 min",
    difficulty: "DÃ©butant",
    color: "#2563EB",
    participants: 3184,
  },
  {
    type: "simulator",
    id: "sim-ux",
    title: "Journée dans la peau d'un UX Designer",
    description:
      "Mène une vraie session de recherche utilisateur, crée des wireframes et présente tes maquettes à un comité de direction fictif.",
    duration: "25 min",
    difficulty: "Intermédiaire",
    color: "#7C3AED",
    participants: 8420,
  },
  {
    type: "professional",
    id: "sophie-martin",
    name: "Sophie Martin",
    jobTitle: "Senior UI Designer",
    company: "Spotify",
    avatar: "SM",
    available: true,
    availabilityLabel: "Disponible cette semaine",
    expertise: ["UI Design", "Design System", "Figma"],
    sessionsCount: 142,
  },
  {
    type: "career",
    id: "product-designer",
    title: "Product Designer",
    sector: "Tech & Startups",
    description:
      "Pilote la conception produit de bout en bout — de la recherche à la livraison — en collaboration avec les équipes tech et business.",
    matchScore: 89,
    matchLabel: "Bonne compatibilité",
    salaryRange: "42 000 – 75 000 €/an",
    tags: ["Stratégie", "Prototypage", "Leadership"],
  },
  {
    type: "company",
    id: "decathlon",
    name: "Decathlon",
    sector: "Retail & Sport",
    logo: "DC",
    labels: [
      { text: "Label Diversité", color: "#7C3AED", bg: "#EDE9FE" },
      { text: "Index égalité 88/100", color: "#10B981", bg: "#ECFDF5" },
    ],
    description:
      "Leader mondial du sport engagé dans une politique d'inclusion forte : 53% de femmes cadres, recrutement inclusif, programme handicap.",
    diversityScore: 88,
  },
  {
    type: "resource",
    id: "design-ia",
    title: "Le design graphique face à l'IA : quels métiers survivront en 2030 ?",
    source: "OrientIA Research",
    readTime: "6 min",
    resilienceScore: 78,
    description:
      "Analyse approfondie des compétences en design qui résistent à l'automatisation et des nouveaux rôles hybrides qui émergent.",
    tag: "Analyse IA",
  },
  {
    type: "professional",
    id: "karim-benali",
    name: "Karim Benali",
    jobTitle: "Design Lead",
    company: "BlaBlaCar",
    avatar: "KB",
    available: false,
    availabilityLabel: "Disponible dans 2 semaines",
    expertise: ["Product Design", "Design Ops", "Mentorat"],
    sessionsCount: 89,
  },
  {
    type: "career",
    id: "motion-designer",
    title: "Motion Designer",
    sector: "Audiovisuel & Création",
    description:
      "Crée des animations, effets visuels et vidéos de marque pour des campagnes digitales et des interfaces produit.",
    matchScore: 74,
    matchLabel: "Compatible avec ton profil",
    salaryRange: "30 000 – 52 000 €/an",
    tags: ["Animation", "Vidéo", "Storytelling"],
  },
  {
    type: "simulator",
    id: "sim-product",
    title: "Sprint design : de l'idée au prototype en 20 min",
    description:
      "Vis un Google Design Sprint accéléré. Définis un problème, génère des solutions et prototypes une maquette cliquable.",
    duration: "20 min",
    difficulty: "Avancé",
    color: "#F97316",
    participants: 5231,
  },
  {
    type: "company",
    id: "ldlc",
    name: "LDLC Group",
    sector: "Tech & E-commerce",
    logo: "LD",
    labels: [
      { text: "Great Place to Work", color: "#F97316", bg: "#FFF7ED" },
      { text: "Label RH Innovant", color: "#0EA5E9", bg: "#F0F9FF" },
    ],
    description:
      "Pionnier de la semaine de 4 jours, LDLC mise sur le bien-être et l'inclusion pour attirer et retenir les talents créatifs.",
  },
  {
    type: "resource",
    id: "figma-ai",
    title: "Figma, Adobe Firefly, Midjourney : l'IA va-t-elle remplacer le designer ?",
    source: "Le Monde Informatique",
    readTime: "4 min",
    resilienceScore: 65,
    description:
      "Décryptage des outils IA créatifs et leur impact réel sur les postes de designers junior, mid et senior.",
    tag: "Veille outils",
  },
];

export const SECTORS = [
  "Tous les secteurs",
  "Tech & Numérique",
  "Santé & Social",
  "Design & Créatif",
  "Finance & Gestion",
  "Art & Culture",
  "Industrie",
  "Environnement",
];

export const RESULT_TYPES: { key: ResultType | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "career", label: "Métiers" },
  { key: "simulator", label: "Simulateurs" },
  { key: "professional", label: "Professionnels" },
  { key: "company", label: "Entreprises" },
  { key: "resource", label: "Ressources IA" },
];

export const SORT_OPTIONS = ["Pertinence", "Popularité", "Nouveauté"];
