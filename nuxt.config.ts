import tailwindcss from '@tailwindcss/vite'

// The marketing site's own public host. It lives on its own host, separate from the app
// (https://t2l.ink, see APP_BASE_URL in app/data/links.ts). Declared once here and used for every
// place that states the site's URL: the sitemap, the canonical/hreflang tags and og:url.
// public/robots.txt carries the same host as a literal - it is a static file and cannot import it.
const SITE_URL = 'https://land.t2l.ink'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  // Public site identity: used by @nuxtjs/sitemap (absolute URLs), by usePageSeo (canonical/OG
  // URLs) and by @nuxtjs/i18n (hreflang alternates via i18n.baseUrl below).
  site: {
    url: SITE_URL,
    name: 'tap2link'
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL
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
    baseUrl: SITE_URL
  },

  app: {
    head: {
      // lang, canonical and hreflang alternates come per locale from useLocaleHead() in app.vue
      titleTemplate: '%s · tap2link',
      link: [
        // the tap2link mark from the previous site: 32x32 favicon + 256x256 web clip
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
        { rel: 'apple-touch-icon', sizes: '256x256', href: '/apple-touch-icon.png' },
        // Brand fonts, same Google Fonts families the previous site loaded: Inter (headings, UI) and
        // Nunito Sans (body copy). Google Fonts is the only third-party resource on the site.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
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
