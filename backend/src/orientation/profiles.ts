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
    label: 'Builder Produit',
    summary:
      'Tu aimes transformer des idees en produits concrets et mesurer limpact business.',
    fallbackQuestions: [
      {
        id: 'builder-context',
        prompt: 'Quel produit ou service voudrais-tu absolument lancer ?',
        inputPlaceholder: 'Decris le probleme que tu veux resoudre.',
        options: [
          { id: 'saas', label: 'SaaS / outil numerique', helper: 'Focus tech' },
          {
            id: 'app',
            label: 'App mobile grand public',
            helper: 'Experience client',
          },
          {
            id: 'hardware',
            label: 'Produit physique + IoT',
            helper: 'Tech & terrain',
          },
          {
            id: 'service',
            label: 'Service hybride humain / IA',
            helper: 'Accompagnement',
          },
        ],
      },
      {
        id: 'builder-metric',
        prompt: 'Quel indicateur de succes veux-tu optimiser ? ',
        inputPlaceholder: 'Choisis le KPI prioritaire.',
        options: [
          {
            id: 'adoption',
            label: 'Adoption / nombre dusagers',
            helper: 'Croissance',
          },
          {
            id: 'engagement',
            label: 'Engagement / temps utilise',
            helper: 'Experience',
          },
          { id: 'revenue', label: 'Revenus / business', helper: 'Model eco' },
          { id: 'impact', label: 'Impact social / climat', helper: 'Mission' },
        ],
      },
      {
        id: 'builder-stack',
        prompt: 'Quelles briques tech veux-tu maitriser ?',
        inputPlaceholder: 'Selectionne la prochaine competence.',
        options: [
          { id: 'ux', label: 'UX research avancee', helper: 'Discovery' },
          {
            id: 'data',
            label: 'Analytics / instrumentation',
            helper: 'Mesure',
          },
          {
            id: 'automation',
            label: 'Automatisation IA / no-code',
            helper: 'Efficacite',
          },
          { id: 'ops', label: 'Product ops / roadmap', helper: 'Execution' },
        ],
      },
      {
        id: 'builder-team',
        prompt: 'Quel type de squad preferes-tu rejoindre ?',
        inputPlaceholder: 'Choisis la configuration ideale.',
        options: [
          {
            id: 'startup',
            label: 'Startup early stage',
            helper: 'Polyvalence',
          },
          { id: 'scaleup', label: 'Scale-up produit', helper: 'Croissance' },
          { id: 'corporate', label: 'Grand groupe', helper: 'Impact large' },
          {
            id: 'public',
            label: 'Structure publique / associative',
            helper: 'Mission sociale',
          },
        ],
      },
      {
        id: 'builder-rhythm',
        prompt: 'Quel rythme prefere-tu pour apprendre ?',
        inputPlaceholder: 'Selectionne le format cle.',
        options: [
          {
            id: 'alternance',
            label: 'Alternance sur 12 mois',
            helper: 'Immersion',
          },
          { id: 'bootcamp', label: 'Bootcamp intense', helper: 'Accelaration' },
          {
            id: 'project',
            label: 'Projets freelances encadres',
            helper: 'Autonomie',
          },
          { id: 'mentor', label: 'Mentorat individuel', helper: 'Coaching' },
        ],
      },
    ],
  },
  strategist: {
    id: 'strategist',
    label: 'Strategist Data',
    summary:
      'Tu observes, mesures et tires des decisions a partir des donnees.',
    fallbackQuestions: [
      {
        id: 'strategist-domain',
        prompt: 'Quel secteur veux-tu analyser en priorite ?',
        inputPlaceholder: 'Choisis le domaine cible.',
        options: [
          {
            id: 'edtech',
            label: 'Education / orientation',
            helper: 'Impact jeunesse',
          },
          { id: 'health', label: 'Sante / recherche', helper: 'Data sensible' },
          { id: 'finance', label: 'Finance / fintech', helper: 'Modelisation' },
          {
            id: 'public',
            label: 'Secteur public / territoires',
            helper: 'Politiques publiques',
          },
        ],
      },
      {
        id: 'strategist-stack',
        prompt: 'Quel outil ou langage veux-tu renforcer ?',
        inputPlaceholder: 'Ex: Python, SQL, PowerBI...',
        options: [
          {
            id: 'python',
            label: 'Python / notebooks',
            helper: 'Automatisation',
          },
          { id: 'sql', label: 'SQL avance', helper: 'Data pipelines' },
          {
            id: 'viz',
            label: 'Data viz (PowerBI/Tableau)',
            helper: 'Storytelling',
          },
          { id: 'ml', label: 'IA generative / LLM ops', helper: 'Next-gen' },
        ],
      },
      {
        id: 'strategist-dataset',
        prompt: 'Quel type de dataset te motive ?',
        inputPlaceholder: 'Choisis la source principale.',
        options: [
          {
            id: 'usage',
            label: 'Comportements utilisateurs',
            helper: 'Produit',
          },
          { id: 'business', label: 'KPI business / ventes', helper: 'Revenue' },
          {
            id: 'public-data',
            label: 'Open data / socio demo',
            helper: 'Territoires',
          },
          {
            id: 'scientific',
            label: 'Data scientifiques',
            helper: 'Recherche',
          },
        ],
      },
      {
        id: 'strategist-collab',
        prompt: 'Avec qui veux-tu travailler au quotidien ?',
        inputPlaceholder: 'Selectionne ton binome ideal.',
        options: [
          { id: 'product', label: 'PM / equipes produit', helper: 'Roadmap' },
          {
            id: 'leadership',
            label: 'Direction / C-level',
            helper: 'Decisions',
          },
          { id: 'ops', label: 'Operations / terrain', helper: 'Process' },
          { id: 'research', label: 'Chercheurs / labs', helper: 'Exploration' },
        ],
      },
      {
        id: 'strategist-impact',
        prompt: 'Quel impact veux-tu prouver en priorite ?',
        inputPlaceholder: 'Choisis la valeur cible.',
        options: [
          {
            id: 'efficiency',
            label: 'Efficacite operationnelle',
            helper: 'Process',
          },
          {
            id: 'growth',
            label: 'Croissance / acquisition',
            helper: 'Business',
          },
          {
            id: 'experience',
            label: 'Experience utilisateur',
            helper: 'Satisfaction',
          },
          {
            id: 'societal',
            label: 'Impact social / inclusion',
            helper: 'Mission',
          },
        ],
      },
    ],
  },
  creative: {
    id: 'creative',
    label: 'Creative Technologist',
    summary:
      'Tu veux imaginer des experiences audacieuses, visuelles et narratives.',
    fallbackQuestions: [
      {
        id: 'creative-medium',
        prompt: 'Quel medium veux-tu explorer en priorite ?',
        inputPlaceholder: 'Choisis ton terrain de jeu.',
        options: [
          { id: 'ui', label: 'UI / Product design', helper: 'Interfaces' },
          {
            id: 'motion',
            label: 'Motion / video',
            helper: 'Narration visuelle',
          },
          { id: 'audio', label: 'Audio / podcast', helper: 'Storytelling' },
          {
            id: 'immersive',
            label: 'XR / experiences immersives',
            helper: 'Innovation',
          },
        ],
      },
      {
        id: 'creative-toolkit',
        prompt: 'Quel outil creatif veux-tu pousser ?',
        inputPlaceholder: 'Ex: Figma, Blender, TouchDesigner...',
        options: [
          { id: 'figma', label: 'Figma / FigJam', helper: 'Design system' },
          { id: 'blender', label: 'Blender / 3D', helper: 'Immersion' },
          {
            id: 'after-effects',
            label: 'After Effects / motion',
            helper: 'Video',
          },
          {
            id: 'gen-ai',
            label: 'IA generative (image/texte)',
            helper: 'Exploration',
          },
        ],
      },
      {
        id: 'creative-tone',
        prompt: 'Quel ton narratif te correspond ?',
        inputPlaceholder: 'Selectionne lambiance cle.',
        options: [
          {
            id: 'futuristic',
            label: 'Futuriste / speculative',
            helper: 'Vision IA',
          },
          { id: 'poetic', label: 'Poetique / sensible', helper: 'Emotion' },
          { id: 'bold', label: 'Bold / disruptif', helper: 'Impact visuel' },
          {
            id: 'human',
            label: 'Chaleureux / inclusif',
            helper: 'Accessibilite',
          },
        ],
      },
      {
        id: 'creative-collab',
        prompt: 'Avec qui veux-tu co-creer ?',
        inputPlaceholder: 'Choisis les partenaires cles.',
        options: [
          {
            id: 'engineers',
            label: 'Ingenieurs / devs',
            helper: 'Tech + design',
          },
          { id: 'marketers', label: 'Marketing / brand', helper: 'Campagnes' },
          { id: 'artists', label: 'Artistes / studios', helper: 'Exploration' },
          {
            id: 'educators',
            label: 'Pedagogues / formateurs',
            helper: 'Transmission',
          },
        ],
      },
      {
        id: 'creative-proof',
        prompt: 'Quel livrable veux-tu produire pour valider ton profil ?',
        inputPlaceholder: 'Choisis ton prochain milestone.',
        options: [
          {
            id: 'portfolio',
            label: 'Portfolio interactif',
            helper: 'Montrer ton style',
          },
          {
            id: 'prototype',
            label: 'Prototype fonctionnel',
            helper: 'Experience testable',
          },
          {
            id: 'exhibit',
            label: 'Expo / installation',
            helper: 'Immersion publique',
          },
          {
            id: 'playbook',
            label: 'Playbook / guide',
            helper: 'Partage de methode',
          },
        ],
      },
    ],
  },
  mentor: {
    id: 'mentor',
    label: 'Mentor & Facilitateur',
    summary:
      'Tu veux accompagner des publics et coordonner des parcours humains + IA.',
    fallbackQuestions: [
      {
        id: 'mentor-audience',
        prompt: 'Quel public veux-tu prioriser ?',
        inputPlaceholder: 'Choisis les personnes a accompagner.',
        options: [
          { id: 'youth', label: 'Jeunes 15-20 ans', helper: 'Orientation' },
          { id: 'students', label: 'Etudiants / Bac+2', helper: 'Insertion' },
          {
            id: 'adults',
            label: 'Adultes en reconversion',
            helper: 'Upskilling',
          },
          {
            id: 'teachers',
            label: 'Enseignants / coachs',
            helper: 'Transmission',
          },
        ],
      },
      {
        id: 'mentor-format',
        prompt: 'Quel format danimation preferes-tu ?',
        inputPlaceholder: 'Selectionne la modalite cle.',
        options: [
          {
            id: 'workshop',
            label: 'Ateliers collectifs',
            helper: 'Energie groupe',
          },
          {
            id: 'one-to-one',
            label: 'Coaching individuel',
            helper: 'Suivi precis',
          },
          {
            id: 'hybrid',
            label: 'Programmes hybrides',
            helper: 'Mix presentiel / distanciel',
          },
          {
            id: 'platform',
            label: 'Plateforme digitale',
            helper: 'Scalabilite',
          },
        ],
      },
      {
        id: 'mentor-tooling',
        prompt: 'Quel outil IA veux-tu dompter pour aider ton public ?',
        inputPlaceholder: 'Choisis ton copilote.',
        options: [
          {
            id: 'chatbot',
            label: 'Agent conversationnel',
            helper: 'Support 24/7',
          },
          {
            id: 'reco',
            label: 'Moteur de recommandations',
            helper: 'Matching parcours',
          },
          { id: 'analytics', label: 'Tableaux de suivi', helper: 'Pilotage' },
          {
            id: 'content',
            label: 'Generation de contenus',
            helper: 'Guides & fiches',
          },
        ],
      },
      {
        id: 'mentor-partners',
        prompt: 'Quels partenaires veux-tu activer ?',
        inputPlaceholder: 'Selectionne le reseau prioritaire.',
        options: [
          {
            id: 'schools',
            label: 'Etablissements scolaires',
            helper: 'Jeunes',
          },
          {
            id: 'companies',
            label: 'Entreprises / mentors',
            helper: 'Immersions',
          },
          {
            id: 'associations',
            label: 'Associations locales',
            helper: 'Impact terrain',
          },
          {
            id: 'institutions',
            label: 'Institutions publiques',
            helper: 'Financements',
          },
        ],
      },
      {
        id: 'mentor-metric',
        prompt: 'Quel resultat veux-tu suivre de pres ?',
        inputPlaceholder: 'Choisis le KPI humain.',
        options: [
          {
            id: 'orientation',
            label: 'Taux de poursuite detudes',
            helper: 'Objectif CIO',
          },
          {
            id: 'insertion',
            label: 'Insertion pro / stages',
            helper: 'Mission locale',
          },
          {
            id: 'wellbeing',
            label: 'Bien-etre et confiance',
            helper: 'Accompagnement',
          },
          {
            id: 'community',
            label: 'Engagement communautaire',
            helper: 'Reseau',
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
