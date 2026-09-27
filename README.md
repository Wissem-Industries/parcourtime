# ParcourTime

<p align="center">
  <strong>A clear, accessible Parcoursup calendar.</strong><br />
  Follow application phases, upcoming deadlines and campaign progress.
</p>

<p align="center">
  <a href="https://ci.wissem.pro/repos/7"><img alt="Woodpecker CI" src="https://ci.wissem.pro/api/badges/7/status.svg" /></a>
  <a href="https://github.com/Wissem-Industries/ParcourTime/releases"><img alt="Latest version" src="https://img.shields.io/github/v/tag/Wissem-Industries/ParcourTime?sort=semver&label=version" /></a>
  <a href="https://ghcr.io/wissem-industries/parcourtime"><img alt="Production image on GHCR" src="https://img.shields.io/badge/GHCR-production-2496ED?logo=docker&logoColor=white" /></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/Wissem-Industries/ParcourTime" /></a>
</p>

<p align="center">
  <img alt="Nuxt 4" src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white" />
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white" />
  <img alt="Bun 1.4" src="https://img.shields.io/badge/Bun-1.4-FBF0DF?logo=bun&logoColor=000" />
  <img alt="Biome 2" src="https://img.shields.io/badge/Biome-2-60A5FA?logo=biome&logoColor=white" />
</p>

ParcourTime is an independent calendar maintained by **Wissem’s Industries**.
It is not affiliated with Parcoursup or the French Ministry of Higher Education.
Dates for a future campaign remain estimates until official publication and are
marked as such. Always confirm official dates before taking action.

## Features

- Select a campaign and share it through the URL.
- See the current phase, next deadline, countdown and overall progress.
- Browse past, current and upcoming phases in chronological order.
- Compare versioned campaigns from different years.
- Use the French-language interface on mobile or with a keyboard.

## Technology

Nuxt 4 · Vue 3 · TypeScript · DSFR · VueDsfr · Bun 1.4 · Biome 2 · Vitest

## Development

Requirements: [Bun 1.4 or later](https://bun.sh/).

```sh
git clone https://github.com/Wissem-Industries/ParcourTime.git
cd ParcourTime
bun install --frozen-lockfile
bun run dev
```

The application is available at `http://localhost:3000`.

## Quality checks

```sh
bun run check
```

This runs Biome, unit tests, TypeScript checks and a production build.

## Campaign data

Campaign calendars are versioned in
[`app/data/parcoursup/campaigns.json`](app/data/parcoursup/campaigns.json).
See [`docs/update-campaign.md`](docs/update-campaign.md) for the annual update
process.

## Production

Woodpecker checks pushes and pull requests. A `v*` tag that matches
`package.json.version` runs the release checks, publishes the versioned image and
`latest` to `ghcr.io/wissem-industries/parcourtime`, then triggers Dokploy and
creates a GitHub Release. The production container listens on port `3000`.
Confirm the Dokploy service points at the published image before releasing.

```sh
docker compose up --build -d
```

## License

MIT. See [LICENSE](LICENSE).