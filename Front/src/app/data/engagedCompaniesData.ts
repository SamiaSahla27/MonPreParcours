// Extended company data model for the directory
export interface CompanyAction {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface CompanyLabel {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CompanyEvidence {
  id: string;
  type: string;
  title: string;
  publicUrl?: string;
}

export interface EngagedCompany {
  id: string;
  name: string;
  logoInitials: string;
  logoGradient: string;
  sector: string;
  size: string;
  country: string;
  city: string;
  description: string;
  website: string;
  careersUrl?: string;
  publicContactName?: string;
  publicContactRole?: string;
  publicContactEmail?: string;
  commitments: string[];
  actions: CompanyAction[];
  labels: CompanyLabel[];
  inclusionScore?: number;
  verificationStatus: "verified" | "documented" | "reviewed";
  evidences: CompanyEvidence[];
  lastReviewedAt: string;
  isVerified: boolean;
  isPublic: boolean;
}

// Mock data for engaged companies directory
export const ENGAGED_COMPANIES: EngagedCompany[] = [
  {
    id: "decathlon",
    name: "Decathlon",
    logoInitials: "DC",
    logoGradient: "linear-gradient(135deg, #1a1035 0%, #2D1B69 100%)",
    sector: "Retail & Sport",
    size: "1000+ employés",
    country: "France",
    city: "Lille",
    description: "Leader mondial du sport engagé dans une politique d'inclusion forte avec 53% de femmes cadres, recrutement inclusif et programme handicap.",
    website: "https://www.decathlon.fr",
    careersUrl: "https://www.decathlon.fr/landing/careers",
    publicContactRole: "Responsable Diversité & Inclusion",
    commitments: [
      "Politique anti-discrimination formalisée",
      "Recrutement inclusif",
      "Accessibilité handicap",
      "Égalité professionnelle",
    ],
    actions: [
      {
        id: "1",
        title: "Parité dans le management",
        description: "53% de femmes occupent des postes de cadres, avec un objectif de 55% d'ici 2025.",
        category: "Égalité professionnelle",
      },
      {
        id: "2",
        title: "Programme Handi-accueillant",
        description: "Aménagement de 100% des postes de vente pour accueillir des collaborateurs en situation de handicap.",
        category: "Accessibilité",
      },
      {
        id: "3",
        title: "Recrutement sans CV",
        description: "Test de recrutement basé sur les compétences et la motivation, sans regard sur le parcours académique.",
        category: "Recrutement inclusif",
      },
    ],
    labels: [
      { id: "1", name: "Label Diversité", issuer: "AFNOR", year: "2024" },
      { id: "2", name: "Index égalité 88/100", issuer: "Ministère du Travail", year: "2024" },
    ],
    inclusionScore: 88,
    verificationStatus: "verified",
    evidences: [
      {
        id: "1",
        type: "Rapport RSE",
        title: "Rapport Diversité & Inclusion 2024",
        publicUrl: "https://www.decathlon.fr/rse",
      },
    ],
    lastReviewedAt: "2024-03-15",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "ldlc",
    name: "LDLC Group",
    logoInitials: "LD",
    logoGradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    sector: "Tech & E-commerce",
    size: "251-1000 employés",
    country: "France",
    city: "Lyon",
    description: "Pionnier de la semaine de 4 jours, LDLC mise sur le bien-être et l'inclusion pour attirer et retenir les talents créatifs.",
    website: "https://www.ldlc.com",
    careersUrl: "https://www.ldlc-group.com/carrieres",
    commitments: [
      "Équilibre vie pro/perso",
      "Politique anti-discrimination",
      "Formation continue",
    ],
    actions: [
      {
        id: "1",
        title: "Semaine de 4 jours",
        description: "Mise en place de la semaine de 4 jours pour tous les salariés sans réduction de salaire.",
        category: "Bien-être",
      },
      {
        id: "2",
        title: "Formations diversité",
        description: "Formation obligatoire de 2 jours par an pour tous les managers sur les biais inconscients.",
        category: "Sensibilisation",
      },
    ],
    labels: [
      { id: "1", name: "Great Place to Work", issuer: "GPTW", year: "2024" },
      { id: "2", name: "Label RH Innovant", issuer: "FrenchTech", year: "2023" },
    ],
    verificationStatus: "documented",
    evidences: [],
    lastReviewedAt: "2024-03-10",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "lvmh",
    name: "LVMH",
    logoInitials: "LV",
    logoGradient: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
    sector: "Luxe & Mode",
    size: "1000+ employés",
    country: "France",
    city: "Paris",
    description: "Le groupe de luxe s'engage pour la parité avec 64% de femmes managers, des programmes de mentorat et des initiatives LGBTQ+.",
    website: "https://www.lvmh.fr",
    careersUrl: "https://www.lvmh.fr/carrieres",
    publicContactRole: "Directrice RSE et Diversité",
    commitments: [
      "Parité femmes-hommes",
      "Programmes de mentorat",
      "Inclusion LGBTQ+",
      "Diversité culturelle",
    ],
    actions: [
      {
        id: "1",
        title: "Programme ElleVMH",
        description: "Programme de mentorat dédié aux femmes avec 200 participantes par an.",
        category: "Mentorat",
      },
      {
        id: "2",
        title: "Charte LGBTQ+ friendly",
        description: "Signature de la charte L'Autre Cercle et création d'un réseau interne.",
        category: "Inclusion LGBTQ+",
      },
      {
        id: "3",
        title: "Parité au comité exécutif",
        description: "Objectif de 50% de femmes au comité exécutif atteint en 2023.",
        category: "Égalité professionnelle",
      },
    ],
    labels: [
      { id: "1", name: "Label Égalité Pro", issuer: "AFNOR", year: "2024" },
      { id: "2", name: "EllesFontLaCulture", issuer: "Ministère Culture", year: "2023" },
    ],
    inclusionScore: 82,
    verificationStatus: "verified",
    evidences: [
      {
        id: "1",
        type: "Page officielle",
        title: "Engagements Diversité LVMH",
        publicUrl: "https://www.lvmh.fr/engagements/diversite",
      },
    ],
    lastReviewedAt: "2024-03-20",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "ubisoft",
    name: "Ubisoft",
    logoInitials: "UB",
    logoGradient: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
    sector: "Jeux vidéo & Tech",
    size: "1000+ employés",
    country: "France",
    city: "Montreuil",
    description: "Studio français engagé : initiatives contre le harcèlement, programmes pour femmes développeuses et personnes neurodivergentes.",
    website: "https://www.ubisoft.com",
    careersUrl: "https://www.ubisoft.com/careers",
    commitments: [
      "Lutte contre le harcèlement",
      "Women in Gaming",
      "Neurodiversité",
      "Inclusion multiculturelle",
    ],
    actions: [
      {
        id: "1",
        title: "Programme Women in Games",
        description: "Formation et mentorat pour 50 femmes développeuses par an.",
        category: "Mentorat",
      },
      {
        id: "2",
        title: "Cellule anti-harcèlement",
        description: "Équipe dédiée disponible 24/7 avec process de signalement anonyme.",
        category: "Sécurité",
      },
      {
        id: "3",
        title: "Aménagements neurodivergence",
        description: "Espaces de travail adaptés et horaires flexibles pour personnes neuroatypiques.",
        category: "Accessibilité",
      },
    ],
    labels: [
      { id: "1", name: "Women in Games", issuer: "WIG", year: "2024" },
      { id: "2", name: "Top Employeur 2024", issuer: "Top Employers Institute", year: "2024" },
    ],
    inclusionScore: 76,
    verificationStatus: "documented",
    evidences: [
      {
        id: "1",
        type: "Charte",
        title: "Charte Diversité Ubisoft",
        publicUrl: "https://www.ubisoft.com/diversity",
      },
    ],
    lastReviewedAt: "2024-03-18",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "societe-generale",
    name: "Société Générale",
    logoInitials: "SG",
    logoGradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    sector: "Banque & Finance",
    size: "1000+ employés",
    country: "France",
    city: "Paris",
    description: "Acteur historique de l'inclusion bancaire avec politiques de recrutement sans discrimination, programmes handicap et mentorat intergénérationnel.",
    website: "https://www.societegenerale.com",
    careersUrl: "https://careers.societegenerale.com",
    commitments: [
      "Recrutement sans discrimination",
      "Mission handicap",
      "Mentorat intergénérationnel",
      "Équité salariale",
    ],
    actions: [
      {
        id: "1",
        title: "Mission Handicap SG",
        description: "8% de collaborateurs en situation de handicap, au-dessus de l'obligation légale.",
        category: "Accessibilité",
      },
      {
        id: "2",
        title: "Mentorat inversé",
        description: "Programme où les juniors mentorent les seniors sur les nouvelles technologies.",
        category: "Mentorat",
      },
    ],
    labels: [
      { id: "1", name: "Index égalité 92/100", issuer: "Ministère du Travail", year: "2024" },
      { id: "2", name: "Charte Diversité", issuer: "Charte Diversité", year: "2023" },
    ],
    inclusionScore: 85,
    verificationStatus: "verified",
    evidences: [],
    lastReviewedAt: "2024-03-12",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "airbus",
    name: "Airbus",
    logoInitials: "AB",
    logoGradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    sector: "Aéronautique & Défense",
    size: "1000+ employés",
    country: "France",
    city: "Toulouse",
    description: "Géant européen promouvant la diversité culturelle, l'égalité en ingénierie et l'accessibilité handicap.",
    website: "https://www.airbus.com",
    careersUrl: "https://www.airbus.com/careers",
    commitments: [
      "Mixité en ingénierie",
      "Diversité culturelle",
      "Accessibilité",
    ],
    actions: [
      {
        id: "1",
        title: "Objectif 30% de femmes ingénieures",
        description: "Programme de recrutement ciblé pour atteindre 30% de femmes en ingénierie d'ici 2025.",
        category: "Égalité professionnelle",
      },
      {
        id: "2",
        title: "85 nationalités représentées",
        description: "Célébration de la diversité culturelle avec 85 nationalités dans les équipes.",
        category: "Diversité",
      },
    ],
    labels: [
      { id: "1", name: "Label Diversité", issuer: "AFNOR", year: "2024" },
    ],
    inclusionScore: 79,
    verificationStatus: "documented",
    evidences: [],
    lastReviewedAt: "2024-03-08",
    isVerified: true,
    isPublic: true,
  },
  {
    id: "loreal",
    name: "L'Oréal",
    logoInitials: "LO",
    logoGradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
    sector: "Beauté & Cosmétiques",
    size: "1000+ employés",
    country: "France",
    city: "Clichy",
    description: "Leader mondial de la beauté inclusive : 70% de femmes en management, représentation multiculturelle et politiques LGBTQ+ avant-gardistes.",
    website: "https://www.loreal.fr",
    careersUrl: "https://careers.loreal.com",
    publicContactRole: "Chief Diversity Officer",
    commitments: [
      "Beauté inclusive",
      "Parité leadership",
      "Inclusion LGBTQ+",
      "Représentation multiculturelle",
    ],
    actions: [
      {
        id: "1",
        title: "70% de femmes managers",
        description: "Leadership féminin fort avec 70% de femmes dans les postes de management.",
        category: "Égalité professionnelle",
      },
      {
        id: "2",
        title: "Stand Up Against Street Harassment",
        description: "Programme mondial de formation contre le harcèlement de rue, déployé dans 40 pays.",
        category: "Sensibilisation",
      },
      {
        id: "3",
        title: "Beauté pour tous",
        description: "Gammes inclusives représentant toutes les carnations et types de cheveux.",
        category: "Diversité",
      },
    ],
    labels: [
      { id: "1", name: "Top Employeur 2024", issuer: "Top Employers Institute", year: "2024" },
      { id: "2", name: "Diversité Beauté", issuer: "Beauty Industry", year: "2023" },
    ],
    inclusionScore: 90,
    verificationStatus: "verified",
    evidences: [
      {
        id: "1",
        type: "Rapport RSE",
        title: "Rapport Développement Durable 2024",
        publicUrl: "https://www.loreal.com/sustainability",
      },
    ],
    lastReviewedAt: "2024-03-22",
    isVerified: true,
    isPublic: true,
  },
];

// Filter options
export const COMPANY_SECTORS = [
  "Tous les secteurs",
  "Tech & Numérique",
  "Retail & E-commerce",
  "Finance & Banque",
  "Luxe & Mode",
  "Jeux vidéo & Tech",
  "Aéronautique & Défense",
  "Beauté & Cosmétiques",
  "Retail & Sport",
];

export const COMPANY_SIZES = [
  "Toutes les tailles",
  "1-50 employés",
  "51-250 employés",
  "251-1000 employés",
  "1000+ employés",
];

export const COMMITMENT_TYPES = [
  "Tous les engagements",
  "Égalité professionnelle",
  "Accessibilité handicap",
  "Recrutement inclusif",
  "Mentorat",
  "Inclusion LGBTQ+",
  "Diversité culturelle",
  "Lutte contre les discriminations",
  "Bien-être au travail",
];

export const SORT_OPTIONS = [
  { value: "score-desc", label: "Score inclusion (décroissant)" },
  { value: "score-asc", label: "Score inclusion (croissant)" },
  { value: "recent", label: "Récemment vérifiées" },
  { value: "alpha", label: "Ordre alphabétique" },
];
