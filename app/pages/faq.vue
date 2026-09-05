<script setup lang="ts">
const { t } = useI18n()
usePageSeo({ title: t('seo.faq.title'), description: t('seo.faq.description'), fullTitle: true })
</script>

<template>
  <div>
    <PageHero :title="t('faq.title')" :text="t('faq.text')" />
    <section class="container-page py-10">
      <FaqAccordion />
    </section>
    <CtaBanner :title="t('faq.cta.title')" :text="t('faq.cta.text')" icon-dark="/images/icons/search.png" />
  </div>
</template>
