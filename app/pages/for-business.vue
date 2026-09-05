<script setup lang="ts">
import { LINKS } from '~/data/links'

const { t, tm, rt } = useI18n()
usePageSeo({ title: t('seo.business.title'), description: t('seo.business.description'), fullTitle: true })

const featureIcons = [
  '/images/icons/employee-card.png',
  '/images/icons/code.png',
  '/images/icons/leaf-outline.png',
  '/images/icons/integration.png',
  '/images/icons/employees.png',
  '/images/icons/custom-design.png',
  '/images/icons/service.png'
]

const testimonials = computed(() => tm('business.testimonials.items') as Array<{ text: string; author: string }>)
</script>

<template>
  <div>
    <PageHero :title="t('business.title')" :text="t('business.text')">
      <a :href="LINKS.scheduleDemo" target="_blank" rel="noopener" class="btn-primary">{{ t('common.scheduleDemo') }}</a>
    </PageHero>

    <FeatureCards message-key="business.features" :icons="featureIcons" />

    <section class="container-page py-14 sm:py-20">
      <div class="max-w-2xl">
        <span class="eyebrow">{{ t('common.testimonials') }}</span>
        <h2 class="mt-5 text-4xl font-semibold sm:text-5xl">{{ t('business.testimonials.title') }}</h2>
      </div>
      <div class="mt-10 grid gap-5 lg:grid-cols-3">
        <blockquote v-for="(item, i) in testimonials" :key="i" class="card flex flex-col p-7">
          <img src="/images/business/quote-mark.png" alt="" width="272" height="214" class="h-8 w-auto self-start" loading="lazy" decoding="async" />
          <p class="mt-5 flex-1 text-sm leading-relaxed text-ink/80">{{ rt(item.text) }}</p>
          <footer class="mt-6 font-sans text-lg font-semibold text-navy">{{ rt(item.author) }}</footer>
        </blockquote>
      </div>
    </section>

    <!-- profile preview strips (three 4444x292 PNGs) -->
    <section class="space-y-4 overflow-hidden py-6" aria-hidden="true">
      <div v-for="n in 3" :key="n" class="flex" :class="n === 2 ? 'justify-end' : ''">
        <img :src="`/images/business/profiles-strip-${n}.png`" :alt="t('business.profilesAlt')" width="4444" height="292" class="h-20 w-auto max-w-none sm:h-28" loading="lazy" decoding="async" />
      </div>
    </section>

    <CtaBanner :title="t('business.cta.title')" :text="t('business.cta.text')" icon-dark="/images/icons/employee-card.png" icon-light="/images/icons/envelope-white.png" />
  </div>
</template>
