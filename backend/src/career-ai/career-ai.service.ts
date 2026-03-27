import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  AnalyzeCareerInput,
  CareerAiAnalysis,
  SkillRecommendation,
  TimeHorizon,
  TransformationImpact,
} from './career-ai.types';

type HeuristicKeyword = {
  tokens: string[];
  score: number;
  risks: string[];
};

type ResilienceKeyword = {
  tokens: string[];
  score: number;
  drivers: string[];
};

type AugmentationKeyword = {
  tokens: string[];
  score: number;
  adjacentRoles: string[];
};

const AUTOMATION_RISK_KEYWORDS: HeuristicKeyword[] = [
  {
    tokens: [
      'comptable',
      'saisie',
      'gestionnaire paie',
      'assistant administratif',
    ],
    score: 4,
    risks: [
      'Automatisation de la saisie et du pré-tri documentaire',
      'Génération automatique de rapports standards',
    ],
  },
  {
    tokens: ['support', 'service client', 'teleconseiller', 'call center'],
    score: 3,
    risks: [
      'Automatisation des réponses de premier niveau',
      'Routage intelligent des demandes simples',
    ],
  },
  {
    tokens: ['developpeur', 'developer', 'software', 'data analyst'],
    score: 2,
    risks: [
      'Génération de code et scripts pour tâches répétitives',
      'Automatisation d’analyses descriptives de base',
    ],
  },
  {
    tokens: ['juriste', 'legal', 'banque', 'finance'],
    score: 3,
    risks: [
      'Pré-analyse automatique de documents volumineux',
      'Rédaction assistée de clauses standards',
    ],
  },
];

const RESILIENCE_KEYWORDS: ResilienceKeyword[] = [
  {
    tokens: [
      'infirmier',
      'infirmiere',
      'aide soignant',
      'medecin',
      'sage femme',
    ],
    score: 5,
    drivers: [
      'Relation humaine et empathie difficilement automatisables',
      'Décisions en contexte réel avec responsabilité clinique',
    ],
  },
  {
    tokens: [
      'plombier',
      'electricien',
      'artisan',
      'technicien terrain',
      'mecanicien',
    ],
    score: 5,
    drivers: [
      'Interventions physiques variées en environnement imprévisible',
      'Diagnostic pratique sur site',
    ],
  },
  {
    tokens: ['enseignant', 'professeur', 'educateur', 'coach'],
    score: 4,
    drivers: [
      'Accompagnement personnalisé et motivation des apprenants',
      'Gestion de dynamiques humaines complexes',
    ],
  },
  {
    tokens: ['psychologue', 'assistant social', 'travailleur social'],
    score: 5,
    drivers: [
      'Écoute active et alliance de confiance',
      'Interprétation nuancée des situations individuelles',
    ],
  },
  {
    tokens: ['chef de projet', 'manager', 'consultant'],
    score: 3,
    drivers: [
      'Arbitrage, leadership et coordination multi-acteurs',
      'Décision stratégique en contexte incertain',
    ],
  },
];

const AUGMENTATION_KEYWORDS: AugmentationKeyword[] = [
  {
    tokens: ['marketing', 'communication', 'designer', 'ux', 'journaliste'],
    score: 4,
    adjacentRoles: [
      'Spécialiste contenus assistés par IA',
      'Prompt designer orienté communication',
    ],
  },
  {
    tokens: ['developpeur', 'data', 'analyst', 'ingenieur'],
    score: 5,
    adjacentRoles: ['Ingénieur intégration IA', 'MLOps / AI operations junior'],
  },
  {
    tokens: ['rh', 'recrutement', 'talent'],
    score: 3,
    adjacentRoles: [
      'Spécialiste recrutement augmenté par IA',
      'Analyste people data',
    ],
  },
  {
    tokens: ['sante', 'medical', 'infirmier', 'medecin'],
    score: 3,
    adjacentRoles: [
      'Coordinateur outils IA cliniques',
      'Référent qualité des données de santé',
    ],
  },
];

const GENERIC_SKILLS: SkillRecommendation[] = [
  {
    skill: 'Culture IA et esprit critique',
    priority: 'haute',
    reason:
      'Comprendre ce que l’IA sait faire et ses limites est essentiel dans tous les métiers.',
  },
  {
    skill: 'Communication et collaboration',
    priority: 'moyenne',
    reason:
      'Les métiers qui évoluent avec l’IA valorisent la coordination humaine.',
  },
  {
    skill: 'Maîtrise des outils numériques',
    priority: 'haute',
    reason:
      'La productivité passe de plus en plus par des outils d’automatisation et d’assistance.',
  },
];

