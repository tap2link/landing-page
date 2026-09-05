<script setup lang="ts">
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
</script>

<template>
  <div>
    <HomeHero />
    <AppStoreCards />
    <PartnerLogos />
    <FeatureCards message-key="home.features" :icons="featureIcons" centered />
    <HomeUseCases />
    <ShopCards />
    <CtaBanner :title="t('home.cta.title')" :text="t('home.cta.text')" icon-dark="/images/icons/service.png" icon-light="/images/icons/nfc-white.png" />
  </div>
</template>
