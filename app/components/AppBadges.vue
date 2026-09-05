<script setup lang="ts">
// App Store / Google Play badges (the white outline versions from the old footer, or the dark
// Google Play one for light backgrounds). Links are the store URLs from the live site.
import { LINKS } from '~/data/links'

withDefaults(defineProps<{ variant?: 'white' | 'dark' }>(), { variant: 'white' })
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <a :href="LINKS.appStore" target="_blank" rel="noopener" class="inline-flex" :aria-label="t('common.downloadAppStore')">
      <img src="/images/badges/app-store-white.png" :alt="t('common.appStoreAlt')" width="222" height="75" class="h-10 w-auto" :class="variant === 'dark' ? 'invert' : ''" loading="lazy" decoding="async" />
    </a>
    <a :href="LINKS.googlePlay" target="_blank" rel="noopener" class="inline-flex" :aria-label="t('common.downloadGooglePlay')">
      <img :src="variant === 'dark' ? '/images/badges/google-play-dark.png' : '/images/badges/google-play-white.png'" :alt="t('common.googlePlayAlt')" width="222" height="75" class="h-10 w-auto" loading="lazy" decoding="async" />
    </a>
  </div>
</template>
