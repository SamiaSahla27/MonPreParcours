export type SeedEngagementTheme =
  | 'inclusion'
  | 'equity'
  | 'accessibility'
  | 'social-impact';

export type SeedEngagementTone =
  | 'rose'
  | 'violet'
  | 'emerald'
  | 'sky'
  | 'amber';

export interface SeedEngagementLabel {
  text: string;
  tone: SeedEngagementTone;
}

export interface SeedEngagementInitiative {
  title: string;
  theme: SeedEngagementTheme;
  description: string;
  impact: string;
}

export interface SeedEngagementEvidence {
  title: string;
  source: string;
  note: string;
}

export interface SeedEngagedCompany {
  slug: string;
  name: string;
  sector: string;
  location: string;
  size: string;
  workModel: string;
  summary: string;
  pitch: string;
  overallScore: number;
  inclusionScore: number;
  equalityScore: number;
  accessibilityScore: number;
  socialImpactScore: number;
  reviewedAt: string;
  labels: SeedEngagementLabel[];
  themes: SeedEngagementTheme[];
  hiringSignals: string[];
  initiatives: SeedEngagementInitiative[];
  questionsToAsk: string[];
  evidence: SeedEngagementEvidence[];
}

export const ENGAGED_COMPANIES_SEED_DATA: SeedEngagedCompany[] = [
  {
    slug: 'asteria-care',
    name: 'Asteria Care',
    sector: 'Santé numérique',
    location: 'Lyon',
    size: '420 collaborateurs',
    workModel: 'Hybride',
    summary:
      "Scale-up santé qui documente clairement ses pratiques de recrutement, ses indicateurs d'équité et les adaptations proposées dès l'onboarding.",
    pitch:
      "Une entreprise utile, structurée et lisible pour une personne qui veut mesurer l'inclusion au-delà du discours.",
    overallScore: 92,
    inclusionScore: 91,
    equalityScore: 94,
    accessibilityScore: 86,
    socialImpactScore: 88,
    reviewedAt: '2026-04-15',
    labels: [
      { text: 'Index égalité 94/100', tone: 'emerald' },
      { text: 'Parentalité active', tone: 'rose' },
      { text: "Parcours d'onboarding adapté", tone: 'violet' },
    ],
    themes: ['inclusion', 'equity', 'accessibility'],
    hiringSignals: [
      "Déroulé d'entretien envoyé à l'avance",
      'Grille salariale par bandes de niveau',
      'Budget matériel adapté débloqué dès la première semaine',
    ],
    initiatives: [
      {
        title: 'Entretiens accessibles',
        theme: 'accessibility',
        description:
          'Alternative au live-coding, documents préparatoires en amont et temps additionnel possible sur demande.',
        impact: '76% des candidats utilisent au moins un support adapté.',
      },
      {
        title: 'Budget parentalité',
        theme: 'equity',
        description:
          'Soutien dédié au retour de congé parental avec reprise progressive et enveloppe garde ponctuelle.',
        impact: "92% des retours de congé sont suivis d'un maintien de poste à 12 mois.",
      },
      {
        title: 'Baromètre inclusion trimestriel',
        theme: 'inclusion',
        description:
          "Mesure interne courte, partagée à l'échelle équipe et suivie dans les plans managers.",
        impact: "4,4/5 sur le sentiment d'écoute des équipes produit.",
      },
    ],
    questionsToAsk: [
      "Comment les adaptations de poste sont-elles activées en pratique, et sous quel délai ?",
      "Qui suit l'évolution de l'index d'équité au niveau des équipes ?",
      'Les managers sont-ils formés à la reprise après congé long ?',
    ],
    evidence: [
      {
        title: 'Baromètre inclusion T1 2026',
        source: 'Équipe People & Culture',
        note: "Indicateurs d'écoute, sécurité psychologique et perception de l'équité.",
      },
      {
        title: 'Guide candidat accessible',
        source: 'Talent Acquisition',
        note: "Déroulé d'entretien, formats alternatifs et personnes de contact.",
      },
      {
        title: "Note d'engagement parentalité",
        source: 'Direction RH',
        note: 'Règles de reprise progressive et soutien logistique.',
      },
    ],
  },
  {
    slug: 'nexa-cloud',
    name: 'Nexa Cloud',
    sector: 'Cloud & SaaS',
    location: 'Nantes',
    size: '290 collaborateurs',
    workModel: 'Remote-friendly',
    summary:
      "Organisation SaaS B2B qui rend visibles ses salaires, ses critères de promotion et le niveau de formation managériale attendu.",
    pitch:
      "Très solide sur la transparence et l'équité de progression, avec une documentation particulièrement lisible.",
    overallScore: 89,
    inclusionScore: 84,
    equalityScore: 93,
    accessibilityScore: 82,
    socialImpactScore: 79,
    reviewedAt: '2026-05-02',
    labels: [
      { text: 'Transparence salariale', tone: 'sky' },
      { text: 'Promotion cadrée', tone: 'violet' },
      { text: 'Manager training', tone: 'amber' },
    ],
    themes: ['equity', 'accessibility', 'inclusion'],
    hiringSignals: [
      'Compétences évaluées sur grille partagée',
      'Promotion revue deux fois par an avec critères publics',
      "Primes et rémunérations annexes expliquées dès l'offre",
    ],
    initiatives: [
      {
        title: 'Bandes salariales ouvertes',
        theme: 'equity',
        description:
          'Chaque rôle possède une bande publique avec explication des critères de placement et de progression.',
        impact: "Baisse du sentiment d'opacité salariale dans les équipes support.",
      },
      {
        title: 'Formation anti-biais manager',
        theme: 'inclusion',
        description:
          "Cycle court obligatoire avant toute participation à un panel de recrutement.",
        impact: '100% des managers recruteurs formés depuis 2025.',
      },
      {
        title: 'Kit de travail accessible',
        theme: 'accessibility',
        description:
          'Sous-titrage, transcription et alternatives de réunion mis à disposition sur tous les workflows internes.',
        impact: 'Réduction des demandes ad hoc grâce à des standards par défaut.',
      },
    ],
    questionsToAsk: [
      'À quelle fréquence les bandes salariales sont-elles révisées ?',
      'Comment sont arbitrées les promotions entre équipes produit, tech et support ?',
      "Quels standards d'accessibilité sont déjà par défaut dans les outils internes ?",
    ],
    evidence: [
      {
        title: 'Guide carrière 2026',
        source: 'Ops RH',
        note: 'Niveaux, promotions et règles de revue semestrielle.',
      },
      {
        title: 'Charte de recrutement structuré',
        source: 'Talent Team',
        note: "Grilles d'évaluation et règles de calibration.",
      },
      {
        title: 'Checklist réunion accessible',
        source: 'Enablement interne',
        note: 'Standards par défaut sur sous-titrage et diffusion des supports.',
      },
    ],
  },
  {
    slug: 'cobalt-mobility',
    name: 'Cobalt Mobility',
    sector: 'Mobilité',
    location: 'Lille',
    size: '1 100 collaborateurs',
    workModel: 'Présentiel + terrain',
    summary:
      "Entreprise industrielle en transformation, qui publie ses engagements terrain sur le handicap, la sécurité et l'accès aux évolutions de carrière.",
    pitch:
      "Moins lisse qu'une scale-up, mais intéressante si tu veux voir des actions concrètes sur des métiers opérationnels.",
    overallScore: 86,
    inclusionScore: 83,
    equalityScore: 81,
    accessibilityScore: 90,
    socialImpactScore: 88,
    reviewedAt: '2026-03-28',
    labels: [
      { text: 'Aménagement terrain', tone: 'emerald' },
      { text: 'Mobilité interne', tone: 'sky' },
      { text: 'Sécurité & inclusion', tone: 'amber' },
    ],
    themes: ['accessibility', 'social-impact', 'inclusion'],
    hiringSignals: [
      'Visite de site possible avant signature',
      'Parcours passerelle pour changer de métier en interne',
      'Référent accessibilité identifié sur chaque site principal',
    ],
    initiatives: [
      {
        title: 'Audit ergonomie terrain',
        theme: 'accessibility',
        description:
          "Révision poste par poste des contraintes physiques et des marges d'adaptation matérielle.",
        impact: "23 postes réaménagés sur l'année pilote.",
      },
      {
        title: 'Programme passerelles métiers',
        theme: 'social-impact',
        description:
          "Formation courte financée pour évoluer d'un poste d'exploitation vers des fonctions coordination.",
        impact: '41 mobilités internes réussies sur douze mois.',
      },
      {
        title: 'Débrief sécurité inclusif',
        theme: 'inclusion',
        description:
          "Retour d'expérience anonyme après incidents ou presque-accidents, intégré aux rituels d'équipe.",
        impact: 'Plus forte remontée des signaux faibles sur le terrain.',
      },
    ],
    questionsToAsk: [
      'Quelles adaptations sont réellement disponibles sur les postes terrain ?',
      "Combien de mobilités internes ont lieu dans l'équipe ciblée chaque année ?",
      "Qui porte les sujets inclusion sur les sites qui ne sont pas au siège ?",
    ],
    evidence: [
      {
        title: 'Rapport ergonomie 2025',
        source: 'Direction opérations',
        note: "Liste des postes audités et plan d'investissement associé.",
      },
      {
        title: 'Bilan passerelles métiers',
        source: 'Campus interne',
        note: "Taux d'achèvement et d'évolution post-formation.",
      },
      {
        title: 'Guide de remontée sécurité',
        source: 'Prévention & qualité',
        note: 'Modalités de déclaration et de suivi par site.',
      },
    ],
  },
  {
    slug: 'atelier-moka',
    name: 'Atelier Moka',
    sector: 'Design & création',
    location: 'Bordeaux',
    size: '85 collaborateurs',
    workModel: 'Hybride',
    summary:
      "Studio créatif qui structure progressivement ses pratiques de recrutement et de progression pour éviter que l'inclusion reste informelle.",
    pitch:
      "Intéressant si tu veux une culture créative avec des signaux déjà visibles, même si la maturité reste en construction.",
    overallScore: 82,
    inclusionScore: 86,
    equalityScore: 78,
    accessibilityScore: 80,
    socialImpactScore: 79,
    reviewedAt: '2026-05-10',
    labels: [
      { text: 'Créa inclusive', tone: 'rose' },
      { text: 'Portfolio alternatif', tone: 'violet' },
      { text: 'Transparence process', tone: 'sky' },
    ],
    themes: ['inclusion', 'accessibility'],
    hiringSignals: [
      'Candidature possible sans portfolio finalisé',
      "Brief d'entretien envoyé 48h avant",
      'Feedback candidat standardisé après le process',
    ],
    initiatives: [
      {
        title: 'Portfolio alternatif',
        theme: 'inclusion',
        description:
          "Possibilité de présenter un cas oral, un work-in-progress ou une sélection commentée plutôt qu'un portfolio parfait.",
        impact: 'Ouverture du funnel à des profils juniors et en reconversion.',
      },
      {
        title: "Rituels d'équipe sobres",
        theme: 'accessibility',
        description:
          'Réunions plus courtes, supports systématiques et plages de concentration protégées.',
        impact: 'Moins de fatigue cognitive déclarée sur les équipes créa.',
      },
      {
        title: 'Revue de progression semestrielle',
        theme: 'equity',
        description:
          'Processus récent pour rendre plus lisibles les attentes de progression et les retours manager.',
        impact: 'Premier cadrage structuré des promotions 2026.',
      },
    ],
    questionsToAsk: [
      'Comment le studio évite-t-il les attentes implicites sur les profils juniors ?',
      'La revue de progression est-elle déjà stabilisée ou encore expérimentale ?',
      'Quels formats de feedback sont donnés après entretien ?',
    ],
    evidence: [
      {
        title: 'Guide candidat créatif',
        source: 'Studio talent',
        note: 'Formats de portfolio acceptés et déroulé du process.',
      },
      {
        title: 'Cadre de progression 2026',
        source: 'Direction design',
        note: 'Attendus par niveau et règles de feedback.',
      },
      {
        title: "Charte des rituels d'équipe",
        source: 'Ops créa',
        note: 'Standards de réunion et temps de concentration.',
      },
    ],
  },
  {
    slug: 'novanest-habitat',
    name: 'NovaNest Habitat',
    sector: 'Habitat & services',
    location: 'Toulouse',
    size: '560 collaborateurs',
    workModel: 'Hybride',
    summary:
      "Entreprise de services qui combine politique de proximité, parcours de mobilité et initiatives d'impact social sur ses territoires.",
    pitch:
      "Une option intéressante si tu recherches une entreprise ancrée localement avec des engagements visibles en dehors du siège.",
    overallScore: 87,
    inclusionScore: 82,
    equalityScore: 85,
    accessibilityScore: 84,
    socialImpactScore: 93,
    reviewedAt: '2026-04-22',
    labels: [
      { text: 'Ancrage territorial', tone: 'emerald' },
      { text: 'Mobilité locale', tone: 'amber' },
      { text: 'Index égalité 88/100', tone: 'violet' },
    ],
    themes: ['social-impact', 'equity', 'inclusion'],
    hiringSignals: [
      'Parcours de montée en compétences pour profils non linéaires',
      'Temps salarié alloué à des projets de quartier',
      'Managers de proximité impliqués dans les suivis de carrière',
    ],
    initiatives: [
      {
        title: 'Quartiers partenaires',
        theme: 'social-impact',
        description:
          'Temps de contribution salarié fléché vers des associations de quartier et projets de médiation logement.',
        impact: "Plus de 1 200 heures de contribution sur l'année.",
      },
      {
        title: 'Recrutement seconde chance',
        theme: 'inclusion',
        description:
          "Voie d'entrée dédiée aux profils en reprise d'emploi ou en reconversion récente.",
        impact: '28 recrutements via ce canal sur les fonctions relation client.',
      },
      {
        title: 'Évolution superviseur terrain',
        theme: 'equity',
        description:
          "Parcours qualifiant pour faire évoluer des postes d'accueil vers des rôles de coordination d'agence.",
        impact: 'Taux de mobilité interne en hausse sur les agences pilotes.',
      },
    ],
    questionsToAsk: [
      "Quelle part des projets d'impact social est portée par les équipes opérationnelles ?",
      'Les parcours seconde chance mènent-ils aux mêmes progressions que les autres recrutements ?',
      'Comment la mobilité entre agences est-elle accompagnée ?',
    ],
    evidence: [
      {
        title: 'Bilan impact territorial',
        source: 'Direction engagement',
        note: 'Heures contributives et projets soutenus par ville.',
      },
      {
        title: 'Parcours seconde chance',
        source: 'Recrutement',
        note: "Principes d'accompagnement et suivi à six mois.",
      },
      {
        title: 'Référentiel évolution agence',
        source: 'Exploitation',
        note: 'Compétences attendues et parcours de montée en responsabilité.',
      },
    ],
  },
  {
    slug: 'coop-horizon',
    name: 'Coop Horizon',
    sector: 'Impact social',
    location: 'Marseille',
    size: '230 collaborateurs',
    workModel: 'Présentiel souple',
    summary:
      "Structure à mission qui rend publiques ses priorités d'inclusion, ses mécanismes de décision collective et ses apprentissages encore ouverts.",
    pitch:
      "Très inspirante sur l'impact social, avec une posture honnête sur ce qui reste à mieux structurer côté équité.",
    overallScore: 85,
    inclusionScore: 90,
    equalityScore: 77,
    accessibilityScore: 81,
    socialImpactScore: 96,
    reviewedAt: '2026-05-18',
    labels: [
      { text: 'Mission sociale forte', tone: 'emerald' },
      { text: 'Gouvernance partagée', tone: 'sky' },
      { text: 'Documentation ouverte', tone: 'amber' },
    ],
    themes: ['social-impact', 'inclusion'],
    hiringSignals: [
      'Retour systématique aux candidats',
      "Temps d'immersion payé avant décision finale",
      'Documents de gouvernance accessibles en amont',
    ],
    initiatives: [
      {
        title: 'Immersion rémunérée',
        theme: 'inclusion',
        description:
          "Demi-journée d'immersion payée pour réduire les angles morts du recrutement mutuel.",
        impact: 'Meilleure compréhension réciproque avant embauche.',
      },
      {
        title: 'Budget impact choisi par les équipes',
        theme: 'social-impact',
        description:
          'Une part du budget annuel est arbitrée par les équipes sur des projets locaux à soutenir.',
        impact: '7 projets de quartier financés en 2025.',
      },
      {
        title: 'Règles de décision expliquées',
        theme: 'social-impact',
        description:
          'Documentation simplifiée sur qui décide quoi, et comment contester une décision interne.',
        impact: "Moins d'opacité sur la gouvernance pour les nouveaux arrivants.",
      },
    ],
    questionsToAsk: [
      'Quels sujets restent encore peu cadrés malgré la gouvernance partagée ?',
      "Comment sont gérées les tensions entre impact social et charge opérationnelle ?",
      'Les grilles salariales sont-elles déjà stabilisées ou encore en chantier ?',
    ],
    evidence: [
      {
        title: 'Carnet de gouvernance',
        source: 'Comité de pilotage',
        note: 'Rôles, délégations et voies de recours internes.',
      },
      {
        title: 'Bilan immersion recrutement',
        source: 'Équipe talents',
        note: "Retours candidat et manager après la phase d'immersion.",
      },
      {
        title: 'Tableau projets soutenus',
        source: 'Cellule impact',
        note: "Sélection des projets financés et critères d'arbitrage.",
      },
    ],
  },
];
