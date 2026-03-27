export enum SubmissionStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  NEEDS_MORE_INFO = "needs_more_info",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum CompanySize {
  SMALL = "1-50 employés",
  MEDIUM = "51-250 employés",
  LARGE = "251-1000 employés",
  ENTERPRISE = "1000+ employés",
}

export enum EvidenceType {
  PDF_DOCUMENT = "Document PDF",
  RSE_REPORT = "Rapport RSE/ESG",
  PUBLIC_URL = "Lien public / Page officielle",
  CHARTER = "Charte ou politique interne",
  CERTIFICATION = "Certification ou label",
  OFFICIAL_INDEX = "Index ou indicateur officiel",
  RECRUITMENT_PAGE = "Page recrutement",
  ACCESSIBILITY_DOC = "Document accessibilité",
  EQUALITY_REPORT = "Rapport égalité professionnelle",
  PROGRAM_DOC = "Programme ou initiative documenté",
}

export interface Commitment {
  id: string;
  type: string;
  description: string;
  selected: boolean;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  year?: string;
  fileUrl?: string;
  externalUrl?: string;
  file?: File;
}

export interface CompanySubmission {
  id?: string;
  // Étape 1: Informations générales
  companyName: string;
  website: string;
  industry: string;
  size: CompanySize | string;
  country: string;
  city: string;
  contactEmail: string;
  contactName: string;
  contactRole: string;
  linkedinUrl?: string;
  description: string;
  
  // Étape 2: Engagements
  commitments: Commitment[];
  
  // Étape 3: Preuves
  evidences: Evidence[];
  
  // Étape 4: Validation
  swornStatementAccepted: boolean;
  
  // Métadonnées
  status: SubmissionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  adminNotes?: string;
}

export const COMMITMENT_TYPES = [
  {
    id: "anti-discrimination",
    label: "Politique anti-discrimination formalisée",
    placeholder: "Décrivez votre politique anti-discrimination",
  },
  {
    id: "professional-equality",
    label: "Politique d'égalité professionnelle",
    placeholder: "Décrivez vos actions en matière d'égalité professionnelle",
  },
  {
    id: "inclusive-recruitment",
    label: "Recrutement inclusif",
    placeholder: "Expliquez votre processus de recrutement inclusif",
  },
  {
    id: "accessibility",
    label: "Accessibilité pour les personnes en situation de handicap",
    placeholder: "Détaillez vos dispositifs d'accessibilité",
  },
  {
    id: "mentorship",
    label: "Programmes de mentorat ou d'accompagnement",
    placeholder: "Présentez vos programmes de mentorat",
  },
  {
    id: "training",
    label: "Sensibilisation / formation interne sur les biais ou la diversité",
    placeholder: "Décrivez vos formations internes",
  },
  {
    id: "employee-networks",
    label: "Réseaux internes / groupes ressources employés",
    placeholder: "Listez vos réseaux ou groupes internes",
  },
  {
    id: "pay-equity",
    label: "Mesures sur l'équité salariale",
    placeholder: "Expliquez vos mesures d'équité salariale",
  },
  {
    id: "representation",
    label: "Actions concrètes en faveur de la représentation",
    placeholder: "Détaillez vos actions pour la représentation",
  },
  {
    id: "workplace-adaptation",
    label: "Dispositifs d'aménagement ou d'adaptation des postes",
    placeholder: "Décrivez vos dispositifs d'aménagement",
  },
  {
    id: "metrics",
    label: "Suivi d'indicateurs internes liés à l'inclusion",
    placeholder: "Présentez vos indicateurs de suivi",
  },
];

export const INDUSTRIES = [
  "Tech & Numérique",
  "Finance & Banque",
  "Retail & E-commerce",
  "Santé & Pharmaceutique",
  "Industrie & Manufacture",
  "Conseil & Services",
  "Média & Communication",
  "Éducation & Formation",
  "Énergie & Environnement",
  "Transport & Logistique",
  "Luxe & Mode",
  "Agroalimentaire",
  "Immobilier & Construction",
  "Autre",
];

export function validateSubmission(submission: CompanySubmission): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Étape 1 validation
  if (!submission.companyName?.trim()) errors.push("Le nom de l'entreprise est requis");
  if (!submission.website?.trim()) errors.push("Le site web est requis");
  if (!submission.industry?.trim()) errors.push("Le secteur d'activité est requis");
  if (!submission.size) errors.push("La taille de l'entreprise est requise");
  if (!submission.country?.trim()) errors.push("Le pays est requis");
  if (!submission.city?.trim()) errors.push("La ville est requise");
  if (!submission.contactEmail?.trim()) errors.push("L'email de contact est requis");
  if (!submission.contactName?.trim()) errors.push("Le nom du contact est requis");
  if (!submission.contactRole?.trim()) errors.push("Le poste du contact est requis");
  if (!submission.description?.trim()) errors.push("La description de l'entreprise est requise");

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (submission.contactEmail && !emailRegex.test(submission.contactEmail)) {
    errors.push("L'adresse email n'est pas valide");
  }

  // URL validation
  const urlRegex = /^https?:\/\/.+/;
  if (submission.website && !urlRegex.test(submission.website)) {
    errors.push("Le site web doit commencer par http:// ou https://");
  }

  // Étape 2 validation
  const selectedCommitments = submission.commitments.filter((c) => c.selected);
  if (selectedCommitments.length < 2) {
    errors.push("Au moins 2 engagements doivent être déclarés");
  }

  // Check if selected commitments have descriptions
  const commitmentsWithoutDesc = selectedCommitments.filter(
    (c) => !c.description?.trim()
  );
  if (commitmentsWithoutDesc.length > 0) {
    errors.push("Tous les engagements sélectionnés doivent avoir une description");
  }

  // Étape 3 validation
  if (submission.evidences.length < 2) {
    errors.push("Au moins 2 preuves doivent être fournies");
  }

  const hasPublicLinkOrFile = submission.evidences.some((e) => e.externalUrl?.trim() || e.file);
  if (!hasPublicLinkOrFile) {
    errors.push("Au moins 1 preuve avec un lien public ou un fichier est requise");
  }

  // Check that each evidence has either URL or file
  const evidencesWithoutProof = submission.evidences.filter(
    (e) => !e.externalUrl?.trim() && !e.file
  );
  if (evidencesWithoutProof.length > 0) {
    errors.push("Chaque preuve doit avoir soit un lien URL, soit un fichier uploadé");
  }

  // Étape 4 validation
  if (!submission.swornStatementAccepted) {
    errors.push("L'attestation sur l'honneur doit être acceptée");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
