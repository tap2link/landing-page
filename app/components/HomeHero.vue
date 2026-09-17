<script setup lang="ts">
// Home hero, matched to the original: a full-bleed photo running under the floating header, the
// sub-line and the huge "tap2link" wordmark over its bottom edge (plus the tagline on the left at
// desktop), then a light-grey band carrying the use-case chips - big outlined cards under a
// repeated tagline on phones, a row of pills at desktop. The old site layered a Lottie animation
// over the photo; that is not reproduced.
const { t, tm, rt } = useI18n()
const bullets = computed(() => tm('home.hero.bullets') as string[])
</script>

<template>
  <section class="bg-band">
    <!-- full-bleed, square-cornered photo: a sibling of the container, not a child of it -->
    <div class="relative w-full overflow-hidden">
      <img
        src="/images/hero/main-cover.jpg"
        :alt="t('home.hero.imageAlt')"
        width="1900"
        height="1188"
        class="h-[100svh] max-h-[900px] min-h-[34rem] w-full object-cover object-[62%_12%]"
        fetchpriority="high"
        decoding="async"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-navy/25 via-transparent to-navy/70" />
      <div class="absolute inset-x-0 bottom-0">
        <div class="container-page pb-[0.9vw]">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h2 class="hidden max-w-[8.5em] text-5xl font-semibold text-white lg:block">{{ t('home.hero.tagline') }}</h2>
            <p class="max-w-[26em] text-base text-white lg:max-w-[17em]">{{ t('home.hero.text') }}</p>
          </div>
          <!-- the wordmark is sized from this box (container query units), never from the viewport -->
          <div class="wordmark-box mt-[0.35em]">
            <h1 class="wordmark text-center font-sans text-white">{{ t('home.hero.wordmark') }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="container-page py-12 lg:py-20">
      <h2 class="mb-8 max-w-[9em] text-5xl font-semibold lg:hidden">{{ t('home.hero.tagline') }}</h2>
      <ul class="grid gap-4 lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-4">
        <li
          v-for="(b, i) in bullets"
          :key="i"
          class="flex flex-col items-start gap-3 rounded-[2.25rem] border-2 border-navy bg-white p-6 font-sans text-base font-semibold text-navy lg:flex-row lg:items-center lg:rounded-full lg:py-3 lg:pl-3 lg:pr-6"
        >
          <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
            <img src="/images/icons/plus-white.png" alt="" width="40" height="40" class="h-5 w-5" />
          </span>
          {{ rt(b) }}
        </li>
      </ul>
    </div>
  </section>
</template>
