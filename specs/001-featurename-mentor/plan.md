# Implementation Plan: Mentorat (chat + appel vidéo)

**Feature**: Mentorat (chat + appel vidéo)
**Branch**: `001-featurename-mentor`
**Date**: 2026-03-27

## Tech Stack

### Backend
- NestJS (REST + Socket.IO gateway)
- Prisma ORM
- PostgreSQL (Docker)
- Auth: email/password (bcrypt) + JWT (`@nestjs/jwt`, `passport-jwt`)
- Tests: Jest

### Frontend
- React + Vite
- React Router
- UI: existing project components + MUI where already used
- Realtime client: `socket.io-client`
- Video: WebRTC (`RTCPeerConnection`) with signaling over Socket.IO
- Tests: Vitest (unit)

### Dev / Ops
- `docker-compose.yml` runs: Postgres + backend + frontend
- Hot reload via `npm run start:dev` (backend) and `npm run dev -- --host 0.0.0.0` (front)

## Architecture Overview

### Auth
- HTTP:
  - `POST /auth/register` (email, password, role) → JWT
  - `POST /auth/login` (email, password) → JWT
  - `GET /auth/me` (Bearer JWT) → current user
- Frontend:
  - Persist JWT in `localStorage`
  - Attach JWT to HTTP requests via `Authorization: Bearer <token>`
  - Attach JWT to Socket.IO handshake via `auth: { token }`

### Realtime
- Socket.IO namespace: `/realtime`
- Presence: client joins a room named by its `userId`
- Conversation room id (deterministic): `mentor:{mentorId}|etudiant:{etudiantId}`
- Pairing rule (Option B): join requires `mentorId` + `etudiantId`; server enforces that logged-in mentor can only join when their `userId==mentorId` (student similarly).
- Messages:
  - Persist in Postgres via Prisma `Conversation` + `Message`
  - On join, server returns last N messages
- Calls:
  - No recording
  - Missed call policy: mark missed after 30s ringing

## Data Model (Prisma)
- `User` (id, email, passwordHash, role)
- `Conversation` (unique mentorId+etudiantId)
- `Message` (conversationId FK, fromUserId, toUserId, text, createdAt)

## Repo Structure (existing)

### Backend
- `backend/src/auth/*`
- `backend/src/db/*`
- `backend/src/realtime/*`

### Frontend
- `Front/src/app/services/*` (e.g., `realtimeClient.ts`, `webrtcPeer.ts`)
- `Front/src/app/pages/*` (e.g., `Mentorat.tsx`, `Login.tsx`, `Register.tsx`)

## Environments
- Backend uses `JWT_SECRET` and `DATABASE_URL`
- Front uses `VITE_BACKEND_URL`

## Testing Strategy
- Backend: unit tests for Auth + realtime security/persistence
- Frontend: unit tests for helpers and core auth store logic (lightweight)

## Implementation Strategy
1. Ensure auth end-to-end (HTTP + Front persistence).
2. Ensure realtime uses JWT and enforces pairing rule.
3. Ensure messages persist and history returns.
4. Ensure Mentorat uses logged-in user + token.
5. Verify with tests + dev smoke (docker compose when available).
