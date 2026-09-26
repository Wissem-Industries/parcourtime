# ParcourTime

<p align="center">
  <strong>Le calendrier Parcoursup, clair et à jour.</strong><br />
  Consultez les étapes de la campagne, les prochaines échéances et l’avancement du calendrier en un coup d’œil.
</p>

<p align="center">
  <a href="https://ci.wissem.pro/repos/4"><img alt="Woodpecker CI" src="https://ci.wissem.pro/api/badges/4/status.svg" /></a>
  <a href="https://github.com/WissemBad/ParcourTime/releases"><img alt="Dernière version" src="https://img.shields.io/github/v/tag/WissemBad/ParcourTime?sort=semver&label=version" /></a>
  <a href="https://ghcr.io/wissem-industries/parcourtime"><img alt="Image de production GHCR" src="https://img.shields.io/badge/GHCR-production-2496ED?logo=docker&logoColor=white" /></a>
  <a href="LICENSE"><img alt="Licence MIT" src="https://img.shields.io/github/license/WissemBad/ParcourTime" /></a>
</p>

<p align="center">
  <img alt="Nuxt 4" src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white" />
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white" />
  <img alt="Bun 1.4" src="https://img.shields.io/badge/Bun-1.4-FBF0DF?logo=bun&logoColor=000" />
  <img alt="Biome" src="https://img.shields.io/badge/Biome-2-60A5FA?logo=biome&logoColor=white" />
</p>

ParcourTime est un projet de **Wissem’s Industries**. Le service est indépendant et non affilié à Parcoursup ni au ministère de l’Enseignement supérieur.

> Les dates d’une campagne à venir peuvent être estimées tant que le calendrier officiel n’est pas publié. Elles sont alors signalées comme prévisionnelles dans l’application. Vérifiez toujours les dates officielles avant d’effectuer une démarche.

## Fonctionnalités

- La campagne la plus récente est sélectionnée par défaut et reste partageable dans l’URL.
- La phase en cours, la prochaine échéance et un compte à rebours lisible.
- La progression globale du calendrier, y compris avant son ouverture.
- Une vue chronologique des phases passées, en cours et à venir.
- Des campagnes versionnées pour comparer les calendriers d’une année à l’autre.
- Une interface française adaptée au mobile et accessible au clavier.

## Technologies

Nuxt 4 · Vue 3 · TypeScript · DSFR · VueDsfr · Bun · Biome · Vitest

## Développement

Prérequis : [Bun 1.4 ou plus récent](https://bun.sh/).

```bash
git clone https://github.com/WissemBad/ParcourTime.git
cd ParcourTime
bun install --frozen-lockfile
bun run dev
```

L’application est disponible sur `http://localhost:3000`.

## Contrôles qualité

```bash
bun run check
```

Cette commande exécute Biome, les tests unitaires, la vérification TypeScript et le build de production.

## Calendriers de campagne

Les calendriers sont versionnés dans [`app/data/parcoursup/campaigns.json`](app/data/parcoursup/campaigns.json). Les dates estimées sont marquées comme telles et peuvent être révisées lorsque le calendrier officiel est publié.

Le guide de mise à jour annuelle se trouve dans [`docs/update-campaign.md`](docs/update-campaign.md).

## Production

L’application est construite avec Docker et publiée dans le registre GitHub Container Registry :

```text
ghcr.io/wissem-industries/parcourtime:latest
```

Les tags de version (`v1.0.0`, par exemple) déclenchent le pipeline Woodpecker : contrôles qualité, publication de l’image versionnée et mise à jour de `latest`, puis déploiement de production via Dokploy.

Pour lancer le conteneur localement :

```bash
docker compose up --build -d
```

L’application écoute sur le port `3000`.

## Licence

ParcourTime est distribué sous licence [MIT](LICENSE).
