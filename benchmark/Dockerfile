# syntax=docker/dockerfile:1

FROM node:24.13.0-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.29.1 --activate

FROM base AS dependencies

# Copy manifests first so dependency layers remain cached when source files change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/email-templates/package.json packages/email-templates/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json

# This layer is built before the benchmark and is never included in its timings.
# Lifecycle scripts run after copying the source because `nuxt prepare` needs it.
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM dependencies AS benchmark

ENV BENCHMARK_RUNTIME=docker \
    NUXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1

COPY . .
RUN pnpm rebuild && pnpm --filter=frontend run postinstall

ENTRYPOINT ["node", "scripts/benchmark-builds.mjs"]
CMD ["--runs", "3"]
