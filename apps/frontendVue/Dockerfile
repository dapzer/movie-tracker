
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update

FROM base AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=frontendVue --docker

FROM base as installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
COPY tsconfig.json tsconfig.json
COPY turbo.json turbo.json

WORKDIR /app/apps/frontendVue

RUN pnpm install

RUN turbo run build --filter=frontendVue

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontend

USER frontend
COPY --from=installer /app .

CMD ["node", "apps/frontendVue/.output/server/index.mjs"]
