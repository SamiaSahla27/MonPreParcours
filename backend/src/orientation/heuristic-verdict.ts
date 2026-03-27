import {
  AdvisorVerdict,
  OrientationGroqPayload,
  OrientationQuizAnswer,
  SchoolRecommendation,
  TimelineStep,
} from './orientation.types';

type TrackId = 'product' | 'data' | 'people' | 'creative';

const TRACK_BY_MOTIVATION: Record<string, TrackId> = {
  'build-products': 'product',
  build: 'product',
  'motivation-build': 'product',
  'analyze-data': 'data',
  analyze: 'data',
  'help-people': 'people',
  support: 'people',
  'create-content': 'creative',
  create: 'creative',
};

const EDUCATION_LABELS: Record<string, string> = {
  college: 'au college / debut de lycee, avec envie dexploration large',
  lycee: 'au lycee et en phase de choix de specialites',
  terminal: 'en Terminale, pret a formaliser ton projet Parcoursup',
  bac_plus_2: 'avec un niveau Bac+1/Bac+2, donc deja engage dans le superieur',
  reconversion:
    'en reconversion, avec une experience professionnelle a valoriser',
};

const LEARNING_STYLE_TEXT: Record<string, string> = {
  accelerated:
    'Tu recherches un rythme intensif type bootcamp afin dobtenir rapidement des preuves tangibles.',
  progressive:
    'Tu preferes consolider les bases progressivement sur 2 a 3 ans.',
  hybrid: 'Tu vises un mix theorie/projets pour garder de la flexibilite.',
  'self-paced':
    'Tu privilegies une approche autonome avec des projets personnels.',
};

const CONSTRAINT_TEXT: Record<string, string> = {
  budget:
    'Tu as un objectif budgetaire clair: priorite aux cursus publics, alternance ou dispositifs financement.',
  city: 'La mobilite est limitee: il faut privilegier les solutions pres de chez toi ou a distance.',
  international:
    'Tu veux conserver une ouverture internationale (semestres, campus partners).',
  'fast-track':
    'Tu cherches a accelerer linsertion pro: les parcours courts / alternance seront prioritaires.',
};

interface TrackDefinition {
  title: string;
  summaryLead: string;
  recommendedPath: string;
  confidence: number;
  keySkills: string[];
  timeline: TimelineStep[];
  schools: Omit<SchoolRecommendation, 'id'>[];
}

