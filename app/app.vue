<template>
  <div>
    <NuxtRouteAnnouncer />
    <Counter />
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useHead({
  title: 'Parcoursup - Compte à rebours 2026',
  meta: [
    { name: 'description', content: 'Compte à rebours en temps réel avant les résultats Parcoursup 2026. Suivez toutes les étapes importantes de votre inscription dans l\'enseignement supérieur.' },
    { name: 'keywords', content: 'Parcoursup, compte à rebours, résultats 2026, admission, enseignement supérieur, France, calendrier' },
    { name: 'author', content: 'Wissem' },
    { property: 'og:title', content: 'Parcoursup - Compte à rebours 2026' },
    { property: 'og:description', content: 'Compte à rebours en temps réel avant les résultats Parcoursup.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/Parcoursup_Banner.jpg' },
    { property: 'og:url', content: 'https://parcourtime.wissem.pro' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Parcoursup - Compte à rebours 2026' },
    { name: 'twitter:description', content: 'Compte à rebours en temps réel avant les résultats Parcoursup.' },
    { name: 'twitter:image', content: '/Parcoursup_Banner.jpg' },
    { name: 'theme-color', content: '#000091' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://parcourtime.wissem.pro' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})
</script>
