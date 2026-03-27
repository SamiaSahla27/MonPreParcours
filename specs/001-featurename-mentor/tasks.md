# Tasks: Mentorat (chat + appel vidéo)

**Input**: Design documents from `/specs/001-featurename-mentor/`
- Required: `spec.md`, `plan.md`

**Tech** (from plan.md): NestJS + Prisma + Postgres (Docker), React/Vite + React Router, Socket.IO + WebRTC.

## User Stories (concrete)

- **US1 (P1)**: As a user, I can register/login (mentor/étudiant) and access Mentorat using my JWT stored in `localStorage`.
- **US2 (P2)**: As a paired mentor/étudiant, I can join a conversation (mentorId+etudiantId), see message history, and exchange chat messages (persisted in Postgres).
- **US3 (P3)**: As a paired mentor/étudiant, I can start/receive an in-app video call (WebRTC P2P) with signaling over Socket.IO and a missed-call policy.

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] [US0] Document required env vars (`backend/.env`, `Front/.env*`) and ensure `VITE_BACKEND_URL` points to backend in README.md
- [ ] T002 [US0] Verify `docker-compose.yml` services/ports/volumes are correct and add a note that Docker Desktop must be running

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 [US0] Verify Prisma schema + migrations for `User/Conversation/Message` are present and applied (backend/prisma/schema.prisma, backend/prisma/migrations/*)
- [ ] T004 [US0] Verify AuthModule is wired and `JWT_SECRET` is used consistently (backend/src/app.module.ts, backend/src/auth/auth.module.ts)
- [ ] T005 [US0] Verify DbModule/PrismaService setup and imports (backend/src/db/db.module.ts, backend/src/db/prisma.service.ts)

---

## Phase 3: User Story 1 — Auth end-to-end (Priority: P1) 🎯 MVP

**Goal**: User can register/login with role and the frontend stores JWT in `localStorage` and can call `/auth/me`.

**Independent Test**: From a fresh browser session, register/login, then navigate to Mentorat without pasting tokens.

- [ ] T006 [P] [US1] Verify frontend auth API client matches backend endpoints in Front/src/app/services/authApi.ts
- [ ] T007 [P] [US1] Verify AuthProvider persists JWT in `localStorage` and loads `/auth/me` in Front/src/app/services/authStore.ts
- [ ] T008 [P] [US1] Verify Login/Register pages work with role selection in Front/src/app/pages/Login.tsx and Front/src/app/pages/Register.tsx
- [ ] T009 [US1] Verify routes + provider wrapper are wired in Front/src/app/routes.ts and Front/src/app/App.tsx
- [ ] T010 [US1] Verify navbar shows auth actions + logout in Front/src/app/components/Navbar.tsx
- [ ] T011 [P] [US1] (Optional) Add a minimal auth store unit test file at Front/src/app/services/authStore.test.ts

---

## Phase 4: User Story 2 — Realtime chat + persistence (Priority: P2)

**Goal**: Paired users join a conversation using mentorId+etudiantId, receive history, send messages persisted to Postgres.

**Independent Test**: With 2 accounts (mentor + étudiant), open two browsers, join same mentorId/etudiantId, exchange messages, reload and see history.

- [ ] T012 [P] [US2] Verify Prisma-backed chat store persists messages and upserts conversations in backend/src/realtime/store/chat-message.store.ts
- [ ] T013 [US2] Verify RealtimeService uses Prisma store for history/send in backend/src/realtime/realtime.service.ts
- [ ] T014 [US2] Verify RealtimeModule imports DbModule/JwtModule and provides ChatMessageStore in backend/src/realtime/realtime.module.ts
- [ ] T015 [US2] Verify socket JWT validation uses Nest JwtService in backend/src/realtime/security/jwt-socket-auth.service.ts
- [ ] T016 [P] [US2] Verify/update realtime unit tests (socket auth + service) in backend/src/realtime/security/jwt-socket-auth.service.spec.ts and backend/src/realtime/realtime.service.spec.ts
- [ ] T017 [US2] Verify Mentorat uses auth token/user (no pasted JWT/role/userId) and still joins via mentorId/etudiantId in Front/src/app/pages/Mentorat.tsx

---

## Phase 5: User Story 3 — Video call (Priority: P3)

**Goal**: Users can start a video call with signaling via Socket.IO; missed call after 30s ringing.

**Independent Test**: From two browsers in the same conversation: start call, accept by answering offer, see remote streams; let ringing pass 30s to see missed call.

- [ ] T018 [US3] Verify call lifecycle + missed-call timer behavior (30s policy) in backend/src/realtime/realtime.gateway.ts and backend/src/realtime/realtime.service.ts
- [ ] T019 [US3] Verify WebRTC signaling forwarding requires membership in the conversation room in backend/src/realtime/realtime.gateway.ts
- [ ] T020 [US3] Verify Mentorat WebRTC flow handles offer/answer/candidates and cleans up on hangup in Front/src/app/services/webrtcPeer.ts and Front/src/app/pages/Mentorat.tsx

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T021 [P] [US0] Add README run instructions for local (non-docker) + docker (docker compose) including required env vars in README.md
- [ ] T022 [P] [US0] Add basic error UX for auth failures and realtime disconnects (no new pages) in Front/src/app/pages/Login.tsx and Front/src/app/pages/Mentorat.tsx
- [ ] T023 [US0] Run full test suite: backend `npm test` and Front `npm test`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → Polish
- US2 depends on Phase 2 (DB/Auth) and on US1 for token acquisition in the UI.
- US3 depends on US2 (must be able to join conversation + signaling).

## Parallel Opportunities

- [P] tasks can be done in parallel (separate files) once their prerequisites are done.

## Implementation Strategy

- MVP is US1 (auth end-to-end) + basic Mentorat access.
- Next deliver US2 (chat history + persistence).
- Then US3 (video call stability + missed-call).