const TRACK_LIBRARY: Record<TrackId, TrackDefinition> = {
  product: {
    title: 'Verdict Orientation IA - Trajectoire Product Builder',
    summaryLead:
      'Tu montres un reel appetit pour imaginer, prototyper et piloter des experiences numeriques utiles.',
    recommendedPath:
      'Product Manager / Product Builder oriente IA appliquee et discovery terrain.',
    confidence: 84,
    keySkills: [
      'Discovery utilisateur avancee',
      'Priorisation roadmap',
      'Storytelling produit',
      'Pilotage KPI',
      'IA appliquee a la valeur utilisateur',
    ],
    timeline: [
      {
        id: 'prod-y1',
        yearLabel: 'Phase 1',
        title: 'Immersion Produit & UX',
        focus:
          'Comprendre les besoins utilisateurs et structurer un backlog priorise.',
        milestones: [
          '3 etudes utilisateurs completes',
          'Prototype haute fidelite sur un cas reel',
          'Pitch produit avec KPI cibles',
        ],
      },
      {
        id: 'prod-y2',
        yearLabel: 'Phase 2',
        title: 'Data x Produit',
        focus:
          'Mettre en place des boucles de mesure et experimenter via des features IA.',
        milestones: [
          'Mise en place dune instrumentation analytique',
          'Feature IA no/low code livree',
          'Itineraires utilisateurs testes A/B',
        ],
      },
      {
        id: 'prod-y3',
        yearLabel: 'Phase 3',
        title: 'Leadership Produit',
        focus: 'Piloter une squad en alternance avec un backlog trimestriel.',
        milestones: [
          'Roadmap trimestrielle et OKR presents',
          'Synchronisation tech/marketing animee',
          'Retro clients et mentor collectes',
        ],
      },
      {
        id: 'prod-y4',
        yearLabel: 'Phase 4',
        title: 'Insertion / Premiers roles',
        focus:
          'Capitaliser sur les cas pratiques pour viser PM junior ou specialist IA.',
        milestones: [
          'Portfolio produit publie',
          '2 entretiens reseau/mois',
          'Plan 90 jours en entreprise redige',
        ],
      },
    ],
    schools: [
      {
        name: 'HETIC',
        city: 'Montreuil',
        status: 'Prive',
        program: 'Grande Ecole Product & Tech',
        duration: '5 ans',
        annualCost: 'Env. 8 500 EUR/an',
        whyItFits: 'Culture produit forte + projets IA et data en mode sprint.',
      },
      {
        name: 'IIM Digital School',
        city: 'Paris La Defense',
        status: 'Prive',
        program: 'Bachelor Chef de Projet Digital puis Mastere Product',
        duration: '3 + 2 ans',
        annualCost: '8 000 a 9 000 EUR/an',
        whyItFits: 'Approche projets reels et alternance sur la phase mastere.',
      },
      {
        name: 'Universite Paris Dauphine - PSL',
        city: 'Paris',
        status: 'Public',
        program: 'Licence MIASHS puis Master SIO / 214',
        duration: '3 + 2 ans',
        annualCost: 'Frais universitaires',
        whyItFits: 'Solide base data/business pour du Product Analytics.',
      },
      {
        name: 'Le Wagon x Startup Campus',
        city: 'Remote / Paris',
        status: 'Prive',
        program: 'Bootcamp Product & Data for AI',
        duration: '3 mois',
        annualCost: 'Env. 7 500 EUR',
        whyItFits: 'Option acceleration pour valider des preuves rapides.',
      },
    ],
  },
  data: {
    title: 'Verdict Orientation IA - Trajectoire Data Strategist',
    summaryLead:
      'Tu aimes analyser, structurer des jeux de donnees et influencer les decisions par la preuve.',
    recommendedPath:
      'Data Analyst / Analytics Engineer avec coloration IA generative.',
    confidence: 82,
    keySkills: [
      'Modelisation statistiques',
      'Data storytelling',
      'Automatisation Python/SQL',
      'Ethique & governance data',
      'Prompt engineering oriente analytics',
    ],
    timeline: [
      {
        id: 'data-y1',
        yearLabel: 'Phase 1',
        title: 'Socle mathematiques & outils',
        focus:
          'Renforcer stats, Python et SQL sur des cas edtech / orientation.',
        milestones: [
          '4 notebooks analyses publishes',
          'Certification SQL/PowerBI',
          'Veille IA appliquee education',
        ],
      },
      {
        id: 'data-y2',
        yearLabel: 'Phase 2',
        title: 'Analytics embarquee',
        focus:
          'Construire des pipelines et dashboards pour une equipe produit.',
        milestones: [
          'Data pipeline automatises',
          'Dashboard decisionnel pour un sponsor',
          'Process data quality formalise',
        ],
      },
      {
        id: 'data-y3',
        yearLabel: 'Phase 3',
        title: 'IA et experimentation',
        focus:
          'Tester des modeles prescriptifs / generatifs sur des cas concrets.',
        milestones: [
          'Prototype IA generative reliant dataset maison',
          'Framework experimentation A/B',
          'Talk ou article sur insights data',
        ],
      },
      {
        id: 'data-y4',
        yearLabel: 'Phase 4',
        title: 'Insertion analyst / engineer',
        focus:
          'Stage/alternance en cellule data produit, puis position junior.',
        milestones: [
          'Mission alternance 12 mois',
          'Contribution open data / civic tech',
          'Plan evolution vers analytics engineer',
        ],
      },
    ],
    schools: [
      {
        name: 'ENSAI',
        city: 'Rennes',
        status: 'Public',
        program: 'Ingenieur Statisticien',
        duration: '3 ans',
        annualCost: 'Frais publics',
        whyItFits: 'Reconnue pour le couple stats/data science.',
      },
      {
        name: 'INSA Lyon',
        city: 'Lyon',
        status: 'Public',
        program: 'Departement Telecom / Data & IA',
        duration: '5 ans',
        annualCost: 'Frais publics',
        whyItFits: 'Double competence ingenierie + IA terrain.',
      },
      {
        name: 'Université Lyon 1 - IUT',
        city: 'Lyon',
        status: 'Public',
        program: 'BUT STID puis Licence Pro Data',
        duration: '3 + 1 ans',
        annualCost: 'Frais universitaires',
        whyItFits: 'Parcours progressif accessible apres Bac.',
      },
      {
        name: 'DataScientest',
        city: 'Paris / Remote',
        status: 'Prive',
        program: 'Bootcamp Data Analyst certifiant',
        duration: '6 mois',
        annualCost: 'Env. 7 000 EUR (CPF possible)',
        whyItFits: 'Ideal pour reconversion rapide orientee emploi.',
      },
    ],
  },
  people: {
    title: 'Verdict Orientation IA - Trajectoire Conseil & Accompagnement',
    summaryLead:
      'Tu recherches un impact humain direct: coacher, accompagner des publics et structurer des dispositifs.',
    recommendedPath:
      'Conseiller orientation / Chef de projet inclusion numerique avec IA copilote.',
    confidence: 79,
    keySkills: [
      'Pedagogie active',
      'Animation ateliers',
      'Design de services publics',
      'Gestion partenariats',
      'Ethique IA & inclusion',
    ],
    timeline: [
      {
        id: 'people-y1',
        yearLabel: 'Phase 1',
        title: 'Bases psycho / socio & numerique',
        focus:
          'Comprendre les parcours utilisateurs et les determinants socio-pro pour mieux conseiller.',
        milestones: [
          'Stage terrain en CIO / mission locale',
          'Certification soft skills coaching',
          'Initiation outils IA conversationnels',
        ],
      },
      {
        id: 'people-y2',
        yearLabel: 'Phase 2',
        title: 'Engineering parcours & dispositifs',
        focus: 'Concevoir des ateliers hybrides humains + IA.',
        milestones: [
          'Programme dateliers teste avec 30 jeunes',
          'Jeu de donnees anonymise pour IA conseil',
          'Partenariat etablissement signe',
        ],
      },
      {
        id: 'people-y3',
        yearLabel: 'Phase 3',
        title: 'Pilotage projets inclusion',
        focus:
          'Coordonner un projet dorientation territoriale (collectivite, EdTech, assos).',
        milestones: [
          'Budget ou subvention obtenue',
          'Equipe de mentors animee',
          'Impact mesure (insertion, poursuite detudes)',
        ],
      },
      {
        id: 'people-y4',
        yearLabel: 'Phase 4',
        title: 'Expertise & transmission',
        focus:
          'Capitaliser sur les apprentissages pour devenir referent ou consultant.',
        milestones: [
          'Publication dun guide ou MOOC',
          'Accompagnement de 50+ apprenants',
          'Construction dune offre conseil IA responsible',
        ],
      },
    ],
    schools: [
      {
        name: 'Université de Bordeaux',
        city: 'Bordeaux',
        status: 'Public',
        program: 'Licence Psychologie / Sciences de leducation',
        duration: '3 ans',
        annualCost: 'Frais universitaires',
        whyItFits: 'Socle psycho pour comprendre les parcours jeunes.',
      },
      {
        name: 'INSPE / ISFEC',
        city: 'Multiples',
        status: 'Public',
        program: 'Master MEEF Parcours Conseil',
        duration: '2 ans',
        annualCost: 'Frais universitaires',
        whyItFits: 'Dimension pedagogie et systeme educatif.',
      },
      {
        name: 'ICD Business School',
        city: 'Paris / Toulouse',
        status: 'Prive',
        program: 'Bachelor Developpement Commercial & projets',
        duration: '3 ans',
        annualCost: 'Env. 7 500 EUR/an',
        whyItFits:
          'Gestion de projets partenaires utile pour lanimation reseau.',
      },
      {
        name: 'Simplon.co',
        city: 'France / Remote',
        status: 'Prive',
        program: 'Parcours Chef de projet Inclusion Numerique',
        duration: '6 a 9 mois',
        annualCost: 'Pris en charge',
        whyItFits: 'Approche tres terrain + IA responsable.',
      },
    ],
  },
  creative: {
    title: 'Verdict Orientation IA - Trajectoire Experience & Contenus',
    summaryLead:
      'Tu veux imaginer des univers visuels / narratifs et explorer les capacites creatrices de lIA.',
    recommendedPath: 'Creative Technologist / UX Writer / Designer narratif.',
    confidence: 80,
    keySkills: [
      'Direction artistique numerique',
      'Figma / motion design',
      'No-code & prototypage',
      'Storytelling multi-supports',
      'IA generative pour contenus',
    ],
    timeline: [
      {
        id: 'crea-y1',
        yearLabel: 'Phase 1',
        title: 'Fondamentaux design & narration',
        focus: 'Explorer typographie, couleur, narration interactive.',
        milestones: [
          '3 projets portfolio (UI, video, microcopy)',
          'Veille creative hebdo partagee',
          'Initiation IA generative image/texte',
        ],
      },
      {
        id: 'crea-y2',
        yearLabel: 'Phase 2',
        title: 'Experiences immersives',
        focus:
          'Mixer design system, motion et IA pour prototyper des experiences.',
        milestones: [
          'Prototype interactif anime',
          'Collaboration avec dev/product',
          'Participation a un creative sprint',
        ],
      },
      {
        id: 'crea-y3',
        yearLabel: 'Phase 3',
        title: 'Signature creative',
        focus:
          'Construire une patte differenciante et maitriser les outils IA.',
        milestones: [
          'Direction artistique dun projet client',
          'Publication dune bibliotheque design/IA',
          'Talk ou workshop sur creative AI',
        ],
      },
      {
        id: 'crea-y4',
        yearLabel: 'Phase 4',
        title: 'Professionnalisation',
        focus:
          'Alterner studio / freelance / alternance pour entrer sur des roles Creative Tech.',
        milestones: [
          'Stage ou alternance en studio design',
          'Portfolio motion/video publie',
          'Pipeline creation+IA industrialise',
        ],
      },
    ],
    schools: [
      {
        name: 'Ecole de design Nantes Atlantique',
        city: 'Nantes',
        status: 'Prive',
        program: 'Cycle Master Experience design & UX',
        duration: '5 ans',
        annualCost: 'Env. 8 000 EUR/an',
        whyItFits: 'Approche UX et narration + projets internationaux.',
      },
      {
        name: 'Gobelins',
        city: 'Paris',
        status: 'Prive',
        program: 'Bachelor Designer Graphique Motion',
        duration: '3 ans',
        annualCost: 'Env. 9 000 EUR/an',
        whyItFits: 'Reference pour animation & motion.',
      },
      {
        name: 'e-artsup',
        city: 'France',
        status: 'Prive',
        program: 'Bachelor Direction Artistique Digitale',
        duration: '3 ans',
        annualCost: 'Env. 8 500 EUR/an',
        whyItFits: 'Beaucoup de projets hybrides IA/creation.',
      },
      {
        name: 'Hetic / Gobelins Hybrid',
        city: 'Paris',
        status: 'Prive',
        program: 'Programme creative technologist',
        duration: '1 an',
        annualCost: 'Env. 6 000 EUR',
        whyItFits: 'Permet de melanger design, no-code et IA generative.',
      },
    ],
  },
};

