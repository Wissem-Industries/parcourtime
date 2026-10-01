# ParcourTime — consignes de projet

ParcourTime est un calendrier indépendant pour suivre les phases et échéances Parcoursup. Il n’est affilié ni à Parcoursup ni au ministère de l’Enseignement supérieur.

## Produit et invariants

- Conserver le DSFR et VueDsfr : ce sont des choix d’identité et d’accessibilité du service; Wissem UI ne les remplace pas automatiquement.
- Les campagnes sont versionnées dans `app/data/parcoursup/campaigns.json`. Suivre [`docs/update-campaign.md`](docs/update-campaign.md) pour les mises à jour annuelles.
- Les dates d’une campagne future restent des estimations jusqu’à publication officielle; les signaler comme telles et ne pas les présenter comme certaines.
- L’interface vise une utilisation mobile, au clavier et en français. Préserver les liens partageables, le choix de campagne et la navigation chronologique.
- L’image de production est publiée sur GHCR. Woodpecker valide push/PR; les tags `v*` doivent correspondre à la version du paquet et déclenchent la publication et le webhook Dokploy.

## Stack et commandes

- Nuxt 4, Vue 3, TypeScript, Bun 1.4.x, Biome 2, Vitest et DSFR. Installer avec `bun install --frozen-lockfile`.
- `bun run check` exécute lint, tests, typecheck et build. Utiliser les scripts existants plutôt que d’inventer une commande parallèle.
- Respecter les conventions communes de Wissem's Industries, notamment Alpine/Bun dans CI et les consignes de secrets.
- Mettre à jour ce fichier automatiquement pour toute règle durable propre à ParcourTime; reporter les règles partagées au dépôt central.
