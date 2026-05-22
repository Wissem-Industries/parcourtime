# syntax=docker/dockerfile:1.7
ARG BUN_IMAGE=oven/bun:latest

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
WORKDIR /application

COPY --from=build /application/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]