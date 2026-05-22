# Mettre à jour une campagne Parcoursup

Les dates Parcoursup changent chaque année. ParcourTime les garde dans une source JSON unique :

`app/data/parcoursup/campaigns.json`

## Règles

- Utiliser en priorité `parcoursup.gouv.fr`, le ministère ou un document institutionnel.
- Ne pas inventer de date. Si une date n’est pas publiée, utiliser `certainty: 'to_confirm'` et ne pas renseigner
  `start`, `end` ou `date`.
- Renseigner les dates en ISO avec offset Europe/Paris, par exemple `2026-03-12T23:59:59+01:00`.
- Ajouter les sources dans `sources`, puis référencer leurs identifiants dans `sourceIds`.
- Mettre à jour `lastUpdated` avec la date de vérification.
- Ne pas modifier `campaigns.ts` pour ajouter une campagne : il sert seulement d’adaptateur typé.

## Ajouter une nouvelle campagne

1. Dupliquer la structure d’une campagne existante dans `campaigns`.
2. Changer `id`, `label`, `lastUpdated` et les sources.
3. Remplir les phases dont les dates sont officiellement publiées.
4. Laisser les phases non publiées en `to_confirm`.
5. Lancer les vérifications :

```bash
bun run test
bun run typecheck
bun run lint
bun run build
```

L’interface lit automatiquement la liste des campagnes. Aucun composant UI ne doit être modifié pour ajouter une
campagne.
