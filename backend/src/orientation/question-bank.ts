import {
  EducationLevel,
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
];

type FollowUpBank = Record<EducationLevel, OrientationQuizQuestion[]>;

const FOLLOW_UP_BANK: FollowUpBank = {
  college: [
    {
      id: 'college-strength',
      prompt: 'Quelle matiere te semble la plus naturelle ?',
      inputPlaceholder: 'Ex: Maths, SVT, Technologie...',
      options: [
        { id: 'maths', label: 'Maths / logique', helper: 'Scientifique' },
        { id: 'literature', label: 'Francais / langues', helper: 'Editorial' },
        { id: 'tech', label: 'Technologie / numerique', helper: 'Maker' },
        { id: 'social', label: 'SVT / socio', helper: 'Humain' },
      ],
    },
    {
      id: 'college-accomp',
      prompt: 'Quel accompagnement attends-tu ?',
      inputPlaceholder: 'Ex: Coaching orientation, stage observe...',
      options: [
        {
          id: 'discover',
          label: 'Decouverte de metiers',
          helper: 'Immersions',
        },
        { id: 'project', label: 'Projets concrets', helper: 'Clubs / fablab' },
        { id: 'mentoring', label: 'Mentorat', helper: 'Suivi personnel' },
        { id: 'academic', label: 'Renforcement scolaire', helper: 'Tutorat' },
      ],
    },
  ],
  lycee: [
    {
      id: 'lycee-speciality',
      prompt: 'Quelles specialites / options envisages-tu ?',
      inputPlaceholder: 'Ex: NSI + Maths...',
      options: [
        {
          id: 'nsi-maths',
          label: 'NSI + Maths',
          helper: 'Numerique / product',
        },
        {
          id: 'ses-geopolitics',
          label: 'SES + HGGSP',
          helper: 'Societal / business',
        },
        {
          id: 'svt-phys',
          label: 'SVT + Physique',
          helper: 'Sante / ingenierie',
        },
        { id: 'lit-arts', label: 'LLCER + Arts', helper: 'Creation / media' },
      ],
    },
    {
      id: 'lycee-parcours',
      prompt: 'Souhaites-tu une experience avant le bac ?',
      inputPlaceholder: 'Ex: stage, projet associatif...',
      options: [
        {
          id: 'summer-school',
          label: 'Summer school / campus',
          helper: 'Universites',
        },
        {
          id: 'hackathon',
          label: 'Hackathons / concours',
          helper: 'Challenge',
        },
        {
          id: 'association',
          label: 'Engagement associatif',
          helper: 'Impact social',
        },
        {
          id: 'entreprise',
          label: 'Stages en entreprise',
          helper: 'Professionnalisation',
        },
      ],
    },
  ],
  terminal: [
    {
      id: 'terminal-priority',
      prompt: 'Quelle priorite Parcoursup veux-tu securiser ?',
      inputPlaceholder: 'Ex: BUT Info, Licence eco...',
      options: [
        { id: 'but', label: 'BUT / IUT', helper: 'Encadrement + pratique' },
        {
          id: 'licence',
          label: 'Licences universitaires',
          helper: 'Flexibilite',
        },
        { id: 'bts', label: 'BTS / CFA', helper: 'Alternance rapide' },
        { id: 'prep', label: 'Classe prepa', helper: 'Exigence forte' },
      ],
    },
    {
      id: 'terminal-alternance',
      prompt: 'as-tu une alternance ciblee ?',
      inputPlaceholder: 'Ex: structure, secteur, mission...',
      options: [
        {
          id: 'oui',
          label: 'Oui, deja identifiee',
          helper: 'Matching necessaire',
        },
        { id: 'partiel', label: 'Quelques pistes', helper: 'A preciser' },
        { id: 'non', label: 'Pas encore', helper: 'Exploration totale' },
        {
          id: 'gap',
          label: 'Je prefere une annee de transition',
          helper: 'Temps de projet',
        },
      ],
    },
  ],
  bac_plus_2: [
    {
      id: 'bac2-continuation',
      prompt: 'Quelle suite dapprentissage imagines-tu ?',
      inputPlaceholder: 'Ex: Licence pro, Ecole specialisee...',
      options: [
        {
          id: 'licence-pro',
          label: 'Licence pro / bachelor',
          helper: 'Insertion rapide',
        },
        {
          id: 'grande-ecole',
          label: 'Programme grande ecole',
          helper: 'Grade master',
        },
        {
          id: 'double-diplome',
          label: 'Double diplome',
          helper: 'Expertise croisee',
        },
        {
          id: 'international',
          label: 'Depart a letanger',
          helper: 'Semestres abroad',
        },
      ],
    },
    {
      id: 'bac2-exp',
      prompt: 'Quel projet phare veux-tu mettre en avant ?',
      inputPlaceholder: 'Ex: SaaS en stage, mission associative...',
      options: [
        {
          id: 'product',
          label: 'Projet produit numerique',
          helper: 'Produit / IA',
        },
        { id: 'data', label: 'Analyse / data', helper: 'Insights' },
        { id: 'design', label: 'Experience utilisateur', helper: 'UX' },
        { id: 'impact', label: 'Impact social / edtech', helper: 'Inclusion' },
      ],
    },
  ],
  reconversion: [
    {
      id: 'reco-background',
      prompt: 'D ou viens-tu professionnellement ?',
      inputPlaceholder: 'Ex: Commerce, logistique, enseignement...',
      options: [
        {
          id: 'commerce',
          label: 'Commerce / relation client',
          helper: 'Transfert soft skills',
        },
        { id: 'gestion', label: 'Gestion / finance', helper: 'Structuration' },
        {
          id: 'tech',
          label: 'Tech / support',
          helper: 'Montee en specialisation',
        },
        { id: 'autre', label: 'Autre parcours', helper: 'Profil hybride' },
      ],
    },
    {
      id: 'reco-rythme',
      prompt: 'Quelle logistique dois-je respecter ?',
      inputPlaceholder: 'Ex: temps partiel, teletravail...',
      options: [
        {
          id: 'evening',
          label: 'Soir / week-end',
          helper: 'Formation continue',
        },
        { id: 'remote', label: '100% a distance', helper: 'E-learning' },
        {
          id: 'intensive',
          label: 'Bootcamp intensif',
          helper: 'immersion totale',
        },
        {
          id: 'hybrid',
          label: 'Hybride avec entreprise',
          helper: 'Alternance adulte',
        },
      ],
    },
  ],
};

export function getIntroQuestions(): OrientationQuestionsResponse {
  return {
    stage: 'intro',
    questions: INTRO_QUESTIONS,
  };
}

export function getFollowUpQuestions(
  level: EducationLevel,
): OrientationQuestionsResponse {
  return {
    stage: 'follow-up',
    questions: FOLLOW_UP_BANK[level] ?? FOLLOW_UP_BANK.lycee,
  };
}
