import {
  OrientationQuestionsResponse,
  OrientationQuizQuestion,
} from './orientation.types';

const INTRO_QUESTIONS: OrientationQuizQuestion[] = [
  {
    id: 'education-level',
    prompt: 'Quel est ton niveau detudes actuel ?',
    inputPlaceholder: 'Ex: Terminale generale, BTS SIO, reprise detudes...',
    options: [
      {
        id: 'college',
        label: 'College / Seconde',
        helper: 'Debut dorientation',
      },
      {
        id: 'lycee',
        label: 'Lycee - Premiere',
        helper: 'Choix des specialites',
      },
      {
        id: 'terminal',
        label: 'Terminale / Bac en cours',
        helper: 'Parcoursup imminent',
      },
      {
        id: 'bac_plus_2',
        label: 'Bac+1 / Bac+2',
        helper: 'Licence ou BTS/DUT',
      },
      {
        id: 'reconversion',
        label: 'Reconversion post-bac',
        helper: 'Projet adulte',
      },
    ],
  },
  {
    id: 'motivation-core',
    prompt: 'Quelle mission te motive le plus dans un futur job ?',
    inputPlaceholder:
      'Ex: Aider des equipes a concevoir des produits utiles...',
    options: [
      {
        id: 'build',
        label: 'Construire / concevoir des produits',
        helper: 'Produit, design, tech',
      },
      {
        id: 'analyze',
        label: 'Analyser pour orienter des decisions',
        helper: 'Data, strategie',
      },
      {
        id: 'support',
        label: 'Accompagner des personnes',
        helper: 'Conseil, pedagogie',
      },
      {
        id: 'create',
        label: 'Creer du contenu ou des experiences',
        helper: 'Media, evenementiel',
      },
    ],
  },
  {
    id: 'learning-pace',
    prompt: 'Quel rythme dapprentissage te correspond ?',
    inputPlaceholder: 'Ex: Alternance avec missions concretes...',
    options: [
      {
        id: 'accelerated',
        label: 'Intensif / bootcamp',
        helper: 'Resultats rapides',
      },
      {
        id: 'progressive',
        label: 'Progressif sur 3-5 ans',
        helper: 'Parcours classique',
      },
      {
        id: 'hybrid',
        label: 'Hybride: theorie + pratique',
        helper: 'Equilibre',
      },
      {
        id: 'self-paced',
        label: 'Autonome / projets perso',
        helper: 'Flexibilite totale',
      },
    ],
  },
  {
    id: 'constraints',
    prompt: 'Quelles contraintes dois-je absolument respecter ?',
    inputPlaceholder:
      'Ex: budget limite, rester en Occitanie, acces alternance',
    options: [
      {
        id: 'budget',
        label: 'Budget limite',
        helper: 'Priorite public/alternance',
      },
      {
        id: 'geo',
        label: 'Rester dans une region precise',
        helper: 'Mobilite reduite',
      },
      {
        id: 'international',
        label: 'Ouverture internationale',
        helper: 'Semestres abroad',
      },
      {
        id: 'fast-track',
        label: 'Insertion rapide',
        helper: 'Courtes formations',
      },
    ],
  },
  {
    id: 'favorite-mission',
    prompt: 'Quel type de mission te donne le plus denergie ?',
    inputPlaceholder: 'Ex: lancer un produit, optimiser un systeme...',
    options: [
      {
        id: 'mission-product',
        label: 'Imaginer / lancer de nouveaux produits',
        helper: 'Builders, entrepreneurs',
      },
      {
        id: 'mission-analytics',
        label: 'Optimiser des systemes par la data',
        helper: 'Strateges, analystes',
      },
      {
        id: 'mission-creative',
        label: 'Creer des experiences / contenus memorables',
        helper: 'Creatifs, narrateurs',
      },
      {
        id: 'mission-support',
        label: 'Accompagner et coacher des personnes',
        helper: 'Mentors, facilitateurs',
      },
    ],
  },
  {
    id: 'team-role',
    prompt: 'Dans une equipe, quel role prends-tu naturellement ?',
    inputPlaceholder: 'Ex: lead produit, analyste, facilitateur...',
    options: [
      {
        id: 'role-lead',
        label: 'Piloter la vision et prioriser',
        helper: 'Profil builder',
      },
      {
        id: 'role-analyst',
        label: 'Creuser les donnees pour orienter les choix',
        helper: 'Profil strategist',
      },
      {
        id: 'role-designer',
        label: 'Designer des experiences immersives',
        helper: 'Profil creative',
      },
      {
        id: 'role-mentor',
        label: 'Coach / faire grandir les autres',
        helper: 'Profil mentor',
      },
    ],
  },
  {
    id: 'problem-approach',
    prompt:
      'Quand un probleme complexe surgit, quelle est ta premiere action ?',
    inputPlaceholder: 'Ex: prototyper, analyser, brainstormer...',
    options: [
      {
        id: 'approach-prototype',
        label: 'Construire un prototype pour tester vite',
        helper: 'Approche builder',
      },
      {
        id: 'approach-data',
        label: 'Analyser les donnees et definir des hypotheses',
        helper: 'Approche strategist',
      },
      {
        id: 'approach-creative',
        label: 'Brainstormer des pistes originales',
        helper: 'Approche creative',
      },
      {
        id: 'approach-dialog',
        label: 'Reunir les parties prenantes et faciliter',
        helper: 'Approche mentor',
      },
    ],
  },
  {
    id: 'creativity-role',
    prompt: 'Quel espace creatif veux-tu absolument garder ?',
    inputPlaceholder: 'Ex: direction artistique, narration, design...',
    options: [
      {
        id: 'creativity-concept',
        label: 'Conceptualiser des produits / services',
        helper: 'Builder vision',
      },
      {
        id: 'creativity-structure',
        label: 'Structurer des strategies et roadmaps',
        helper: 'Strategist vision',
      },
      {
        id: 'creativity-story',
        label: 'Raconter, scenariser, designer des univers',
        helper: 'Creative vision',
      },
      {
        id: 'creativity-guidance',
        label: 'Imaginer des parcours daccompagnement',
        helper: 'Mentor vision',
      },
    ],
  },
  {
    id: 'tech-confidence',
    prompt: 'Quel est ton rapport actuel aux outils tech / IA ?',
    inputPlaceholder: 'Ex: code, data, no-code, posture humaine...',
    options: [
      {
        id: 'tech-builder',
        label: 'Je code / prototype regulierement',
        helper: 'Builder hands-on',
      },
      {
        id: 'tech-analyst',
        label: 'Je manipule des jeux de donnees / dashboards',
        helper: 'Strategist data',
      },
      {
        id: 'tech-no-code',
        label: 'Je mixe no-code, design et IA generative',
        helper: 'Creative maker',
      },
      {
        id: 'tech-human',
        label: 'Je privilegie la relation humaine, IA en support',
        helper: 'Mentor focus humain',
      },
    ],
  },
  {
    id: 'decision-driver',
    prompt: 'Qu est-ce qui guide tes decisions finales ?',
    inputPlaceholder: 'Ex: impact utilisateur, data, intuition...',
    options: [
      {
        id: 'decision-kpi',
        label: 'Les indicateurs business / produit',
        helper: 'Builder oriente impact',
      },
      {
        id: 'decision-evidence',
        label: 'Les preuves chifrees et la logique',
        helper: 'Strategist rationnel',
      },
      {
        id: 'decision-experience',
        label: 'Le ressenti utilisateur et la narration',
        helper: 'Creative experience',
      },
      {
        id: 'decision-care',
        label: 'Le bien-etre des personnes accompagnees',
        helper: 'Mentor care',
      },
    ],
  },
];

export const INTRO_QUESTION_COUNT = INTRO_QUESTIONS.length;

export function getIntroQuestions(): OrientationQuestionsResponse {
  return {
    stage: 'intro',
    questions: INTRO_QUESTIONS,
  };
}
