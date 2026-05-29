import { Injectable, Logger } from '@nestjs/common';
import Groq, { type Groq as GroqType } from 'groq-sdk';
import { DEFAULT_VERDICT } from './defaults';
import { buildHeuristicVerdict } from './heuristic-verdict';
import {
  AdvisorVerdict,
  OrientationGroqPayload,
  OrientationQuizQuestion,
  SchoolRecommendation,
  TimelineStep,
} from './orientation.types';
import { getProfileDefinition } from './profiles';

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

const QUESTIONS_SCHEMA_DESCRIPTION = {
  questions: [
    {
      id: 'q1',
      prompt: "Question posee a l'utilisateur",
      inputPlaceholder: 'Exemple de reponse attendue',
      options: [
        {
          id: 'opt1',
          label: 'Option 1',
          helper: 'Aide optionnelle',
        },
      ],
    },
  ],
};

@Injectable()
export class GroqOrientationService {
  private readonly logger = new Logger(GroqOrientationService.name);
  private readonly client?: GroqType;
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
              "Tu es un système intelligent d'orientation professionnelle et scolaire.\n" +
              "Ton objectif est de poser des questions pertinentes et adaptatives pour comprendre le profil de l'utilisateur et l'aider à définir une orientation.\n" +
              'Règles :\n' +
              '1. Commence toujours par identifier le type de profil : étudiant, personne en reconversion, salarié, sans emploi, entrepreneur / indépendant.\n' +
              '2. En fonction du profil, génère une série de questions spécifiques et adaptées (intérêts, compétences, contraintes, motivations profondes).\n' +
              '3. Adapte les questions dynamiquement en fonction des réponses précédentes : si vague → creuse, si piste → approfondis, si blocage → explore-le.\n' +
              '4. Ne pose jamais des questions génériques si elles peuvent être personnalisées.\n' +
              '5. Structure : 5 à 10 questions maximum par étape, progression logique (général → spécifique).\n' +
              "6. Ton objectif final est de produire : un profil clair de la personne et des pistes d'orientation cohérentes.\n" +
              "7. Propose obligatoirement entre 4 et 6 écoles ou formations (dans le tableau ecoles_recommandees) pour donner plusieurs choix à l'utilisateur. Varie tes propositions : écoles publiques, privées, universités, BTS, BUT, formations courtes, en alternance, etc., du moment qu'elles sont reconnues par l'Etat (RNCP, diplôme visé).\n" +
              "8. Si l'utilisateur mentionne des contraintes (budget limité, zone géographique restreinte, besoin d'alternance), pose des sous-questions spécifiques pour préciser ces critères (ex: 'Quel est ton budget maximum ?', 'Dans quel département souhaites-tu étudier ?') avant de générer le verdict final.\n" +
              "Exemples d'adaptation : Si étudiant → focus sur matières, préférences, projection. Si reconversion → focus sur expérience, motivations, contraintes.\n" +
              "Important : Les questions doivent donner l'impression d'un échange humain et personnalisé, pas d'un questionnaire rigide.\n" +
              'ATTENTION TRES IMPORTANT: Si le champ "studentNotes" est fourni (requête de l\'etudiant), TU DOIS ABSOLUMENT LE PRIORISER et changer radicalement de metier/profil pour correspondre exactement à cette demande, en ignorant le profil initial si necessaire. ' +
              'Reponds UNIQUEMENT avec un JSON valide suivant ce schema pour le VERDICT: ' +
              `${JSON.stringify(SCHEMA_DESCRIPTION)}`,
          },
          {
            role: 'user',
            content: `Donnees etudiant: ${JSON.stringify(
              this.buildPromptPayload(payload),
            )}`,
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

  async generateQuestions(
    payload: OrientationGroqPayload,
    fallback: OrientationQuizQuestion[],
  ): Promise<OrientationQuizQuestion[]> {
    if (!this.client) {
      return fallback;
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
              "Tu es un spécialiste de l'orientation scolaire et professionnelle.\n" +
              "L'utilisateur vient de répondre à ses 10 premières questions générales.\n" +
              'Génère exactement 5 questions pertinentes, précises et ciblées pour creuser son profil, ses intérêts et ses contraintes.\n' +
              'Tu dois répondre au format JSON exact suivant pour les 5 questions :\n' +
              `${JSON.stringify(QUESTIONS_SCHEMA_DESCRIPTION)}`,
          },
          {
            role: 'user',
            content: `Données étudiées : ${JSON.stringify(this.buildPromptPayload(payload))}`,
          },
        ],
      });

      const content = completion.choices?.[0]?.message?.content ?? '';
      const parsed = JSON.parse(content) as unknown;
      
      if (
        isUnknownRecord(parsed) &&
        Array.isArray(parsed.questions) &&
        parsed.questions.length > 0
      ) {
        return parsed.questions as unknown as OrientationQuizQuestion[];
      }
      return fallback;
    } catch (error) {
      this.logger.error(
        'Echec de la generation des questions Groq',
        error as Error,
      );
      return fallback;
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
    const statutRaw = typeof school.statut === 'string' 
      ? school.statut.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
      : '';
      
    const statusValue =
      statutRaw.includes('public') || statutRaw.includes('publique')
        ? 'Public'
        : statutRaw.includes('prive')
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

  private buildPromptPayload(payload: OrientationGroqPayload) {
    const profile = getProfileDefinition(payload.profileId);
    return {
      educationLevel: payload.educationLevel,
      profile,
      profileId: payload.profileId,
      phase1Answers: payload.phase1Answers,
      phase2Answers: payload.phase2Answers,
      studentNotes: payload.studentNotes ?? null,
    };
  }
}