@Injectable()
export class CareerAiService {
  analyzeCareer(input: AnalyzeCareerInput): CareerAiAnalysis {
    const jobTitle = input.jobTitle?.trim();
    if (!jobTitle) throw new BadRequestException('JOB_TITLE_REQUIRED');

    const normalized = this.normalize(jobTitle);

    const automationMatches = AUTOMATION_RISK_KEYWORDS.filter((item) =>
      item.tokens.some((token) => normalized.includes(this.normalize(token))),
    );
    const resilienceMatches = RESILIENCE_KEYWORDS.filter((item) =>
      item.tokens.some((token) => normalized.includes(this.normalize(token))),
    );
    const augmentationMatches = AUGMENTATION_KEYWORDS.filter((item) =>
      item.tokens.some((token) => normalized.includes(this.normalize(token))),
    );

    const automationPressure = this.sum(automationMatches.map((m) => m.score));
    const resilienceStrength = this.sum(resilienceMatches.map((m) => m.score));
    const augmentationPotential = this.sum(
      augmentationMatches.map((m) => m.score),
    );

    const aiCompatibilityScore = this.clamp(
      Math.round(
        50 +
          resilienceStrength * 8 +
          augmentationPotential * 5 -
          automationPressure * 6,
      ),
      18,
      95,
    );

    const transformationIntensity = automationPressure + augmentationPotential;
    const transformationImpact: TransformationImpact =
      transformationIntensity >= 8
        ? 'élevé'
        : transformationIntensity >= 4
          ? 'modéré'
          : 'faible';

    const timeHorizon: TimeHorizon =
      automationPressure >= 6
        ? '0-3 ans'
        : transformationIntensity >= 3
          ? '3-7 ans'
          : '7+ ans';

    const resilienceDrivers = this.uniq(
      resilienceMatches.flatMap((match) => match.drivers),
    );

    const automationRisks = this.uniq(
      automationMatches.flatMap((match) => match.risks),
    );

    const emergingAdjacentRoles = this.uniq(
      augmentationMatches.flatMap((match) => match.adjacentRoles),
    );

    const skillsToDevelop = this.buildSkills({
      automationPressure,
      transformationImpact,
      hasAugmentation: augmentationMatches.length > 0,
    });

    const adviceForYoungPeople = this.buildAdvice({
      transformationImpact,
      aiCompatibilityScore,
      resilienceDrivers,
      automationRisks,
    });

    const confidence = this.computeConfidence(
      automationMatches.length +
        resilienceMatches.length +
        augmentationMatches.length,
    );

    return {
      jobTitle,
      aiCompatibilityScore,
      transformationImpact,
      timeHorizon,
      resilienceDrivers:
        resilienceDrivers.length > 0
          ? resilienceDrivers
          : [
              'La valeur humaine, la créativité et la résolution de problèmes concrets resteront déterminantes.',
            ],
      automationRisks:
        automationRisks.length > 0
          ? automationRisks
          : [
              'Les tâches répétitives et standardisées seront progressivement assistées par l’IA.',
            ],
      skillsToDevelop,
      emergingAdjacentRoles:
        emergingAdjacentRoles.length > 0
          ? emergingAdjacentRoles
          : [
              'Coordinateur outils numériques',
              'Spécialiste amélioration continue des processus',
            ],
      adviceForYoungPeople,
      confidence,
      disclaimer:
        'Cette analyse est indicative et repose sur des tendances générales d’évolution des métiers avec l’IA.',
    };
  }

  private buildSkills(params: {
    automationPressure: number;
    transformationImpact: TransformationImpact;
    hasAugmentation: boolean;
  }): SkillRecommendation[] {
    const skills = [...GENERIC_SKILLS];

    if (params.automationPressure >= 5) {
      skills.unshift({
        skill: 'Supervision des automatisations',
        priority: 'haute',
        reason:
          'Le métier gagne en valeur quand vous pilotez, contrôlez et améliorez les sorties IA.',
      });
    }

    if (params.hasAugmentation) {
      skills.push({
        skill: 'Formulation de consignes (prompting) et vérification qualité',
        priority: 'moyenne',
        reason:
          'Savoir guider les outils IA permet d’obtenir des résultats fiables plus rapidement.',
      });
    }

    if (params.transformationImpact === 'élevé') {
      skills.push({
        skill: 'Apprentissage continu',
        priority: 'haute',
        reason:
          'Les outils et pratiques évoluent vite: la veille et l’adaptation deviennent clés.',
      });
    }

    return this.uniqSkills(skills).slice(0, 5);
  }

  private buildAdvice(params: {
    transformationImpact: TransformationImpact;
    aiCompatibilityScore: number;
    resilienceDrivers: string[];
    automationRisks: string[];
  }): string[] {
    const advice: string[] = [];

    if (params.aiCompatibilityScore >= 70) {
      advice.push(
        'Le métier reste pertinent avec l’IA: cible des rôles hybrides humain + outils IA.',
      );
    } else {
      advice.push(
        'Renforce un socle transférable pour garder plusieurs options d’évolution professionnelle.',
      );
    }

    if (params.transformationImpact === 'élevé') {
      advice.push(
        'Anticipe les changements dès maintenant avec une spécialisation complémentaire.',
      );
    } else if (params.transformationImpact === 'modéré') {
      advice.push(
        'Prévois une montée en compétences progressive sur les outils numériques du secteur.',
      );
    } else {
      advice.push(
        'Le cœur du métier évolue lentement, mais des outils IA amélioreront la productivité.',
      );
    }

    if (params.resilienceDrivers.length > 0) {
      advice.push(
        'Mise sur les compétences humaines à forte valeur: relationnel, jugement, créativité.',
      );
    }

    if (params.automationRisks.length > 0) {
      advice.push(
        'Identifie les tâches répétitives de ton métier pour te positionner sur les tâches à impact.',
      );
    }

    return this.uniq(advice).slice(0, 4);
  }

  private computeConfidence(signalCount: number): number {
    if (signalCount >= 3) return 0.86;
    if (signalCount === 2) return 0.75;
    if (signalCount === 1) return 0.64;
    return 0.55;
  }

  private sum(values: number[]): number {
    return values.reduce((acc, value) => acc + value, 0);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private uniq(values: string[]): string[] {
    return Array.from(new Set(values));
  }

  private uniqSkills(values: SkillRecommendation[]): SkillRecommendation[] {
    const seen = new Set<string>();
    return values.filter((value) => {
      if (seen.has(value.skill)) return false;
      seen.add(value.skill);
      return true;
    });
  }
}
