<script setup lang="ts">
// The blue call-to-action banner that closes almost every page of the old site: big white
// heading with two small round "coin" icons inline, a paragraph and a white pill button.
const props = withDefaults(defineProps<{
  title: string
  text: string
  ctaLabel?: string
  ctaTo?: string
  /** icon shown in the light coin (dark artwork) */
  iconDark?: string
  /** icon shown in the dark coin (white artwork) */
  iconLight?: string
}>(), { ctaTo: '/contact' })

const { t } = useI18n()
const localePath = useLocalePath()
const label = computed(() => props.ctaLabel ?? t('common.contactUs'))
</script>

<template>
  <section class="container-page py-10 sm:py-14">
    <div class="rounded-[2rem] bg-brand-500 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
      <h2 class="mx-auto max-w-3xl font-sans text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
        <span v-if="iconDark" class="mr-3 inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-full bg-white align-middle shadow-[0_2px_0_0_#051822]">
          <img :src="iconDark" alt="" width="80" height="80" class="h-[55%] w-[55%]" loading="lazy" decoding="async" />
        </span>
        {{ title }}
        <span v-if="iconLight" class="ml-3 inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-full bg-navy align-middle">
          <img :src="iconLight" alt="" width="80" height="80" class="h-[55%] w-[55%]" loading="lazy" decoding="async" />
        </span>
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base text-white/85">{{ text }}</p>
      <NuxtLink :to="localePath(ctaTo)" class="btn-white mt-8">{{ label }}</NuxtLink>
    </div>
  </section>
</template>
