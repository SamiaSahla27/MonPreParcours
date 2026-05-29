import {
  OrientationProfile,
  OrientationProfileId,
  OrientationQuizAnswer,
  OrientationQuizQuestion,
} from './orientation.types';

const PROFILE_ORDER: OrientationProfileId[] = [
  'builder',
  'strategist',
  'creative',
  'mentor',
];

const PROFILE_DEFINITIONS: Record<
  OrientationProfileId,
  OrientationProfile & { fallbackQuestions: OrientationQuizQuestion[] }
> = {
  builder: {
    id: 'builder',
    label: 'Profil Pragmatique & Action',
    summary:
      'Tu aimes le concret, agir sur le terrain, construire, réparer ou organiser des choses.',
    fallbackQuestions: [
      {
        id: 'builder-context',
        prompt: 'Dans quel environnement préfères-tu agir ?',
        inputPlaceholder: 'Choisis ton terrain de jeu idéal.',
        options: [
          {
            id: 'saas',
            label: 'En entreprise (bureaux / tech)',
            helper: 'Gestion et projets',
          },
          {
            id: 'app',
            label: 'En extérieur ou sur le terrain',
            helper: 'Mobilité',
          },
          {
            id: 'hardware',
            label: 'Dans un atelier ou laboratoire',
            helper: 'Technique et manuel',
          },
          {
            id: 'service',
            label: 'En contact direct avec des clients/usagers',
            helper: 'Service et commerce',
          },
        ],
      },
      {
        id: 'builder-metric',
        prompt: "Qu'est-ce qui te donne le sentiment du devoir accompli ?",
        inputPlaceholder: 'Choisis ta motivation principale.',
        options: [
          {
            id: 'adoption',
            label: 'Un projet terminé et qui fonctionne',
            helper: 'Résultat concret',
          },
          {
            id: 'engagement',
            label: 'Un problème complexe résolu',
            helper: 'Sens pratique',
          },
          {
            id: 'revenue',
            label: 'Avoir atteint mes objectifs (vente, sport, etc.)',
            helper: 'Performance',
          },
          {
            id: 'impact',
            label: "Avoir aidé concrètement quelqu'un",
            helper: 'Utilité',
          },
        ],
      },
      {
        id: 'builder-stack',
        prompt: "Quel type d'outils aimes-tu utiliser ?",
        inputPlaceholder: 'Choisis tes outils de prédilection.',
        options: [
          {
            id: 'ux',
            label: 'Outils numériques et logiciels',
            helper: 'Informatique',
          },
          {
            id: 'data',
            label: 'Des chiffres, des budgets, de la gestion',
            helper: 'Organisation',
          },
          {
            id: 'automation',
            label: 'Mes mains, des machines ou des instruments',
            helper: 'Manuel/Technique',
          },
          {
            id: 'ops',
            label: 'La parole, la négociation, le téléphone',
            helper: 'Communication',
          },
        ],
      },
      {
        id: 'builder-team',
        prompt: 'Comment aimes-tu travailler ?',
        inputPlaceholder: 'Choisis ta façon de travailler.',
        options: [
          {
            id: 'startup',
            label: 'Seul ou en toute autonomie',
            helper: 'Indépendance',
          },
          {
            id: 'scaleup',
            label: 'En petite équipe soudée',
            helper: 'Proximité',
          },
          {
            id: 'corporate',
            label: 'Dans une grande organisation très structurée',
            helper: 'Sécurité/Cadre',
          },
          {
            id: 'public',
            label: 'En déplacement, chaque jour est différent',
            helper: 'Aventure',
          },
        ],
      },
      {
        id: 'builder-rhythm',
        prompt: 'De quoi as-tu besoin pour apprendre efficacement ?',
        inputPlaceholder: "Choisis ta méthode d'apprentissage.",
        options: [
          {
            id: 'alternance',
            label: 'Apprendre par la pratique (Alternance/Stages)',
            helper: 'Immersif',
          },
          {
            id: 'bootcamp',
            label: 'Des cours courts et intenses',
            helper: 'Focus',
          },
          {
            id: 'project',
            label: 'Essayer par moi-même et me tromper',
            helper: 'Empirique',
          },
          {
            id: 'mentor',
            label: "Suivre les conseils d'un expert/mentor",
            helper: 'Coaching',
          },
        ],
      },
    ],
  },
  strategist: {
    id: 'strategist',
    label: 'Profil Analytique & Réflexion',
    summary:
      'Tu aimes comprendre le pourquoi du comment, observer, analyser et chercher des solutions logiques.',
    fallbackQuestions: [
      {
        id: 'strategist-domain',
        prompt: 'Quel domaine éveille le plus ta curiosité ?',
        inputPlaceholder: 'Choisis ce que tu aimes analyser.',
        options: [
          {
            id: 'edtech',
            label: 'Les sciences, la biologie, la santé',
            helper: 'Nature et Vivant',
          },
          {
            id: 'health',
            label: "L'informatique, les données, les maths",
            helper: 'Logique pure',
          },
          {
            id: 'finance',
            label: "L'économie, l'histoire, la société",
            helper: 'Sciences humaines',
          },
          {
            id: 'public',
            label: 'Les langues, la littérature, la culture',
            helper: 'Lettres et Arts',
          },
        ],
      },
      {
        id: 'strategist-stack',
        prompt: 'Comment préfères-tu creuser un sujet ?',
        inputPlaceholder: 'Choisis ta méthode.',
        options: [
          {
            id: 'python',
            label: 'En lisant beaucoup de documentation/livres',
            helper: 'Recherche théorique',
          },
          {
            id: 'sql',
            label: 'En croisant des données et des statistiques',
            helper: 'Analyse chiffrée',
          },
          {
            id: 'viz',
            label: 'En observant le comportement humain',
            helper: 'Psychologie',
          },
          {
            id: 'ml',
            label: 'En débattant et échangeant des idées',
            helper: 'Analyse critique',
          },
        ],
      },
      {
        id: 'strategist-dataset',
        prompt: "Quel type d'information retiens-tu le mieux ?",
        inputPlaceholder: 'Choisis ta mémoire prédominante.',
        options: [
          {
            id: 'usage',
            label: 'Des dates, des faits, la chronologie',
            helper: 'Mémoire factuelle',
          },
          {
            id: 'business',
            label: 'Des formules, des règles, des mécanismes',
            helper: 'Mémoire logique',
          },
          {
            id: 'public-data',
            label: 'Des images, des schémas, des cartes',
            helper: 'Mémoire visuelle',
          },
          {
            id: 'scientific',
            label: 'Des anecdotes, des histoires de vie',
            helper: 'Mémoire émotionnelle',
          },
        ],
      },
      {
        id: 'strategist-collab',
        prompt: 'Avec qui préfères-tu échanger sur tes idées ?',
        inputPlaceholder: 'Choisis ton interlocuteur idéal.',
        options: [
          {
            id: 'product',
            label: 'Des experts pointus dans un domaine',
            helper: 'Spécialistes',
          },
          {
            id: 'leadership',
            label: 'Ceux qui prennent les décisions (dirigeants)',
            helper: 'Stratégie',
          },
          {
            id: 'ops',
            label: 'Le grand public / tout le monde',
            helper: 'Vulgarisation',
          },
          {
            id: 'research',
            label: "D'autres chercheurs/étudiants passionnés",
            helper: 'Recherche',
          },
        ],
      },
      {
        id: 'strategist-impact',
        prompt: 'Quel est le but final de ton analyse ?',
        inputPlaceholder: 'Choisis ton objectif.',
        options: [
          {
            id: 'efficiency',
            label: 'Trouver la vérité absolue / une explication scientifique',
            helper: 'Vérité',
          },
          {
            id: 'growth',
            label: 'Aider à prendre de meilleures décisions',
            helper: 'Conseil',
          },
          {
            id: 'experience',
            label: 'Améliorer le quotidien des gens',
            helper: 'Impact',
          },
          {
            id: 'societal',
            label: 'Mieux comprendre la société de demain',
            helper: 'Prospective',
          },
        ],
      },
    ],
  },
  creative: {
    id: 'creative',
    label: 'Profil Créatif & Conception',
    summary:
      "Tu aimes imaginer l'inédit, concevoir des oeuvres, des espaces ou de nouvelles idées.",
    fallbackQuestions: [
      {
        id: 'creative-medium',
        prompt: 'Comment exprimes-tu le mieux ta créativité ?',
        inputPlaceholder: 'Choisis ton medium préféré.',
        options: [
          {
            id: 'ui',
            label: "Par le dessin, le design, l'art visuel",
            helper: 'Image',
          },
          {
            id: 'motion',
            label: "Par l'écriture, l'invention d'histoires",
            helper: 'Mots',
          },
          {
            id: 'audio',
            label: 'Par la musique, la vidéo, le spectacle',
            helper: 'Son & Scène',
          },
          {
            id: 'immersive',
            label: 'En inventant de nouveaux concepts/idées abstraites',
            helper: 'Innovation',
          },
        ],
      },
      {
        id: 'creative-toolkit',
        prompt: "Quel type d'environnement t'inspire le plus ?",
        inputPlaceholder: 'Choisis ton cadre de vie.',
        options: [
          {
            id: 'figma',
            label: "Les musées, la culture, l'architecture",
            helper: 'Arts',
          },
          {
            id: 'blender',
            label: 'La nature, les grands espaces, la biodiversité',
            helper: 'Organique',
          },
          {
            id: 'after-effects',
            label: 'Les villes ultra-modernes, la high-tech',
            helper: 'Futuriste',
          },
          {
            id: 'gen-ai',
            label: 'Les univers imaginaires (jeux, cinéma, livres)',
            helper: 'Fiction',
          },
        ],
      },
      {
        id: 'creative-tone',
        prompt: "Quelle est la qualité principale d'un de tes projets ?",
        inputPlaceholder: 'Choisis la qualité recherchée.',
        options: [
          {
            id: 'futuristic',
            label: "Son esthétique (c'est beau)",
            helper: 'Apparence',
          },
          {
            id: 'poetic',
            label: "Son originalité (ça n'existe pas encore)",
            helper: 'Nouveauté',
          },
          {
            id: 'bold',
            label: "L'émotion que ça procure",
            helper: 'Sensibilité',
          },
          {
            id: 'human',
            label: 'Son utilité et son design pratique',
            helper: 'Conception',
          },
        ],
      },
      {
        id: 'creative-collab',
        prompt: 'Comment aimes-tu développer tes idées ?',
        inputPlaceholder: 'Choisis ta dynamique créative.',
        options: [
          {
            id: 'engineers',
            label: 'Seul(e), dans ma bulle',
            helper: 'Introspection',
          },
          {
            id: 'marketers',
            label: "En brainstormant avec d'autres créatifs",
            helper: 'Emulsion collective',
          },
          {
            id: 'artists',
            label: "En m'inspirant des retours du public",
            helper: 'Itération',
          },
          {
            id: 'educators',
            label: 'Avec un cadre technique très précis',
            helper: 'Créativité sous contrainte',
          },
        ],
      },
      {
        id: 'creative-proof',
        prompt: "Qu'est-ce qui ferait ta fierté ultime ?",
        inputPlaceholder: 'Choisis ton accomplissement.',
        options: [
          {
            id: 'portfolio',
            label: 'Voir une de mes oeuvres exposée ou publiée',
            helper: 'Reconnaissance',
          },
          {
            id: 'prototype',
            label: "Savoir que des gens utilisent le produit que j'ai imaginé",
            helper: 'Application directe',
          },
          {
            id: 'exhibit',
            label: 'Gagner ma vie grâce à ma passion première',
            helper: 'Indépendance',
          },
          {
            id: 'playbook',
            label: 'Laisser une trace durable / marquer les esprits',
            helper: 'Héritage',
          },
        ],
      },
    ],
  },
  mentor: {
    id: 'mentor',
    label: 'Profil Social & Humain',
    summary: 'Tu aimes écouter, aider, accompagner ou soigner les autres.',
    fallbackQuestions: [
      {
        id: 'mentor-audience',
        prompt: "Quel public as-tu le plus envie d'accompagner ?",
        inputPlaceholder: 'Choisis le public ciblé.',
        options: [
          {
            id: 'youth',
            label: 'Les enfants ou les jeunes',
            helper: 'Éducation',
          },
          {
            id: 'students',
            label: 'Les personnes malades ou en difficulté',
            helper: 'Santé/Social',
          },
          {
            id: 'adults',
            label: 'Des clients, sportifs ou usagers au quotidien',
            helper: 'Service/Coach',
          },
          {
            id: 'teachers',
            label: 'Protéger ou défendre des citoyens',
            helper: 'Justice/Droit',
          },
        ],
      },
      {
        id: 'mentor-format',
        prompt: 'Quel est ton meilleur atout dans tes relations ?',
        inputPlaceholder: 'Selectionne ton point fort social.',
        options: [
          {
            id: 'workshop',
            label: "L'empathie : je sais vraiment écouter",
            helper: 'Bienveillance',
          },
          {
            id: 'one-to-one',
            label: 'Le conseil : on me demande souvent mon avis',
            helper: 'Sagesse',
          },
          {
            id: 'hybrid',
            label: "L'enseignement : j'aime expliquer ce que je sais",
            helper: 'Pédagogie',
          },
          {
            id: 'platform',
            label: "Le leadership : j'arrive à motiver les troupes",
            helper: 'Inspiration',
          },
        ],
      },
      {
        id: 'mentor-tooling',
        prompt: 'Quelle serait ta mission de cœur absolue ?',
        inputPlaceholder: 'Choisis ta mission.',
        options: [
          {
            id: 'chatbot',
            label: 'Soigner et sauver des vies',
            helper: 'Médical',
          },
          {
            id: 'reco',
            label: 'Rendre la société plus juste et équitable',
            helper: 'Social/Militant',
          },
          {
            id: 'analytics',
            label: 'Aider chacun à atteindre son meilleur niveau',
            helper: 'Accompagnement',
          },
          {
            id: 'content',
            label: 'Faciliter le quotidien des gens (services, commerces)',
            helper: 'Utilité',
          },
        ],
      },
      {
        id: 'mentor-partners',
        prompt: 'Dans un groupe, quel rôle prends-tu le plus souvent ?',
        inputPlaceholder: 'Sélectionne ton rôle naturel.',
        options: [
          {
            id: 'schools',
            label: 'Le confident, celui à qui on se livre',
            helper: 'Écoute',
          },
          {
            id: 'companies',
            label: 'Le médiateur, celui qui apaise les conflits',
            helper: 'Paix',
          },
          {
            id: 'associations',
            label: "L'animateur, celui qui met l'ambiance",
            helper: 'Énergie',
          },
          {
            id: 'institutions',
            label: "L'organisateur, celui qui répartit les tâches",
            helper: 'Logistique humaine',
          },
        ],
      },
      {
        id: 'mentor-metric',
        prompt: "Qu'est-ce qui te rendrait le plus heureux dans ton métier ?",
        inputPlaceholder: 'Choisis la réussite.',
        options: [
          {
            id: 'orientation',
            label: "Le sourire ou les remerciements d'une personne aidée",
            helper: 'Gratitude',
          },
          {
            id: 'insertion',
            label: "Avoir un impact positif sur l'environnement ou la société",
            helper: 'Large échelle',
          },
          {
            id: 'wellbeing',
            label: 'Réussir en équipe un défi difficile',
            helper: "Esprit d'équipe",
          },
          {
            id: 'community',
            label: 'Me sentir utile là où peu de gens veulent aller',
            helper: 'Dévouement',
          },
        ],
      },
    ],
  },
};

