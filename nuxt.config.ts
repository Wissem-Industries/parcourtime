import campaigns from './app/data/parcoursup/campaigns.json'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-22',
  devtools: { enabled: false },

  css: [
    '@gouvfr/dsfr/dist/core/core.main.min.css',
    '@gouvfr/dsfr/dist/utility/utility.main.min.css',
    '@gouvfr/dsfr/dist/scheme/scheme.min.css',
    '@gouvfr/dsfr/dist/component/alert/alert.main.min.css',
    '@gouvfr/dsfr/dist/component/badge/badge.main.min.css',
    '@gouvfr/dsfr/dist/component/button/button.main.min.css',
    '@gouvfr/dsfr/dist/component/callout/callout.main.min.css',
    '@gouvfr/dsfr/dist/component/card/card.main.min.css',
    '@gouvfr/dsfr/dist/component/footer/footer.main.min.css',
    '@gouvfr/dsfr/dist/component/form/form.main.min.css',
    '@gouvfr/dsfr/dist/component/header/header.main.min.css',
    '@gouvfr/dsfr/dist/component/link/link.main.min.css',
    '@gouvfr/dsfr/dist/component/logo/logo.main.min.css',
    '@gouvfr/dsfr/dist/component/select/select.main.min.css',
    '~/assets/css/main.css',
  ],
  modules: ['@nuxtjs/plausible'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  typescript: {
    strict: true,
    // Types are checked by `bun run typecheck` (Golar) before the build.
    typeCheck: false,
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [{ name: 'theme-color', content: '#000091' }],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://parcourtime.wissem.pro/' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },

  // Nuxt inlines its payload and bootstrap scripts, hence 'unsafe-inline' for scripts; DSFR and Vue also set inline styles.
  routeRules: {
    '/**': {
      headers: {
        'content-security-policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
        ].join('; '),
        'strict-transport-security': 'max-age=31536000',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      },
    },
  },

  nitro: {
    preset: 'bun',
    prerender: {
      routes: ['/', '/sitemap.xml', ...campaigns.map((campaign) => `/agenda/${campaign.id}.ics`)],
      crawlLinks: true,
    },
  },

  // Events go through /_w/api/event on this origin (a neutral path content blockers do not list), then to the self-hosted instance.
  plausible: { apiHost: 'https://analytics.wissem.pro', proxy: true, proxyBaseEndpoint: '/_w' },
})
