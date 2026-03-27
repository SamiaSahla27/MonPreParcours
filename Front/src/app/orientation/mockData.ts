import phase1Raw from "./data/phase1.json?raw";
import phase2Raw from "./data/phase2.json?raw";
import {
  AdvisorVerdict,
  ChatMessage,
  OrientationSegment,
  PhaseQuestion,
  PhaseQuestionBank,
  PreProfileQuestion,
  SchoolRecommendation,
  SegmentProfileOption,
  TimelineStep,
} from "./types";

const PHASE1_QUIZ_BY_SEGMENT = JSON.parse(phase1Raw) as PhaseQuestionBank;
const PHASE2_QUIZ_BY_SEGMENT = JSON.parse(phase2Raw) as PhaseQuestionBank;

export const PRE_PROFILE_GENERIC_QUESTIONS: PreProfileQuestion[] = [
  {
    id: "G1",
    db_key: "objectif_global",
    type: "single",
    questionText: "Avant de commencer, quel est ton objectif principal aujourd'hui ?",
    subText: "Question 1 sur 10",
    options: [
      { title: "Mieux me connaitre", value: "self_discovery" },
      { title: "Trouver une voie concrete", value: "concrete_path" },
      { title: "Comparer plusieurs options", value: "compare_options" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
      helperNote: "On pose d'abord un cadre general avant le profil detaille.",
    },
  },
  {
    id: "G2",
    db_key: "style_apprentissage",
    type: "single",
    questionText: "Quel style d'apprentissage te correspond le mieux ?",
    subText: "Question 2 sur 10",
    options: [
      { title: "Projets pratiques", value: "practice" },
      { title: "Cours structures", value: "structured" },
      { title: "Mix theorie + pratique", value: "hybrid" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G3",
    db_key: "force_naturelle",
    type: "single",
    questionText: "Sur quoi te sens-tu naturellement plus fort ?",
    subText: "Question 3 sur 10",
    options: [
      { title: "Creativite", value: "creative" },
      { title: "Analyse", value: "analysis" },
      { title: "Communication", value: "communication" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G4",
    db_key: "mode_collaboration",
    type: "single",
    questionText: "Tu preferes avancer comment ?",
    subText: "Question 4 sur 10",
    options: [
      { title: "En equipe", value: "team" },
      { title: "En autonomie", value: "solo" },
      { title: "Un peu des deux", value: "mixed" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G5",
    db_key: "type_impact",
    type: "single",
    questionText: "Quel type d'impact te motive le plus ?",
    subText: "Question 5 sur 10",
    options: [
      { title: "Aider les personnes", value: "human" },
      { title: "Construire des solutions", value: "builder" },
      { title: "Ameliorer des systemes", value: "systems" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G6",
    db_key: "horizon_temps",
    type: "single",
    questionText: "Sur quel horizon veux-tu voir des resultats ?",
    subText: "Question 6 sur 10",
    options: [
      { title: "Court terme", value: "short" },
      { title: "Moyen terme", value: "medium" },
      { title: "Long terme", value: "long" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G7",
    db_key: "format_preferentiel",
    type: "single",
    questionText: "Quel format de parcours te rassure le plus ?",
    subText: "Question 7 sur 10",
    options: [
      { title: "Concret et progressif", value: "progressive" },
      { title: "Exploratoire et ouvert", value: "exploratory" },
      { title: "Cadre tres structure", value: "very_structured" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G8",
    db_key: "rapport_donnees",
    type: "single",
    questionText: "Quel est ton rapport aux donnees et chiffres ?",
    subText: "Question 8 sur 10",
    options: [
      { title: "J'aime bien analyser", value: "data_positive" },
      { title: "Je prefere l'operationnel", value: "data_neutral" },
      { title: "Je veux progresser", value: "data_learning" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G9",
    db_key: "contrainte_mobilite",
    type: "single",
    questionText: "As-tu une contrainte forte de mobilite ?",
    subText: "Question 9 sur 10",
    options: [
      { title: "Je reste dans ma ville", value: "fixed_city" },
      { title: "Je peux bouger en France", value: "france_mobile" },
      { title: "Je suis ouvert a l'international", value: "global_mobile" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Suivant",
    },
  },
  {
    id: "G10",
    db_key: "niveau_engagement",
    type: "single",
    questionText: "Pret pour un diagnostic complet en plusieurs etapes ?",
    subText: "Question 10 sur 10",
    options: [
      { title: "Oui, on y va", value: "ready_yes" },
      { title: "Oui, mais progressivement", value: "ready_soft" },
      { title: "Je veux rester simple", value: "ready_light" },
    ],
    ui_config: {
      allowFreeText: false,
      submitButtonText: "Passer au profil",
      helperNote: "Apres cette etape, on te demande ton profil pour personnaliser finement.",
    },
  },
];

export const SEGMENT_PROFILE_OPTIONS: SegmentProfileOption[] = [
  {
    segment: "collegien",
    label: "Collegien",
    helper: "Tu es au college et tu prepares les premiers choix post-3e.",
  },
  {
    segment: "lyceen",
    label: "Lyceen",
    helper: "Tu prevois ton post-bac et les choix de formations.",
  },
  {
    segment: "etudiant",
    label: "Etudiant",
    helper: "Tu veux ajuster ton parcours ou reorienter tes etudes.",
  },
  {
    segment: "adulte",
    label: "Adulte",
    helper: "Tu es en reconversion ou en repositionnement professionnel.",
  },
];

export function getSegmentLabel(segment: OrientationSegment): string {
  const item = SEGMENT_PROFILE_OPTIONS.find((option) => option.segment === segment);
  return item?.label ?? segment;
}

export function getPhase1QuestionsBySegment(segment: OrientationSegment): PhaseQuestion[] {
  return PHASE1_QUIZ_BY_SEGMENT[segment] ?? [];
}

export function getMockAiGeneratedQuestionsBySegment(
  segment: OrientationSegment,
  count = 3
): PhaseQuestion[] {
  return (PHASE2_QUIZ_BY_SEGMENT[segment] ?? []).slice(0, count).map((question, index, list) => {
    const isLast = index === list.length - 1;

    return {
      ...question,
      id: `AI-${segment}-${index + 1}-${question.id}`,
      questionText: `Question IA ${index + 1}: ${question.questionText}`,
      ui_config: {
        ...question.ui_config,
        submitButtonText: isLast ? "Terminer les questions IA" : "Question suivante",
        helperNote:
          question.ui_config.helperNote ??
          "Question de precision generee par l'IA pour affiner la recommandation finale.",
      },
    };
  });
}

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

export function buildVerdictAsFirstMessage(
  verdict: AdvisorVerdict,
  segmentLabel?: string
): ChatMessage {
  const content = [
    `${verdict.title}`,
    segmentLabel ? `Profil detecte: ${segmentLabel}` : "",
    "",
    verdict.summary,
    "",
    `Cap principal: ${verdict.recommendedPath}`,
    `Niveau de confiance: ${verdict.confidenceLabel}`,
    "",
    `Competences a renforcer: ${verdict.keySkills.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

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
