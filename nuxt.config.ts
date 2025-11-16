// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Parcoursup Countdown - Compte à rebours 2026',
      meta: [
        { name: 'description', content: 'Compte à rebours en temps réel avant les résultats Parcoursup 2026. Suivez toutes les étapes importantes.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },

  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  experimental: {
    payloadExtraction: false
  }
})