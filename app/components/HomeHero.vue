<script setup lang="ts">
// Home hero: full-width photo with the tagline bottom-left, the paragraph on the right and the
// huge "tap2link" wordmark across the bottom, followed by the row of use-case pills. The old
// site layered a Lottie animation over the photo; that is not reproduced.
const { t, tm, rt } = useI18n()
const bullets = computed(() => tm('home.hero.bullets') as string[])
</script>

<template>
  <section class="container-page pt-2">
    <div class="relative overflow-hidden rounded-[2rem] bg-navy text-white">
      <img
        src="/images/hero/main-cover.jpg"
        :alt="t('home.hero.imageAlt')"
        width="1900"
        height="1188"
        class="h-[80vh] max-h-[860px] min-h-[540px] w-full object-cover object-[65%_20%]"
        fetchpriority="high"
        decoding="async"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
      <div class="absolute inset-x-0 bottom-0 px-6 pb-4 sm:px-10 lg:px-14">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 class="max-w-xs font-sans text-3xl font-semibold leading-tight text-white sm:text-4xl">{{ t('home.hero.tagline') }}</h2>
          <p class="max-w-xs text-sm text-white/85 lg:text-right">{{ t('home.hero.text') }}</p>
        </div>
        <h1 class="mt-4 -mb-[0.16em] select-none font-sans text-[22vw] font-bold leading-none tracking-[-0.04em] text-white lg:text-[13.5rem]">
          {{ t('home.hero.wordmark') }}
        </h1>
      </div>
    </div>

    <ul class="mt-6 flex flex-wrap gap-2.5">
      <li v-for="(b, i) in bullets" :key="i" class="inline-flex items-center gap-2 rounded-full border border-navy bg-white px-4 py-2 font-sans text-sm font-semibold text-navy">
        <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy">
          <img src="/images/icons/plus-white.png" alt="" width="40" height="40" class="h-2.5 w-2.5" />
        </span>
        {{ rt(b) }}
      </li>
    </ul>
  </section>
</template>
