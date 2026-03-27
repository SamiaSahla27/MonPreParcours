# Multi-stage build: Front (Vite) + Backend (Nest)

FROM node:20-alpine AS front_build
WORKDIR /app/Front
COPY Front/package*.json ./
RUN npm ci
COPY Front/ ./
RUN npm run build

FROM node:20-alpine AS backend_build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Backend runtime deps
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Built backend + prisma schema
COPY --from=backend_build /app/backend/dist ./backend/dist
COPY --from=backend_build /app/backend/prisma ./backend/prisma

# Built front assets (served as static files by Nest if you wire it, or via a separate server)
COPY --from=front_build /app/Front/dist ./Front/dist

EXPOSE 3000
CMD ["node", "backend/dist/main"]
