FROM node:alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat && \
    npm i -g pnpm@8

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler && \
    npm i -g pnpm@8


RUN doppler run --command="pnpm prisma:generate"
RUN doppler run --command="pnpm build"
RUN doppler run --command="pnpm postbuild"

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 frontend

COPY --from=builder /app/public ./public

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

COPY docker-entrypoint.sh /app

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]

RUN mkdir .next
RUN chown frontend:nodejs .next

COPY --from=builder --chown=frontend:nodejs /app/.next/standalone ./
COPY --from=builder --chown=frontend:nodejs /app/.next/static ./.next/static

USER frontend

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
