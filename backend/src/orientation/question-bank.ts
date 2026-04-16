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
    prompt: "Dans quel environnement te sens-tu le plus à l'aise ?",
    inputPlaceholder:
      'Ex: Dans un labo, sur le terrain, devant un ordinateur...',
    options: [
      {
        id: 'build',
        label: "Quand je bouge, j'agis ou je construis",
        helper: 'Concret, technique, terrain',
      },
      {
        id: 'analyze',
        label: "Quand je réfléchis, je calcule ou j'examine un problème",
        helper: 'Logique, sciences, analyse',
      },
      {
        id: 'support',
        label: "Quand j'aide, j'écoute ou je conseille les autres",
        helper: 'Social, médical, contact',
      },
      {
        id: 'create',
        label: "Quand j'invente, je dessine ou j'imagine",
        helper: 'Créativité, art, design',
      },
    ],
  },
  {
    id: 'learning-pace',
    prompt: "Quelles matières t'intéressent le plus aujourd'hui ?",
    inputPlaceholder: 'Ex: SVT, Maths, Arts, Histoire...',
    options: [
      {
        id: 'accelerated',
        label: 'Aucune particulièrement, je préfère la pratique',
        helper: 'Manuel, professionnel, technique',
      },
      {
        id: 'progressive',
        label: 'Les mathématiques, la physique, la biologie',
        helper: 'Scientifique, logique',
      },
      {
        id: 'hybrid',
        label: "Le sport, la vie de classe, l'éducation civique",
        helper: 'Collectif, physique, social',
      },
      {
        id: 'self-paced',
        label: 'Les arts plastiques, le français, la musique',
        helper: 'Arts, lettres, culture',
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
    prompt: "Qu'est-ce qui te passionne en dehors des cours ?",
    inputPlaceholder: 'Ex: sport, jeux vidéo, lecture, bricolage...',
    options: [
      {
        id: 'mission-product',
        label: 'Bricoler, réparer des objets, faire du sport',
        helper: 'Action',
      },
      {
        id: 'mission-analytics',
        label: "L'informatique, la science, les documentaires",
        helper: 'Curiosité intellectuelle',
      },
      {
        id: 'mission-creative',
        label: 'Créer, dessiner, jouer de la musique, écrire',
        helper: 'Expression artistique',
      },
      {
        id: 'mission-support',
        label: 'Passer du temps avec mes amis, faire du bénévolat',
        helper: 'Altruisme',
      },
    ],
  },
  {
    id: 'team-role',
    prompt:
      "Dans un groupe d'amis ou de projet, tu es plutôt celui ou celle : ",
    inputPlaceholder: 'Ex: le leader, le rigolo, le réfléchi...',
    options: [
      {
        id: 'role-lead',
        label: 'Qui organise, décide et fonce',
        helper: 'Profil Action',
      },
      {
        id: 'role-analyst',
        label: 'Qui observe, analyse et trouve des solutions logiques',
        helper: 'Profil Réflexion',
      },
      {
        id: 'role-designer',
        label: 'Qui apporte les idées les plus originales',
        helper: 'Profil Créatif',
      },
      {
        id: 'role-mentor',
        label: "Qui s'assure que tout le monde s'entend bien",
        helper: 'Profil Humain',
      },
    ],
  },
  {
    id: 'problem-approach',
    prompt: 'Quand tu es face à un problème, que fais-tu ?',
    inputPlaceholder: "Ex: je demande de l'aide, je cherche sur internet...",
    options: [
      {
        id: 'approach-prototype',
        label: "J'essaie directement des choses concrètement",
        helper: "Apprendre par l'essai-erreur",
      },
      {
        id: 'approach-data',
        label: "Je me pose, j'analyse et je cherche des preuves",
        helper: 'Raisonnement logique',
      },
      {
        id: 'approach-creative',
        label: "J'imagine une solution complètement nouvelle",
        helper: 'Pensée latérale',
      },
      {
        id: 'approach-dialog',
        label: "J'en parle avec d'autres pour avoir leurs avis",
        helper: 'Collaboration',
      },
    ],
  },
  {
    id: 'creativity-role',
    prompt: "Qu'est-ce qui te dérangerait le plus dans un métier ?",
    inputPlaceholder: 'Ex: rester assis, le stress, la routine...',
    options: [
      {
        id: 'creativity-concept',
        label: 'Être enfermé dans un bureau toute la journée',
        helper: 'Besoin de bouger',
      },
      {
        id: 'creativity-structure',
        label: 'Faire des choses illogiques ou inutiles',
        helper: 'Besoin de sens/logique',
      },
      {
        id: 'creativity-story',
        label: "La routine absolue sans place pour l'imagination",
        helper: 'Besoin de liberté',
      },
      {
        id: 'creativity-guidance',
        label: "Ne voir personne et n'avoir aucun contact humain",
        helper: 'Besoin relationnel',
      },
    ],
  },
  {
    id: 'tech-confidence',
    prompt: 'Le monde de demain, tu le vois comment ?',
    inputPlaceholder: 'Ex: écologique, technologique, humain...',
    options: [
      {
        id: 'tech-builder',
        label: 'Plein de choses à construire ou réparer concrètement',
        helper: 'Bâtisseur',
      },
      {
        id: 'tech-analyst',
        label: "Guidé par les sciences, l'IA et la technologie",
        helper: 'Progrès',
      },
      {
        id: 'tech-no-code',
        label: "Un monde d'images, d'arts et de nouvelles expériences",
        helper: 'Culturel',
      },
      {
        id: 'tech-human',
        label: "Plus solidaire, écologique et tourné vers l'humain",
        helper: 'Sociétal',
      },
    ],
  },
  {
    id: 'decision-driver',
    prompt: "Qu'est-ce qui sera le plus important dans ton futur métier ?",
    inputPlaceholder: "Ex: le salaire, sauver des vies, s'amuser...",
    options: [
      {
        id: 'decision-kpi',
        label: 'Les résultats concrets et ma rémunération',
        helper: 'Efficacité',
      },
      {
        id: 'decision-evidence',
        label: 'Découvrir la vérité et résoudre des énigmes',
        helper: 'Savoir',
      },
      {
        id: 'decision-experience',
        label: 'Avoir toujours des projets nouveaux et passionnants',
        helper: 'Passion',
      },
      {
        id: 'decision-care',
        label: 'Me sentir utile et aider la société',
        helper: 'Utilité sociale',
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
