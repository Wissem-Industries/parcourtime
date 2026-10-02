# ParcourTime — consignes de projet

ParcourTime est un calendrier indépendant pour suivre les phases et échéances Parcoursup. Il n’est affilié ni à Parcoursup ni au ministère de l’Enseignement supérieur.

## Produit et invariants

- Conserver le DSFR et VueDsfr : ce sont des choix d’identité et d’accessibilité du service; Wissem UI ne les remplace pas automatiquement.
- Les campagnes sont versionnées dans `app/data/parcoursup/campaigns.json`. Suivre [`docs/update-campaign.md`](docs/update-campaign.md) pour les mises à jour annuelles.
- Les dates d’une campagne future restent des estimations jusqu’à publication officielle; les signaler comme telles et ne pas les présenter comme certaines.
- L’image de partage `public/og.png` est générée par `bun run images:og` à partir de la campagne la plus récente ; la relancer à chaque mise à jour de `campaigns.json`. Pas de logo ni de visuel Parcoursup dessus.
- L’interface vise une utilisation mobile, au clavier et en français. Préserver les liens partageables, le choix de campagne et la navigation chronologique.
- Versions : SemVer, CHANGELOG tenu à chaque PR (section `Unreleased`), montée par `bun run release <x.y.z>`. Woodpecker valide push et PR ; le tag `vX.Y.Z` publie l’image GHCR et déclenche le webhook Dokploy.

## Stack et commandes

- Nuxt 4, Vue 3, TypeScript, Bun 1.4.x, Biome 2, Vitest et DSFR. Installer avec `bun install --frozen-lockfile`.
- `bun run check` exécute lint, tests, typecheck et build. Utiliser les scripts existants plutôt que d’inventer une commande parallèle.
- Respecter les conventions communes de Wissem's Industries, notamment Alpine/Bun dans CI et les consignes de secrets.
- Mettre à jour ce fichier automatiquement pour toute règle durable propre à ParcourTime; reporter les règles partagées au dépôt central.
