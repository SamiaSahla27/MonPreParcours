import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { DEFAULT_VERDICT } from './defaults';
import { buildHeuristicVerdict } from './heuristic-verdict';
import {
  AdvisorVerdict,
  OrientationGroqPayload,
  SchoolRecommendation,
  TimelineStep,
} from './orientation.types';

type UnknownRecord = Record<string, unknown>;

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const SCHEMA_DESCRIPTION = {
  verdict_orientation: {
    profil: 'Titre du profil',
    description_profil: 'Explication courte',
    cap_principal: 'Metier cible',
    niveau_confiance_pourcentage: 85,
    competences_a_renforcer: ['Competence 1', 'Competence 2', 'Competence 3'],
  },
  timeline_cursus: [
    {
      annee_numero: 1,
      titre: 'Titre de lannee',
      description: 'Description courte',
      actions_cles: ['Action 1', 'Action 2', 'Action 3'],
    },
  ],
  ecoles_recommandees: [
    {
      nom_etablissement: 'Nom de lecole',
      localisation: 'Villes',
      statut: 'Prive ou Public',
      formation: 'Nom du diplome',
      duree: 'Duree en annees',
      cout: 'Cout annuel',
      commentaire_ia: 'Pourquoi ce choix',
    },
  ],
};

@Injectable()
export class GroqOrientationService {
  private readonly logger = new Logger(GroqOrientationService.name);
  private readonly client?: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.client = new Groq({ apiKey });
    } else {
      this.logger.warn(
        'Aucune cle GROQ_API_KEY detectee, utilisation du verdict par defaut.',
      );
    }
  }

  async generateVerdict(
    payload: OrientationGroqPayload,
  ): Promise<AdvisorVerdict> {
    if (!this.client) {
      return buildHeuristicVerdict(payload);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'Tu es un conseiller dorientation expert du systeme educatif francais. ' +
              'Analyse les informations eleve + contexte et renvoie un plan concret. ' +
              'Reponds UNIQUEMENT avec un JSON valide suivant ce schema: ' +
              `${JSON.stringify(SCHEMA_DESCRIPTION)}`,
          },
          {
            role: 'user',
            content: `Donnees etudiant: ${JSON.stringify(payload)}`,
          },
        ],
      });

      const content = completion.choices?.[0]?.message?.content ?? '';
      const parsed = JSON.parse(content) as unknown;
      return this.mapGroqResponse(parsed, payload);
    } catch (error) {
      this.logger.error(
        'Echec de generation Groq, retour au verdict par defaut',
        error as Error,
      );
      return buildHeuristicVerdict(payload);
    }
  }

  private mapGroqResponse(
    response: unknown,
    payload: OrientationGroqPayload,
  ): AdvisorVerdict {
    const heuristic = buildHeuristicVerdict(payload);

    if (!isUnknownRecord(response)) {
      return heuristic;
    }

    const verdictRaw = response.verdict_orientation;
    if (!isUnknownRecord(verdictRaw) || typeof verdictRaw.profil !== 'string') {
      return heuristic;
    }

    const timelineRaw = Array.isArray(response.timeline_cursus)
      ? response.timeline_cursus.filter(isUnknownRecord)
      : [];
    const schoolsRaw = Array.isArray(response.ecoles_recommandees)
      ? response.ecoles_recommandees.filter(isUnknownRecord)
      : [];

    const confidenceValue =
      typeof verdictRaw.niveau_confiance_pourcentage === 'number'
        ? `Confiance ${verdictRaw.niveau_confiance_pourcentage}%`
        : heuristic.confidenceLabel;

    const keySkills =
      isStringArray(verdictRaw.competences_a_renforcer) &&
      verdictRaw.competences_a_renforcer.length
        ? verdictRaw.competences_a_renforcer
        : heuristic.keySkills;

    const timeline = timelineRaw.length
      ? timelineRaw.map((step, index) =>
          this.mapTimelineStep(
            step,
            index,
            heuristic.timeline[index] ?? heuristic.timeline[0],
          ),
        )
      : heuristic.timeline;

    const schools = schoolsRaw.length
      ? schoolsRaw.map((entry, index) =>
          this.mapSchoolEntry(
            entry,
            index,
            heuristic.schools[index] ?? heuristic.schools[0],
          ),
        )
      : heuristic.schools;

    return {
      title: verdictRaw.profil,
      summary:
        typeof verdictRaw.description_profil === 'string'
          ? verdictRaw.description_profil
          : heuristic.summary,
      recommendedPath:
        typeof verdictRaw.cap_principal === 'string'
          ? verdictRaw.cap_principal
          : heuristic.recommendedPath,
      confidenceLabel: confidenceValue,
      keySkills,
      timeline,
      schools,
    };
  }

  private mapTimelineStep(
    step: UnknownRecord,
    index: number,
    fallback: TimelineStep,
  ): TimelineStep {
    const yearValue =
      typeof step.annee_numero === 'number' &&
      Number.isFinite(step.annee_numero)
        ? step.annee_numero
        : index + 1;
    const milestones = isStringArray(step.actions_cles)
      ? step.actions_cles
      : (fallback?.milestones ?? DEFAULT_VERDICT.timeline[0].milestones);

    return {
      id: fallback?.id ?? `y${yearValue}`,
      yearLabel: fallback?.yearLabel ?? `Annee ${yearValue}`,
      title:
        typeof step.titre === 'string'
          ? step.titre
          : (fallback?.title ?? `Orientation - ${index + 1}`),
      focus:
        typeof step.description === 'string'
          ? step.description
          : (fallback?.focus ?? 'Priorite a clarifier'),
      milestones,
    };
  }

  private mapSchoolEntry(
    school: UnknownRecord,
    index: number,
    fallback: SchoolRecommendation,
  ): SchoolRecommendation {
    const statusValue =
      school.statut === 'Public'
        ? 'Public'
        : school.statut === 'Prive'
          ? 'Prive'
          : (fallback?.status ?? 'Public');

    return {
      id: fallback?.id ?? `school-${index}`,
      name:
        typeof school.nom_etablissement === 'string'
          ? school.nom_etablissement
          : (fallback?.name ?? 'Etablissement a preciser'),
      city:
        typeof school.localisation === 'string'
          ? school.localisation
          : (fallback?.city ?? 'France'),
      status: statusValue,
      program:
        typeof school.formation === 'string'
          ? school.formation
          : (fallback?.program ?? 'Programme a definir'),
      duration:
        typeof school.duree === 'string'
          ? school.duree
          : (fallback?.duration ?? '3-5 ans'),
      annualCost:
        typeof school.cout === 'string'
          ? school.cout
          : (fallback?.annualCost ?? 'Selon statut'),
      whyItFits:
        typeof school.commentaire_ia === 'string'
          ? school.commentaire_ia
          : (fallback?.whyItFits ?? 'Alignement strategique a confirmer'),
    };
  }
}
