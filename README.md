# ParcourTime

ParcourTime est une application Nuxt qui rend le calendrier Parcoursup plus lisible : phase actuelle, prochaine
échéance, compte à rebours et calendrier complet.

Projet de Wissem’s Industries, indépendant et non officiel. La campagne 2026-2027 est prévisionnelle ; vérifiez les échéances officielles avant toute démarche.

## Stack

- Nuxt 4
- Vue 3
- TypeScript strict
- DSFR officiel et VueDsfr
- Bun
- Biome pour le lint et le formatage
- Vitest pour la logique calendrier

## Lancer le projet

```bash
bun install
bun run dev
```

Le serveur de développement démarre par défaut sur `http://localhost:3000`.

## Vérifier la qualité

```bash
bun run test
bun run typecheck
bun run lint
bun run build
```

## Structure

```text
app/
  components/calendar/      Composants de countdown, timeline, statuts
  components/layout/        Header et footer
  composables/useCountdown  Timer client léger
  data/parcoursup/          Campagnes Parcoursup JSON + adaptateur typé
  pages/index.vue           Page principale
  types/parcoursup.ts       Types métier
  utils/calendar.ts         Logique testable hors composants
tests/unit/                 Tests Vitest
docs/update-campaign.md     Guide de mise à jour annuelle
```

## Mettre à jour les dates

Toutes les dates sont dans `app/data/parcoursup/campaigns.json`. Le fichier `campaigns.ts` ne fait qu’exposer ces
données avec les types de l’application.

Règles :

- qualifier explicitement chaque date comme officielle ou estimée ;
- ne jamais hardcoder une date dans un composant ;
- estimer la prochaine campagne à partir du rythme connu, puis la réviser lors de la publication officielle ;
- utiliser `certainty: 'to_confirm'` lorsqu’une date n’est pas publiée ;
- conserver les liens institutionnels pour les campagnes officielles ; ne pas afficher de source pour les estimations ;
- écrire les dates en ISO avec offset Europe/Paris.

Voir aussi `docs/update-campaign.md`.

## Sources actuelles

- https://www.parcoursup.gouv.fr/calendrier
- https://www.parcoursup.gouv.fr/decouvrir-parcoursup/parcoursup-c-est-quoi-1061
- https://www.parcoursup.gouv.fr/contenus/tout-savoir-sur-la-phase-complementaire-3462
- https://www.parcoursup.gouv.fr/candidater-sur-parcoursup/fin-de-la-phase-d-admission-principale-3477

## Déploiement

```bash
bun run build
bun run preview
```

Le build Nuxt est configuré pour un preset Bun et pré-rend la page d’accueil.

## Docker

Construire et lancer l’image avec Docker Compose :

```bash
docker compose up --build -d
```

L’application écoute alors sur `http://localhost:3000`.

Arrêter le service :

```bash
docker compose down
```

## Licence

MIT. Voir `LICENSE`.
