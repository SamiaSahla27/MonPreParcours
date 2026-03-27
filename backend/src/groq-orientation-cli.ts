import 'dotenv/config';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error(
    '[erreur] clé GROQ_API_KEY manquante. Placez-la dans .env ou export GROQ_API_KEY=...',
  );
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

type OrientationCliPayload = Record<string, unknown>;

const schemaAttendu = {
  verdict_orientation: {
    profil: 'Titre du profil',
    description_profil: 'Explication courte',
    cap_principal: 'Métier cible',
    niveau_confiance_pourcentage: 85,
    competences_a_renforcer: ['Compétence 1', 'Compétence 2', 'Compétence 3'],
  },
  timeline_cursus: [
    {
      annee_numero: 1,
      titre: "Titre de l'année",
      description: 'Description courte',
      actions_cles: ['Action 1', 'Action 2', 'Action 3'],
    },
  ],
  ecoles_recommandees: [
    {
      nom_etablissement: "Nom de l'école",
      localisation: 'Villes',
      statut: 'Privé ou Public',
      formation: 'Nom du diplôme',
      duree: 'Durée en années',
      cout: 'Coût annuel',
      commentaire_ia: 'Pourquoi ce choix',
    },
  ],
};

async function obtenirRecommandation(
  donneesUtilisateur: OrientationCliPayload,
): Promise<unknown> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `Tu es un conseiller d'orientation expert du système éducatif français.\nTu dois analyser le profil de l'étudiant et proposer un cursus réaliste avec 4 écoles RÉELLES en France.\n\nCONTRAINTE ABSOLUE : Tu dois répondre UNIQUEMENT avec un objet JSON valide.\nTon JSON doit respecter EXACTEMENT cette structure (ne rajoute pas de clés, n'en enlève pas) :\n${JSON.stringify(
            schemaAttendu,
            null,
            2,
          )}`,
        },
        {
          role: 'user',
          content: `Voici les données de l'étudiant : ${JSON.stringify(donneesUtilisateur)}`,
        },
      ],
    });

    const reponseTexte = chatCompletion.choices?.[0]?.message?.content || '{}';
    return JSON.parse(reponseTexte) as unknown;
  } catch (erreur) {
    console.error("Erreur lors de l'appel à Groq :", erreur);
    throw erreur;
  }
}

async function main() {
  const donneesTest: OrientationCliPayload = {
    niveau_actuel: 'Terminale',
    specialites: ['Mathématiques', 'Physique'],
    moyenne_generale: 13.5,
    interets: [
      'Intelligence Artificielle',
      'Création de produits',
      'Management',
    ],
    budget_annuel_max: 10000,
    mobilite: ['Paris', 'Lyon', 'Distanciel'],
  };

  console.log('=== Appel à Groq en cours... ===');
  const resultat = await obtenirRecommandation(donneesTest);
  console.log(JSON.stringify(resultat, null, 2));
}

void main();
