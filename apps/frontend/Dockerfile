FROM node:21-alpine AS base
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
ARG SENTRY_AUTH_TOKEN

ENV VITE_BASE_URL $VITE_BASE_URL
ENV VITE_API_LOCAL_URL $VITE_API_LOCAL_URL
ENV VITE_API_URL $VITE_API_URL
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN

RUN turbo run build --filter=frontend

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontend

USER frontend
COPY --from=installer /app .

ENV NODE_ENV production

CMD ["node", "--import", "./apps/frontend/.output/server/sentry.server.config.mjs", "./apps/frontend/.output/server/index.mjs"]
