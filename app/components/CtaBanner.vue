<script setup lang="ts">
// The blue call-to-action banner that closes almost every page of the old site: big white
// heading with small round "coin" icons, a paragraph and a white pill button.
//
// Two shapes: by default one coin before and one after the title (every inner page). Pass
// `pills` and the title is set word by word with the pills sitting inline between the words,
// the way the home page's banner does it on the original.
interface CtaPill {
  /** icon or portrait to show inside the pill */
  src: string
  /** empty for a decorative icon */
  alt?: string
  /** index of the title word this pill follows (0-based) */
  after: number
  /** dark navy coin (white artwork) or white coin (dark artwork); `wide` for a portrait */
  variant?: 'dark' | 'light' | 'wide'
}

const props = withDefaults(defineProps<{
  title: string
  text: string
  ctaLabel?: string
  ctaTo?: string
  /** icon shown in the light coin (dark artwork) */
  iconDark?: string
  /** icon shown in the dark coin (white artwork) */
  iconLight?: string
  /** inline pills set between the title's words; replaces the two coins around the title */
  pills?: CtaPill[]
}>(), { ctaTo: '/contact' })

const { t } = useI18n()
const localePath = useLocalePath()
const label = computed(() => props.ctaLabel ?? t('common.contactUs'))
const words = computed(() => props.title.split(/\s+/).filter(Boolean))
const pillsAfter = (i: number) => (props.pills ?? []).filter((p) => p.after === i)
</script>

<template>
  <section class="container-page py-10 sm:py-14">
    <div class="rounded-[2.25rem] bg-brand-500 px-6 py-20 text-center text-white sm:px-12 sm:py-[7.5rem]">
      <h2 v-if="pills?.length" class="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-[0.25em] gap-y-[0.1em] font-sans text-5xl font-medium text-white">
        <template v-for="(w, i) in words" :key="i">
          <span>{{ w }}</span>
          <span
            v-for="(p, n) in pillsAfter(i)"
            :key="`${i}-${n}`"
            class="inline-flex h-[1em] items-center justify-center overflow-hidden rounded-full"
            :class="[
              p.variant === 'dark' ? 'bg-navy' : p.variant === 'wide' ? 'w-[1.6em] bg-white' : 'border-2 border-navy bg-white',
              p.variant === 'wide' ? '' : 'w-[1em]'
            ]"
          >
            <img :src="p.src" :alt="p.alt ?? ''" width="80" height="80" :class="p.variant === 'wide' ? 'h-full w-full object-cover' : 'h-[55%] w-[55%]'" loading="lazy" decoding="async" />
          </span>
        </template>
      </h2>
      <h2 v-else class="mx-auto max-w-3xl font-sans text-5xl font-medium leading-tight text-white">
        <span v-if="iconDark" class="mr-3 inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-full bg-white align-middle shadow-[0_2px_0_0_#051822]">
          <img :src="iconDark" alt="" width="80" height="80" class="h-[55%] w-[55%]" loading="lazy" decoding="async" />
        </span>
        {{ title }}
        <span v-if="iconLight" class="ml-3 inline-flex h-[0.9em] w-[0.9em] items-center justify-center rounded-full bg-navy align-middle">
          <img :src="iconLight" alt="" width="80" height="80" class="h-[55%] w-[55%]" loading="lazy" decoding="async" />
        </span>
      </h2>
      <p class="mx-auto mt-8 max-w-[28em] text-sm text-white/85">{{ text }}</p>
      <NuxtLink :to="localePath(ctaTo)" class="btn-white mt-10 px-10 py-5">{{ label }}</NuxtLink>
    </div>
  </section>
</template>
