# ParcourTime

Independent calendar of the Parcoursup campaign, at [parcourtime.wissem.pro](https://parcourtime.wissem.pro).

[![CI](https://ci.wissem.pro/api/badges/7/status.svg)](https://ci.wissem.pro/repos/7)
[![Release](https://img.shields.io/github/v/release/Wissem-Industries/parcourtime?sort=semver)](https://github.com/Wissem-Industries/parcourtime/releases)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Shows the current phase, the next deadline with a countdown, and every phase of a campaign in order. Campaigns from several years can be compared and shared by URL. The interface is in French and uses the French government design system (DSFR).

ParcourTime is not affiliated with Parcoursup or the Ministry of Higher Education. Dates of a future campaign are estimates until they are published, and are shown as such.

## Development

Requires Bun 1.4.

```bash
bun install
bun run dev     # http://localhost:3000
bun run check   # lint, unit tests, typecheck, build
```

## Campaign data

Campaigns live in [`app/data/parcoursup/campaigns.json`](app/data/parcoursup/campaigns.json). See [docs/update-campaign.md](docs/update-campaign.md) for the yearly update.

## Release

Versions follow Semantic Versioning and changes are listed in [CHANGELOG.md](CHANGELOG.md).

```bash
bun run release 1.1.0   # updates package.json and the changelog
```

Merge the release pull request, then push the `v1.1.0` tag. The pipeline checks the tag, publishes `ghcr.io/wissem-industries/parcourtime`, deploys it on Dokploy and creates the GitHub release.

## License

[MIT](LICENSE)
