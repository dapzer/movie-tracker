FROM node:21-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

FROM base AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=backend --docker


FROM base as installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY tsconfig.json tsconfig.json
COPY turbo.json turbo.json

RUN turbo run build --filter=backend

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 backend
RUN adduser --system --uid 1001 backend

USER backend
COPY --from=installer /app .

CMD ["pnpm", "--filter=backend", "run", "start:prod"]
