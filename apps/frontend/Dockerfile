FROM node:22.18.0-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update

FROM base AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=frontend --docker

FROM base as installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
COPY tsconfig.json tsconfig.json
COPY turbo.json turbo.json

WORKDIR /app/apps/frontend

RUN pnpm install

ARG VITE_BASE_URL
ARG VITE_API_LOCAL_URL
ARG VITE_API_URL
ARG NUXT_PUBLIC_SENTRY_DSN

ENV VITE_BASE_URL $VITE_BASE_URL
ENV VITE_API_LOCAL_URL $VITE_API_LOCAL_URL
ENV VITE_API_URL $VITE_API_URL
ENV NUXT_PUBLIC_SENTRY_DSN $NUXT_PUBLIC_SENTRY_DSN

RUN turbo run build --filter=frontend

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontend

USER frontend
COPY --from=installer /app/apps/frontend/.output .

ENV NODE_ENV production

CMD ["node", "--import", "./server/sentry.server.config.mjs", "./server/index.mjs"]
