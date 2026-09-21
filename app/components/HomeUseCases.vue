<script setup lang="ts">
// "Use cases" list on the home page: four big rows linking to the use-case pages. The eyebrow
// stays on the left and the intro sits in the right half, as on the original.
const { t } = useI18n()
const localePath = useLocalePath()
const items = [
  { key: 'moerschen', slug: 'moerschen-use-case' },
  { key: 'maintenance', slug: 'maintenance-use-case' },
  { key: 'events', slug: 'events-use-case' },
  { key: 'rheinFire', slug: 'rhein-fire-use-case' }
]
</script>

<template>
  <section class="container-page py-14 sm:py-20">
    <div class="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
      <span class="eyebrow justify-self-start">{{ t('home.useCases.eyebrow') }}</span>
      <h2 class="text-3xl font-semibold">{{ t('home.useCases.title') }}</h2>
    </div>

    <ul class="mt-12 divide-y-2 divide-navy border-y-2 border-navy">
      <li v-for="item in items" :key="item.slug">
        <NuxtLink :to="localePath(`/use-cases/${item.slug}`)" class="group flex items-center justify-between gap-3 py-8 sm:gap-6 sm:py-10">
          <!-- the German names are single long words: the title has to be allowed to wrap
               inside the row rather than push the arrow button out of the viewport -->
          <span class="min-w-0 hyphens-auto break-words font-sans text-5xl font-semibold text-navy/30 transition group-hover:text-navy">{{ t(`useCases.${item.key}`) }}</span>
          <span class="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy/20 text-white transition group-hover:bg-brand-500 sm:h-16 sm:w-16">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
