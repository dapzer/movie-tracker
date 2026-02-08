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

RUN turbo prune --scope=backend --docker

FROM turbo-base as installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --prefer-offline

FROM installer as builder
WORKDIR /app

COPY --from=pruner /app/out/full/ .
COPY tsconfig.json tsconfig.json
COPY turbo.json turbo.json

RUN turbo run build --filter=backend

FROM pnpm-base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app .

CMD ["pnpm", "--filter=backend", "run", "start:prod"]
