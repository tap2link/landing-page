<script setup lang="ts">
// html lang, canonical and hreflang alternates per locale (needs i18n.baseUrl in nuxt.config)
const head = useLocaleHead({ seo: true, lang: true, dir: false })
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang ?? 'en' },
  link: head.value.link ?? [],
  meta: head.value.meta ?? []
}))
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
