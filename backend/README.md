# Orientation Backend

API NestJS qui orchestre le questionnaire d'orientation et délègue la génération de verdicts à Groq.

## Prérequis

- Node.js 20+
- Une clé API Groq avec accès au modèle `llama-3.3-70b-versatile`

## Configuration

1. Dupliquer `.env.example` vers `.env` puis renseigner la clé :
   ```bash
   cp .env.example .env
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```

### Variables d'environnement

| Clé | Description |
| --- | --- |
| `GROQ_API_KEY` | **Obligatoire.** Jeton API utilisé par `GroqOrientationService`. Sans cette valeur, le service retombe sur le verdict heuristique mocké. |
| `FRONTEND_URL` | Origine autorisée par CORS (défaut `http://localhost:5173`). |
| `PORT` | Port d'écoute HTTP (défaut `3000`). |

## Démarrage

```bash
npm run start:dev
```

Le serveur expose les routes suivantes :

- `GET /orientation/questions/intro` : questions initiales.
- `POST /orientation/sessions` : crée une session et renvoie les questions de suivi.
- `POST /orientation/sessions/:id/complete` : agrège toutes les réponses, appelle Groq et renvoie le verdict IA.

Chaque completion appelle `groq-sdk` avec `response_format=json_object` et s'appuie sur un parseur strict. En cas d'erreur réseau ou de sortie invalide, un verdict heuristique est renvoyé pour préserver l'UX.

## Outils utiles

- `npm run lint` : contrôle rapide de qualité.
- `npm test` / `npm run test:e2e` : suites Jest.
- `npm run groq:cli` : script CLI pour tester un prompt Groq depuis le terminal (exige `GROQ_API_KEY`).

## Dépannage

- Vérifier que `.env` est chargé (le bootstrap importe `dotenv/config`).
- Activer le niveau de log `debug` de Nest si besoin (`DEBUG=* nest start`).
- En cas de raté Groq, consulter les logs `GroqOrientationService` pour confirmer si le fallback heuristique a été déclenché.
