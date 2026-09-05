// One call per page: title, description, Open Graph and Twitter tags, canonical URL.
// The old Webflow site shipped a <title> and meta description per page (both are reproduced
// verbatim from there) but no Open Graph tags; those are added here. Titles get the " · tap2link"
// suffix from nuxt.config's titleTemplate unless `fullTitle` is set.
export interface PageSeo {
  title: string
  description: string
  /** use the title as-is, without the titleTemplate suffix */
  fullTitle?: boolean
  /** absolute or root-relative image; defaults to the shared OG image */
  image?: string
  type?: 'website' | 'article'
}

export function usePageSeo(seo: PageSeo) {
  const route = useRoute()
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string) || 'https://www.t2l.ink'
  const path = route.path.endsWith('/') && route.path !== '/' ? route.path.slice(0, -1) : route.path
  const url = `${siteUrl}${path}`
  const image = seo.image ? (seo.image.startsWith('http') ? seo.image : `${siteUrl}${seo.image}`) : `${siteUrl}/images/og-image.jpg`

  useSeoMeta({
    title: seo.title,
    titleTemplate: seo.fullTitle ? '%s' : undefined,
    description: seo.description,
    ogTitle: seo.fullTitle ? seo.title : `${seo.title} · tap2link`,
    ogDescription: seo.description,
    ogType: seo.type ?? 'website',
    ogUrl: url,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogSiteName: 'tap2link',
    ogLocale: locale.value === 'de' ? 'de_DE' : 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: seo.fullTitle ? seo.title : `${seo.title} · tap2link`,
    twitterDescription: seo.description,
    twitterImage: image
  })
}
