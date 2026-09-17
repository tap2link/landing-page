import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  // Public site identity: used by @nuxtjs/sitemap (absolute URLs), by usePageSeo (canonical/OG
  // URLs) and by @nuxtjs/i18n (hreflang alternates via i18n.baseUrl below).
  site: {
    url: 'https://www.t2l.ink',
    name: 'tap2link'
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://www.t2l.ink'
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    lazy: true,
    detectBrowserLanguage: false,
    baseUrl: 'https://www.t2l.ink'
  },

  app: {
    head: {
      // lang, canonical and hreflang alternates come per locale from useLocaleHead() in app.vue
      titleTemplate: '%s · tap2link',
      link: [
        // the tap2link mark from the previous (Webflow) site: 32x32 favicon + 256x256 web clip
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', sizes: '256x256', href: '/apple-touch-icon.png' },
        // Brand font: Inter, the family the original site renders in, self-hosted from
        // public/fonts (SIL OFL). No runtime third-party font request; the @font-face rules live
        // in assets/css/main.css. The latin cut carries every page's copy, so it is preloaded.
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/inter-latin-var.woff2',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
})
