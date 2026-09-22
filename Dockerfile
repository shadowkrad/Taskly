# Multi-stage Dockerfile per Next.js con SQLite (Taskly)
FROM node:20-alpine AS base

# Installazione dipendenze di sistema necessarie per Prisma e SQLite
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 1. Installazione dipendenze
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/
RUN npm ci

# 2. Build dell'applicazione
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=1

RUN mkdir -p /app/public
RUN npx prisma generate
RUN npm run build

# 3. Immagine finale di produzione
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crea utente non root per sicurezza
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Cartella per dati SQLite con permessi corretti (volume standard /app/data per Taaaac VPS)
RUN mkdir -p /app/data /app/prisma && chown -R nextjs:nodejs /app/data /app/prisma

# Copia gli artifact standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