export function buildHeuristicVerdict(
  payload: OrientationGroqPayload,
): AdvisorVerdict {
  const answers = [...payload.phase1Answers, ...payload.phase2Answers];
  const motivationAnswer =
    findAnswer(answers, 'motivation-core') ?? findAnswer(answers, 'motivation');
  const trackId = motivationAnswer?.selectedOptionId
    ? (TRACK_BY_MOTIVATION[motivationAnswer.selectedOptionId] ?? 'product')
    : 'product';
  const track = TRACK_LIBRARY[trackId];

  const educationText =
    EDUCATION_LABELS[payload.educationLevel] ?? 'dans une phase de transition';
  const learningText = getLearningStyleText(
    findAnswer(answers, 'learning-pace'),
  );
  const constraintText = getConstraintText(findAnswer(answers, 'constraints'));

  const summaryParts = [
    `Tu evolues actuellement ${educationText}.`,
    track.summaryLead,
  ];
  if (learningText) {
    summaryParts.push(learningText);
  }
  if (constraintText) {
    summaryParts.push(constraintText);
  }
  const summary = summaryParts.join(' ');

  const timeline = track.timeline.map((step) => ({ ...step }));
  const schools = track.schools.map((school, index) => ({
    ...school,
    id: `${trackId}-school-${index + 1}`,
  }));

  return {
    title: track.title,
    summary,
    recommendedPath: track.recommendedPath,
    confidenceLabel: `Confiance ${track.confidence}%`,
    keySkills: [...track.keySkills],
    timeline,
    schools,
  };
}

