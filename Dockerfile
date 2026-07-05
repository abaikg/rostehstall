# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ---- deps: install dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: build the Next.js app ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be passed as build args (docker-compose forwards them from .env).
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YM_ID
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_SEND_TO
ARG NEXT_PUBLIC_YANDEX_VERIFICATION
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_JIVO_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_YM_ID=$NEXT_PUBLIC_YM_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_GOOGLE_ADS_SEND_TO=$NEXT_PUBLIC_GOOGLE_ADS_SEND_TO \
    NEXT_PUBLIC_YANDEX_VERIFICATION=$NEXT_PUBLIC_YANDEX_VERIFICATION \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_JIVO_ID=$NEXT_PUBLIC_JIVO_ID \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal production image ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Initial catalog/blog data; in production /app/data is a bind mount that
# persists admin edits across rebuilds.
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
