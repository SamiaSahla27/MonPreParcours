import {
  AdvisorVerdict,
  ChatMessage,
  QuizQuestion,
  SchoolRecommendation,
  TimelineStep,
} from "./types";

export const ORIENTATION_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "motivation",
    prompt: "Quand tu imagines ton futur job, quelle activite te motive le plus ?",
    inputPlaceholder: "Ex: J'aime concevoir des produits utiles pour les etudiants",
    options: [
      {
        id: "build-products",
        label: "Concevoir des produits tech utiles",
        helper: "Produit, UX, innovation",
      },
      {
        id: "analyze-data",
        label: "Analyser des donnees pour aider a decider",
        helper: "Data, strategie, impact",
      },
      {
        id: "help-people",
        label: "Accompagner des personnes dans leurs choix",
        helper: "Conseil, pedagogie, humain",
      },
      {
        id: "create-content",
        label: "Creer du contenu visuel et narratif",
        helper: "Design, media, creation",
      },
    ],
  },
  {
    id: "work-style",
    prompt: "Ton style de travail ideal ressemble plutot a quoi ?",
    inputPlaceholder: "Ex: Je prefere les projets en equipe avec des sprints courts",
    options: [
      {
        id: "startup-rhythm",
        label: "Rythme startup, iterations rapides",
        helper: "Agilite, experimentation",
      },
      {
        id: "research-depth",
        label: "Approche approfondie et analytique",
        helper: "Methodes, rigueur",
      },
      {
        id: "hybrid-balance",
        label: "Equilibre entre creativite et structure",
        helper: "Polyvalence",
      },
      {
        id: "field-action",
        label: "Terrain, ateliers, interventions concretes",
        helper: "Action, relationnel",
      },
    ],
  },
  {
    id: "education-horizon",
    prompt: "Quel horizon de formation te semble le plus realiste aujourd'hui ?",
    inputPlaceholder: "Ex: Bachelor en alternance puis specialisation master",
    options: [
      {
        id: "short-track",
        label: "Parcours court (Bac+2/Bac+3) avec insertion rapide",
        helper: "Professionnalisation rapide",
      },
      {
        id: "long-track",
        label: "Parcours long (Bac+5) pour viser des postes experts",
        helper: "Expertise avancee",
      },
      {
        id: "alternance",
        label: "Alternance pour apprendre en entreprise",
        helper: "Experience terrain",
      },
      {
        id: "flexible",
        label: "Mix public/prive + certifications progressives",
        helper: "Flexibilite",
      },
    ],
  },
  {
    id: "constraints",
    prompt: "Quelle contrainte doit etre absolument prise en compte ?",
    inputPlaceholder: "Ex: Je veux rester a Toulouse et garder des frais moderes",
    options: [
      {
        id: "budget",
        label: "Budget de formation maitrise",
        helper: "Public, bourses, alternance",
      },
      {
        id: "city",
        label: "Rester dans ma ville actuelle",
        helper: "Mobilite reduite",
      },
      {
        id: "international",
        label: "Avoir une ouverture internationale",
        helper: "Semestres abroad",
      },
      {
        id: "speed",
        label: "Monter vite en competences employables",
        helper: "Bootcamp, projets concrets",
      },
    ],
  },
];

export const DEFAULT_TIMELINE: TimelineStep[] = [
  {
    id: "y1",
    yearLabel: "Annee 1",
    title: "Fondations numeriques et orientation metier",
    focus: "Consolider les bases produit, data literacy et communication pro.",
    milestones: [
      "Construire 2 projets portfolio orientes utilisateur",
      "Valider un niveau B2 anglais pro",
      "Realiser une immersion de 6 semaines en entreprise",
    ],
  },
  {
    id: "y2",
    yearLabel: "Annee 2",
    title: "Specialisation Product & IA appliquee",
    focus: "Approfondir UX research, analytics produit et methodes IA no-code.",
    milestones: [
      "Prendre le lead sur un produit fil rouge en equipe",
      "Obtenir une certification data analytics (Google ou equivalent)",
      "Participer a un hackathon orientation/education",
    ],
  },
  {
    id: "y3",
    yearLabel: "Annee 3",
    title: "Professionnalisation et insertion",
    focus: "Alterner entre missions en entreprise et projet de fin d'etudes.",
    milestones: [
      "Alternance 12 mois sur un role Product ou UX",
      "Soutenance d'un projet IA utile a l'inclusion educative",
      "Preparation des candidatures Master ou CDI junior",
    ],
  },
  {
    id: "y4-5",
    yearLabel: "Annee 4-5",
    title: "Expertise et acceleration de carriere",
    focus: "Monter sur des postes Product Manager IA / Consultant orientation digitale.",
    milestones: [
      "Pilotage d'une roadmap produit avec KPI",
      "Publication d'etudes de cas sectorielles",
      "Ciblage de postes expert en public ou prive",
    ],
  },
];

