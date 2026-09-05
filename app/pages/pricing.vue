<script setup lang="ts">
const { t } = useI18n()
usePageSeo({ title: t('seo.pricing.title'), description: t('seo.pricing.description'), fullTitle: true })
</script>

<template>
  <div>
    <PageHero :title="`${t('pricing.title1')} ${t('pricing.title2')}`" :text="t('pricing.text')">
      <template #title>
        {{ t('pricing.title1') }}<br />
        <span class="text-brand-500">{{ t('pricing.title2') }}</span>
      </template>
    </PageHero>
    <PricingTable />
    <DesignWorkshop />
    <CtaBanner :title="t('pricing.cta.title')" :text="t('pricing.cta.text')" icon-dark="/images/icons/search.png" icon-light="/images/icons/money-white.png" />
  </div>
</template>
