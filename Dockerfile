# syntax=docker/dockerfile:1.7
ARG BUN_IMAGE=oven/bun:1.4.2-alpine

# ---------- Build base ----------
FROM ${BUN_IMAGE} AS base
WORKDIR /application

# ---------- Deps ----------
FROM base AS deps

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---------- Build ----------
FROM base AS build

COPY --from=deps /application/node_modules ./node_modules
COPY . .

RUN bun run build

# ---------- Runtime ----------
FROM ${BUN_IMAGE} AS production
ARG IMAGE_VERSION=unknown
WORKDIR /application

COPY --from=build --chown=bun:bun /application/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

USER bun
EXPOSE 3000
LABEL org.opencontainers.image.title="ParcourTime" \
      org.opencontainers.image.description="Independent Parcoursup calendar for application phases, deadlines and campaign progress" \
      org.opencontainers.image.source="https://github.com/Wissem-Industries/parcourtime" \
      org.opencontainers.image.url="https://parcourtime.wissem.pro" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version=$IMAGE_VERSION
CMD ["bun", ".output/server/index.mjs"]
