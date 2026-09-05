<script setup lang="ts">
// "Use cases" list on the home page: four big rows linking to the use-case pages.
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
    <div class="ml-auto max-w-xl">
      <span class="eyebrow">{{ t('home.useCases.eyebrow') }}</span>
      <h2 class="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{{ t('home.useCases.title') }}</h2>
    </div>

    <ul class="mt-10 divide-y divide-navy/30 border-y border-navy/30">
      <li v-for="item in items" :key="item.slug">
        <NuxtLink :to="localePath(`/use-cases/${item.slug}`)" class="group flex items-center justify-between gap-6 py-6 sm:py-8">
          <span class="font-sans text-3xl font-semibold text-navy/30 transition group-hover:text-navy sm:text-5xl">{{ t(`useCases.${item.key}`) }}</span>
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy/20 text-white transition group-hover:bg-brand-500 sm:h-14 sm:w-14">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
