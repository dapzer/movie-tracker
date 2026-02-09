FROM node:24.13.0-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

FROM base AS pnpm-base
ARG PNPM_VERSION=10.29.1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM pnpm-base AS turbo-base
ARG TURBO_VERSION=2.8.3
RUN npm install -g turbo@${TURBO_VERSION}
ENV TURBO_TELEMETRY_DISABLED=1

FROM turbo-base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune --scope=frontend --docker
RUN ls -la out
RUN ls -la out/full


FROM turbo-base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.json tsconfig.json
COPY --from=pruner /app/turbo.json turbo.json

WORKDIR /app/apps/frontend

RUN pnpm install

FROM installer AS builder
WORKDIR /app

COPY --from=installer /app .

ARG VITE_BASE_URL
ARG VITE_API_LOCAL_URL
ARG VITE_API_URL
ARG NUXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_LOCAL_URL=$VITE_API_LOCAL_URL
ENV VITE_API_URL=$VITE_API_URL
ENV NUXT_PUBLIC_SENTRY_DSN=$NUXT_PUBLIC_SENTRY_DSN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

RUN turbo run build --filter=frontend

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontend

USER frontend
COPY --from=builder /app/apps/frontend/.output .

ENV NODE_ENV=production

CMD ["node", "--import", "./server/sentry.server.config.mjs", "./server/index.mjs"]
