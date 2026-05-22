// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2026-05-22",
  devtools: { enabled: false },

    css: [
        "@gouvfr/dsfr/dist/core/core.main.min.css",
        "@gouvfr/dsfr/dist/utility/utility.main.min.css",
        "@gouvfr/dsfr/dist/scheme/scheme.min.css",
        "@gouvfr/dsfr/dist/component/alert/alert.main.min.css",
        "@gouvfr/dsfr/dist/component/badge/badge.main.min.css",
        "@gouvfr/dsfr/dist/component/button/button.main.min.css",
        "@gouvfr/dsfr/dist/component/callout/callout.main.min.css",
        "@gouvfr/dsfr/dist/component/card/card.main.min.css",
        "@gouvfr/dsfr/dist/component/footer/footer.main.min.css",
        "@gouvfr/dsfr/dist/component/form/form.main.min.css",
        "@gouvfr/dsfr/dist/component/header/header.main.min.css",
        "@gouvfr/dsfr/dist/component/link/link.main.min.css",
        "@gouvfr/dsfr/dist/component/logo/logo.main.min.css",
        "@gouvfr/dsfr/dist/component/select/select.main.min.css",
        "~/assets/css/main.css",
    ],
    modules: ["@nuxt/eslint", "@nuxtjs/plausible"],

    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],

    typescript: {
        strict: true,
        typeCheck: true,
    },

  app: {
    head: {
        charset: "utf-8",
        viewport: "width=device-width, initial-scale=1",
        title: "ParcourTime - Calendrier Parcoursup 2026",
      meta: [
          {
              name: "description",
              content:
                  "Suivez les échéances officielles Parcoursup 2026 avec un compte à rebours clair, sourcé et accessible.",
          },
          {name: "theme-color", content: "#000091"},
      ],
      link: [
          {rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
          {rel: "canonical", href: "https://parcourtime.wissem.pro"},
      ],
      htmlAttrs: {
          lang: "fr",
      },
    },
  },

  nitro: {
      preset: "node-server",
    prerender: {
        routes: ["/"],
        crawlLinks: true,
    },
      routeRules: {
          "/_plausible/**": {
              proxy: {to: "https://analytics.wissem.pro/**"},
          },
      },
  },

    plausible: {proxy: true},
});
