import { AdvisorVerdict } from './orientation.types';

export const DEFAULT_VERDICT: AdvisorVerdict = {
  title: 'Verdict Orientation IA - Profil Product & IA appliquee',
  summary:
    'Ton profil montre une combinaison rare: sens utilisateur, capacite danalyse et envie de concret. La trajectoire la plus pertinente est un parcours Product + IA appliquee, avec une forte dimension projet et alternance.',
  recommendedPath:
    'Cible prioritaire: Product Manager IA Junior ou Product Analyst avec specialisation orientation/edtech.',
  confidenceLabel: 'Confiance elevee (87%)',
  keySkills: [
    'UX Research',
    'Data storytelling',
    'Prompt engineering',
    'Gestion de projet agile',
    'Communication conseil',
  ],
  timeline: [
    {
      id: 'y1',
      yearLabel: 'Annee 1',
      title: 'Fondations numeriques et orientation metier',
      focus:
        'Consolider les bases produit, data literacy et communication pro.',
      milestones: [
        'Construire 2 projets portfolio orientes utilisateur',
        'Valider un niveau B2 anglais pro',
        'Realiser une immersion de 6 semaines en entreprise',
      ],
    },
    {
      id: 'y2',
      yearLabel: 'Annee 2',
      title: 'Specialisation Product & IA appliquee',
      focus:
        'Approfondir UX research, analytics produit et methodes IA no-code.',
      milestones: [
        'Prendre le lead sur un produit fil rouge en equipe',
        'Obtenir une certification data analytics (Google ou equivalent)',
        'Participer a un hackathon orientation/education',
      ],
    },
    {
      id: 'y3',
      yearLabel: 'Annee 3',
      title: 'Professionnalisation et insertion',
      focus: 'Alterner entre missions en entreprise et projet de fin detudes.',
      milestones: [
        'Alternance 12 mois sur un role Product ou UX',
        'Soutenance dun projet IA utile a linclusion educative',
        'Preparation des candidatures Master ou CDI junior',
      ],
    },
    {
      id: 'y4-5',
      yearLabel: 'Annee 4-5',
      title: 'Expertise et acceleration de carriere',
      focus:
        'Monter sur des postes Product Manager IA / Consultant orientation digitale.',
      milestones: [
        'Pilotage dune roadmap produit avec KPI',
        'Publication detudes de cas sectorielles',
        'Ciblage de postes expert en public ou prive',
      ],
    },
  ],
  schools: [
    {
      id: 'epitech',
      name: 'Epitech',
      city: 'Paris / Lyon / Toulouse',
      status: 'Prive',
      program:
        'Programme Grande Ecole - Expert en technologies de linformation',
      duration: '5 ans',
      annualCost: 'Environ 9 900 EUR/an',
      whyItFits:
        'Parfait si tu veux un rythme projet intensif avec forte employabilite et ouverture startup.',
    },
    {
      id: 'ups',
      name: 'Universite Toulouse III - Paul Sabatier',
      city: 'Toulouse',
      status: 'Public',
      program: 'Licence Informatique puis Master MIAGE / Data',
      duration: '3 ans + 2 ans',
      annualCost: 'Frais universitaires nationaux',
      whyItFits:
        'Excellente option budget maitrise, solide academiquement, avec passerelles vers lalternance.',
    },
    {
      id: 'sorbonne',
      name: 'Sorbonne Universite',
      city: 'Paris',
      status: 'Public',
      program: 'Licence Informatique puis Master mention IA',
      duration: '5 ans',
      annualCost: 'Frais universitaires nationaux',
      whyItFits:
        'Tres bon choix pour viser expertise IA et poursuite vers des roles R&D ou conseil avance.',
    },
    {
      id: 'esilv',
      name: 'ESILV',
      city: 'Paris La Defense',
      status: 'Prive',
      program: 'Ingenieur numerique - majeure Data & IA',
      duration: '5 ans',
      annualCost: 'Environ 11 000 EUR/an',
      whyItFits:
        'Cadre professionnalisant, projets entreprises et forte composante innovation produit.',
    },
  ],
};