function findAnswer(
  answers: OrientationQuizAnswer[],
  questionId: string,
): OrientationQuizAnswer | undefined {
  return answers.find((answer) => answer.questionId === questionId);
}

function getLearningStyleText(
  answer?: OrientationQuizAnswer,
): string | undefined {
  if (!answer) {
    return undefined;
  }
  if (answer.selectedOptionId && LEARNING_STYLE_TEXT[answer.selectedOptionId]) {
    return LEARNING_STYLE_TEXT[answer.selectedOptionId];
  }
  if (answer.selectedOptionLabel) {
    return `Tu privilegies un rythme ${answer.selectedOptionLabel.toLowerCase()}.`;
  }
  if (answer.freeText) {
    return answer.freeText;
  }
  return undefined;
}

function getConstraintText(answer?: OrientationQuizAnswer): string | undefined {
  if (!answer) {
    return undefined;
  }
  if (answer.selectedOptionId && CONSTRAINT_TEXT[answer.selectedOptionId]) {
    return CONSTRAINT_TEXT[answer.selectedOptionId];
  }
  if (answer.selectedOptionLabel) {
    return `Contrainte affichee: ${answer.selectedOptionLabel}.`;
  }
  if (answer.freeText) {
    return `Contrainte personnelle indiquee: ${answer.freeText}.`;
  }
  return undefined;
}