export const DEFAULT_SCHOOLS: SchoolRecommendation[] = [
  {
    id: "epitech",
    name: "Epitech",
    city: "Paris / Lyon / Toulouse",
    status: "Prive",
    program: "Programme Grande Ecole - Expert en technologies de l'information",
    duration: "5 ans",
    annualCost: "Environ 9 900 EUR/an",
    whyItFits:
      "Parfait si tu veux un rythme projet intensif avec forte employabilite et ouverture startup.",
  },
  {
    id: "ups",
    name: "Universite Toulouse III - Paul Sabatier",
    city: "Toulouse",
    status: "Public",
    program: "Licence Informatique puis Master MIAGE / Data",
    duration: "3 ans + 2 ans",
    annualCost: "Frais universitaires nationaux",
    whyItFits:
      "Excellente option budget maitrise, solide academiquement, avec passerelles vers l'alternance.",
  },
  {
    id: "sorbonne",
    name: "Sorbonne Universite",
    city: "Paris",
    status: "Public",
    program: "Licence Informatique puis Master mention IA",
    duration: "5 ans",
    annualCost: "Frais universitaires nationaux",
    whyItFits:
      "Tres bon choix pour viser expertise IA et poursuite vers des roles R&D ou conseil avance.",
  },
  {
    id: "esilv",
    name: "ESILV",
    city: "Paris La Defense",
    status: "Prive",
    program: "Ingenieur numerique - majeure Data & IA",
    duration: "5 ans",
    annualCost: "Environ 11 000 EUR/an",
    whyItFits:
      "Cadre professionnalisant, projets entreprises et forte composante innovation produit.",
  },
];

export const DEFAULT_VERDICT: AdvisorVerdict = {
  title: "Verdict Orientation IA - Profil Product & IA appliquee",
  summary:
    "Ton profil montre une combinaison rare: sens utilisateur, capacite d'analyse et envie de concret. La trajectoire la plus pertinente est un parcours Product + IA appliquee, avec une forte dimension projet et alternance.",
  recommendedPath:
    "Cible prioritaire: Product Manager IA Junior ou Product Analyst avec specialisation orientation/edtech.",
  confidenceLabel: "Confiance elevee (87%)",
  keySkills: [
    "UX Research",
    "Data storytelling",
    "Prompt engineering",
    "Gestion de projet agile",
    "Communication conseil",
  ],
  timeline: DEFAULT_TIMELINE,
  schools: DEFAULT_SCHOOLS,
};

const FOLLOW_UP_LIBRARY = [
  "Excellente question. Pour avancer vite, priorise un projet concret par mois avec une preuve mesurable (portfolio, KPI, retour utilisateur).",
  "Sur ton contexte, la meilleure tactique est un parcours hybride: base academique solide + experiences terrain en alternance.",
  "Si tu veux securiser ton insertion, vise des formations avec partenaires entreprises et coaching carriere actif.",
  "Tu peux accelerer ton profil en combinant une certification data courte et une mission benevole sur un projet reel.",
  "Pour etre competitif, transforme chaque etape de formation en livrable visible: etude de cas, demo, article, recommandation mentor.",
];

export function getAssistantFollowUpReply(input: string): string {
  const normalized = input.toLowerCase();

  if (normalized.includes("salaire") || normalized.includes("remuneration")) {
    return "Pour un poste Product/IA junior en France, la fourchette d'entree est souvent entre 34k et 44k brut annuel, avec evolution rapide apres 18-24 mois selon ton portefeuille de projets.";
  }

  if (normalized.includes("alternance")) {
    return "Oui, l'alternance est un excellent accelerateur pour ton profil. Vise des missions produit/data et demande des objectifs clairs chaque trimestre pour capitaliser reellement.";
  }

  if (normalized.includes("ecole") || normalized.includes("formation")) {
    return "Je te recommande de comparer 3 criteres avant de choisir: niveau des projets reels, qualite du reseau entreprise et accompagnement insertion. C'est souvent plus determinant que la marque seule.";
  }

  const randomIndex = Math.floor(Math.random() * FOLLOW_UP_LIBRARY.length);
  return FOLLOW_UP_LIBRARY[randomIndex];
}

export function buildVerdictAsFirstMessage(verdict: AdvisorVerdict): ChatMessage {
  const content = [
    `${verdict.title}`,
    "",
    verdict.summary,
    "",
    `Cap principal: ${verdict.recommendedPath}`,
    `Niveau de confiance: ${verdict.confidenceLabel}`,
    "",
    `Competences a renforcer: ${verdict.keySkills.join(", ")}`,
  ].join("\n");

  return {
    id: "assistant-verdict",
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    attachments: [
      {
        type: "timeline",
        timeline: verdict.timeline,
      },
      {
        type: "schools",
        schools: verdict.schools,
      },
    ],
  };
}