const PROFILE_WEIGHTS: Record<
  string,
  Record<string, Partial<Record<OrientationProfileId, number>>>
> = {
  'motivation-core': {
    build: { builder: 3 },
    analyze: { strategist: 3 },
    create: { creative: 3 },
    support: { mentor: 3 },
  },
  'favorite-mission': {
    'mission-product': { builder: 2 },
    'mission-analytics': { strategist: 2 },
    'mission-creative': { creative: 2 },
    'mission-support': { mentor: 2 },
  },
  'team-role': {
    'role-lead': { builder: 2 },
    'role-analyst': { strategist: 2 },
    'role-designer': { creative: 2 },
    'role-mentor': { mentor: 2 },
  },
  'problem-approach': {
    'approach-prototype': { builder: 2 },
    'approach-data': { strategist: 2 },
    'approach-creative': { creative: 2 },
    'approach-dialog': { mentor: 2 },
  },
  'creativity-role': {
    'creativity-concept': { builder: 1 },
    'creativity-structure': { strategist: 1 },
    'creativity-story': { creative: 1 },
    'creativity-guidance': { mentor: 1 },
  },
  'tech-confidence': {
    'tech-builder': { builder: 1 },
    'tech-analyst': { strategist: 1 },
    'tech-no-code': { creative: 1 },
    'tech-human': { mentor: 1 },
  },
  'decision-driver': {
    'decision-kpi': { builder: 1 },
    'decision-evidence': { strategist: 1 },
    'decision-experience': { creative: 1 },
    'decision-care': { mentor: 1 },
  },
};

