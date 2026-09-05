<script setup lang="ts">
// "Your personal digital assistant one tap away" + the two big app-store cards.
import { LINKS } from '~/data/links'

const { t } = useI18n()
</script>

<template>
  <section class="container-page py-16 sm:py-24">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div class="flex items-start justify-between gap-6">
        <h2 class="max-w-md text-4xl font-semibold leading-[1.05] sm:text-5xl">{{ t('home.assistant.title') }}</h2>
        <div class="hidden shrink-0 gap-2 sm:flex">
          <span class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy">
            <img src="/images/icons/nfc-white.png" alt="" width="80" height="80" class="h-7 w-7" loading="lazy" decoding="async" />
          </span>
          <span class="inline-flex h-14 w-14 items-center justify-center rounded-full border border-navy bg-white">
            <img src="/images/icons/employee-card.png" alt="" width="80" height="80" class="h-7 w-7" loading="lazy" decoding="async" />
          </span>
        </div>
      </div>
      <div>
        <span class="eyebrow">{{ t('common.whatWeOffer') }}</span>
        <p class="mt-4 text-sm leading-relaxed text-ink/80">{{ t('home.assistant.text') }}</p>
      </div>
    </div>

    <div class="mt-10 grid gap-5 sm:grid-cols-2">
      <a :href="LINKS.appStore" target="_blank" rel="noopener" class="group flex min-h-[240px] flex-col justify-between rounded-3xl bg-navy p-8 text-white transition hover:bg-ink">
        <h3 class="max-w-xs font-sans text-3xl font-semibold text-white sm:text-4xl">{{ t('common.downloadAppStore') }}</h3>
        <div class="mt-8 flex items-end justify-between">
          <img src="/images/badges/app-store-white.png" :alt="t('common.appStoreAlt')" width="222" height="75" class="h-10 w-auto" loading="lazy" decoding="async" />
          <svg class="h-16 w-16 text-white/20 transition group-hover:text-white/40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.66c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.45 2.09-1.47 2.55-.38 6.33 1.06 8.4.7 1.01 1.53 2.15 2.62 2.11 1.05-.04 1.45-.68 2.72-.68s1.63.68 2.74.66c1.13-.02 1.85-1.03 2.54-2.05.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.2-3.4zM14.3 6.5c.58-.7.97-1.68.86-2.65-.83.03-1.85.56-2.45 1.25-.54.62-1.01 1.62-.88 2.57.93.07 1.88-.47 2.47-1.17z" /></svg>
        </div>
      </a>
      <a :href="LINKS.googlePlay" target="_blank" rel="noopener" class="group flex min-h-[240px] flex-col justify-between rounded-3xl bg-brand-100 p-8 text-navy transition hover:bg-brand-200">
        <h3 class="max-w-xs font-sans text-3xl font-semibold sm:text-4xl">{{ t('common.downloadGooglePlay') }}</h3>
        <div class="mt-8 flex items-end justify-between">
          <img src="/images/badges/google-play-dark.png" :alt="t('common.googlePlayAlt')" width="222" height="75" class="h-10 w-auto" loading="lazy" decoding="async" />
          <svg class="h-16 w-16 text-navy/15 transition group-hover:text-navy/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 001 18h22a10.81 10.81 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" /></svg>
        </div>
      </a>
    </div>
  </section>
</template>
