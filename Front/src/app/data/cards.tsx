import {
  Sparkles,
  Play,
  Users,
  Heart,
  Shield,
} from "lucide-react";
import React from "react";

export interface CardData {
  id: string;
  label: string;
  need: string;
  description: string;
  badge?: string;
  accentColor: string;
  lightColor: string;
  textOnAccent: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  gradient: string;
  detailTitle: string;
  detailFeatures: { title: string; description: string }[];
  ctaLabel: string;
}

export const cards: CardData[] = [
  {
    id: "decouvrir",
    label: "Orientation IA",
    need: "J'ai besoin d'être aidé pour savoir quel métier pourrait me correspondre",
    description: "Quiz carrière IA, suggestions personnalisées, parcours sur-mesure",
    badge: "Recommandé",
    accentColor: "#7C3AED",
    lightColor: "#EDE9FE",
    textOnAccent: "#FFFFFF",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
    detailTitle: "Découvrir mon métier idéal",
    detailFeatures: [
      { title: "Quiz de personnalité IA", description: "30 questions intelligentes qui analysent tes valeurs, compétences et aspirations pour te proposer des métiers qui te correspondent vraiment." },
      { title: "Suggestions personnalisées", description: "Notre IA croise tes réponses avec les tendances du marché pour te proposer un top 5 de métiers réalistes et motivants." },
      { title: "Parcours sur-mesure", description: "Génère un plan d'action personnalisé avec les étapes concrètes pour atteindre ton métier cible." },
    ],
    ctaLabel: "Démarrer le quiz",
  },
  {
    id: "simulateur",
    label: "Simulations",
    need: "J'ai besoin de voir des simulateurs de métier",
    description: "Simulations immersives, journées-type, missions interactives",
    accentColor: "#F97316",
    lightColor: "#FFF7ED",
    textOnAccent: "#FFFFFF",
    icon: Play,
    gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    detailTitle: "Simuler un métier",
    detailFeatures: [
      { title: "Journée dans la peau d'un pro", description: "Vis une journée type dans plus de 50 métiers différents, avec des choix qui influencent le récit et te montrent la réalité du terrain." },
      { title: "Missions interactives", description: "Résous de vraies problématiques professionnelles dans des environnements simulés — sans prise de risque, avec un maximum d'apprentissage." },
      { title: "Score de compatibilité", description: "À la fin de chaque simulation, reçois un score de compatibilité et des recommandations pour progresser." },
    ],
    ctaLabel: "Lancer une simulation",
  },
  {
    id: "mentoring",
    label: "Mentorat",
    need: "Je veux avoir des interactions avec des professionnels",
    description: "Sessions de mentorat live, témoignages, Q&A avec des experts",
    accentColor: "#10B981",
    lightColor: "#ECFDF5",
    textOnAccent: "#FFFFFF",
    icon: Users,
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    detailTitle: "Rencontrer des professionnels",
    detailFeatures: [
      { title: "Sessions de mentorat live", description: "Réserve des créneaux de 30 min avec des professionnels volontaires dans ton domaine d'intérêt. 100% gratuit." },
      { title: "Témoignages vidéo", description: "Explore notre bibliothèque de 200+ témoignages de pros qui racontent leur parcours, leurs galères et leurs conseils." },
      { title: "Q&A avec des experts", description: "Pose tes questions à des experts du secteur lors de sessions live hebdomadaires ou parcours les archives." },
    ],
    ctaLabel: "Trouver un mentor",
  },
  {
    id: "inclusion",
    label: "Engagement",
    need: "Je veux savoir si des entreprises ont fait des actions impactantes sur l'inclusion et la diversité",
    description: "Labels RSE, index diversité, initiatives concrètes des employeurs",
    accentColor: "#F43F5E",
    lightColor: "#FFF1F2",
    textOnAccent: "#FFFFFF",
    icon: Heart,
    gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
    detailTitle: "Entreprises engagées",
    detailFeatures: [
      { title: "Index diversité & inclusion", description: "Consulte les scores D&I des entreprises, leur index d'égalité professionnelle et leurs engagements concrets en matière de diversité." },
      { title: "Labels RSE vérifiés", description: "Filtre les entreprises par labels : Great Place to Work, Top Employeur, Label Diversité, et bien d'autres certifications indépendantes." },
      { title: "Initiatives concrètes", description: "Découvrez les programmes de mentorat, les politiques de recrutement inclusif et les actions terrain de chaque employeur référencé." },
    ],
    ctaLabel: "Explorer les entreprises",
  },
  {
    id: "futur",
    label: "Futur & IA",
    need: "Je veux savoir si des métiers vont résister face à la montée de l'IA",
    description: "Score de résilience des métiers, compétences clés, métiers émergents",
    badge: "Nouveau",
    accentColor: "#0EA5E9",
    lightColor: "#F0F9FF",
    textOnAccent: "#FFFFFF",
    icon: Shield,
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    detailTitle: "Métiers face à l'IA",
    detailFeatures: [
      { title: "Score de résilience IA", description: "Chaque métier reçoit un score de 0 à 100 indiquant sa résistance face à l'automatisation, basé sur les dernières recherches du OCDE et de McKinsey." },
      { title: "Compétences à développer", description: "Identifie les compétences humaines irremplaçables dans ton domaine et accède à des ressources pour les renforcer." },
      { title: "Métiers émergents", description: "Découvre les 50 métiers du futur créés par l'IA — prompt engineer, AI trainer, ethicist IA — et comment y accéder dès maintenant." },
    ],
    ctaLabel: "Analyser mon métier",
  },
];
