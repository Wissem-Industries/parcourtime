# Stage 1: Builder (Bun)
FROM oven/bun:latest AS builder
WORKDIR /app

# Dépendances
COPY package.json ./
RUN bun install

# Source + build
COPY . .
RUN bun run build

# Stage 2: Runner (Node)
FROM bun:latest AS runner
WORKDIR /app

# Copie du build
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/public /app/public

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

USER nuxtjs
EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
