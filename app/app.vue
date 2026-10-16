<script setup lang="ts">
// html lang, canonical and hreflang alternates per locale (needs i18n.baseUrl in nuxt.config)
const head = useLocaleHead({ seo: true, lang: true, dir: false })
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang ?? 'en' },
  link: head.value.link ?? [],
  meta: head.value.meta ?? []
}))

// Takes over from `nuxt.config.ts`'s pre-paint inline script once Vue has hydrated: reads the
// `t2l-color-mode` cookie / OS preference and keeps `<html data-color-mode>` in sync with
// AppHeader.vue's toggle (see composables/useColorMode.ts).
useColorMode()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
