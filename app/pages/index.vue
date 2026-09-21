<script setup lang="ts">
// The home page is the only page whose header floats over the hero photo (the original does the
// same); the layout reads this flag and switches AppHeader into its transparent overlay variant.
definePageMeta({ headerOverlay: true })

const { t } = useI18n()
usePageSeo({ title: t('seo.home.title'), description: t('seo.home.description'), fullTitle: true })

const featureIcons = [
  '/images/icons/connection.png',
  '/images/icons/ball.png',
  '/images/icons/leaf.png',
  '/images/icons/profiles.png',
  '/images/icons/calendar.png',
  '/images/icons/wallet.png'
]

// The home banner sets its heading with three pills between the words, like the original. The
// original's first two pills are team portraits; those are not ours to ship (see the task report),
// so all three are tap2link's own icons for now. The positions are counted from the end of the
// title so that the longer German heading places them the same way.
const ctaPills = computed(() => {
  const last = t('home.cta.title').split(/\s+/).filter(Boolean).length - 1
  return [
    { src: '/images/icons/nfc-white.png', after: last - 2, variant: 'dark' as const },
    { src: '/images/icons/profiles.png', after: last - 1, variant: 'light' as const },
    { src: '/images/icons/service.png', after: last - 1, variant: 'light' as const }
  ]
})
</script>

<template>
  <div>
    <HomeHero />
    <AppStoreCards />
    <PartnerLogos />
    <FeatureCards message-key="home.features" :icons="featureIcons" centered />
    <HomeUseCases />
    <ShopCards />
    <CtaBanner :title="t('home.cta.title')" :text="t('home.cta.text')" :pills="ctaPills" />
  </div>
</template>