export function inferOrientationProfile(
  answers: OrientationQuizAnswer[],
): OrientationProfile {
  const scores: Record<OrientationProfileId, number> = {
    builder: 0,
    strategist: 0,
    creative: 0,
    mentor: 0,
  };

  for (const answer of answers) {
    const optionId = answer.selectedOptionId;
    if (!optionId) {
      continue;
    }
    const questionWeights = PROFILE_WEIGHTS[answer.questionId];
    const optionWeights = questionWeights?.[optionId];
    if (!optionWeights) {
      continue;
    }
    for (const [profile, value] of Object.entries(optionWeights)) {
      scores[profile as OrientationProfileId] += value ?? 0;
    }
  }

  let bestProfile: OrientationProfileId = PROFILE_ORDER[0];
  let bestScore = -Infinity;
  for (const profileId of PROFILE_ORDER) {
    const profileScore = scores[profileId];
    if (profileScore > bestScore) {
      bestScore = profileScore;
      bestProfile = profileId;
    }
  }

  return PROFILE_DEFINITIONS[bestProfile];
}

export function getProfileDefinition(
  profileId: OrientationProfileId,
): OrientationProfile {
  return PROFILE_DEFINITIONS[profileId];
}

export function getFallbackFollowUpQuestions(
  profileId: OrientationProfileId,
): OrientationQuizQuestion[] {
  return PROFILE_DEFINITIONS[profileId].fallbackQuestions;
}
