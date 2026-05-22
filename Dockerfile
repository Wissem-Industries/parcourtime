# syntax=docker/dockerfile:1.7
ARG BUN_IMAGE=oven/bun:1

FROM ${BUN_IMAGE} AS base
WORKDIR /application

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /application/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NITRO_PRESET=bun
ENV NUXT_TELEMETRY_DISABLED=1

RUN bunx nuxi build

FROM ${BUN_IMAGE} AS production
WORKDIR /application

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /application/.output ./.output

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]