# ParcourTime

<div align="center">

![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

**[🔗 Démo en ligne](https://parcourtime.wissem.pro)**

</div>

## À propos

Application web de compte à rebours en temps réel pour Parcoursup 2026. ParcourTime affiche le temps restant jusqu'aux résultats d'admission et suit toutes les dates importantes du processus de candidature dans l'enseignement supérieur français.

L'application propose un indicateur de progression circulaire montrant l'avancement dans l'année académique, accompagné de compteurs détaillés pour les prochaines échéances.

## Fonctionnalités

- Compte à rebours en temps réel avec précision à la milliseconde
- Indicateur circulaire de progression annuelle
- Timeline complète des phases Parcoursup
- Design responsive optimisé mobile et desktop
- Optimisation SEO avec métadonnées Open Graph et Twitter Card
- Animation de confettis lors des franchissements d'étapes
- Accessibilité renforcée avec labels ARIA et HTML sémantique

## Stack technique

- **Framework** : Nuxt 4
- **Frontend** : Vue 3 avec Composition API
- **Styling** : TailwindCSS
- **Typographie** : Police Marianne (typographie officielle de l'État français)
- **Animation** : canvas-confetti
- **Package Manager** : Bun
- **Déploiement** : Serveur Node avec compression et pré-rendu

## Installation

```bash
# Installer les dépendances
bun install
```

## Développement

```bash
# Démarrer le serveur de développement sur http://localhost:3000
bun run dev
```

## Production

```bash
# Compiler l'application
bun run build

# Prévisualiser le build de production
bun run preview
```

## Structure du projet

```
app/
├── app.vue                 # Point d'entrée principal
├── components/
│   └── counter.vue         # Compteur et cercle de progression
├── composables/
│   └── useDates.ts         # Configuration du calendrier Parcoursup
└── utils/
    └── confetti.ts         # Effets de célébration
```

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

**Wissem** - [WissemBad](https://github.com/WissemBad)
