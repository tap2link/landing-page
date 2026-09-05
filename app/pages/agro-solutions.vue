<script setup lang="ts">
import { LINKS } from '~/data/links'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
usePageSeo({ title: t('seo.agro.title'), description: t('seo.agro.description'), fullTitle: true })

const whyItems = computed(() => tm('agro.why.items') as Array<{ eyebrow: string; title: string; text: string; alt: string }>)
const whyIcons = ['/images/agro/aim.png', '/images/agro/qr-code.png', '/images/agro/checklist.png', '/images/agro/magnifying-glass.png']
const steps = computed(() => tm('agro.how.steps') as Array<{ title: string; text: string }>)
const includes = computed(() => tm('agro.pricing.includes') as string[])
const tiers = computed(() => tm('agro.pricing.tiers') as Array<{ label: string; price: string }>)
</script>

<template>
  <div>
    <PageHero :title="t('agro.title')" :text="t('agro.text')">
      <NuxtLink :to="localePath('/use-cases/moerschen-use-case')" class="btn-primary">{{ t('common.goToUseCase') }}</NuxtLink>
      <a :href="LINKS.agroVideo" target="_blank" rel="noopener" class="btn-outline">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4.5v11l9-5.5-9-5.5z" /></svg>
        {{ t('common.watchVideo') }}
      </a>
    </PageHero>

    <!-- why -->
    <section class="container-page py-14 sm:py-20">
      <div class="mx-auto max-w-2xl text-center">
        <span class="eyebrow">{{ t('common.whatWeOffer') }}</span>
        <h2 class="mt-5 text-4xl font-semibold sm:text-5xl">{{ t('agro.why.title') }}</h2>
        <p class="mt-4 text-base text-grey-500">{{ t('agro.why.text') }}</p>
      </div>
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(item, i) in whyItems" :key="i" class="card p-6">
          <p class="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-500">{{ rt(item.eyebrow) }}</p>
          <img :src="whyIcons[i]" :alt="rt(item.alt)" width="240" height="240" class="mt-5 h-20 w-20" loading="lazy" decoding="async" />
          <h3 class="mt-5 text-xl font-semibold">{{ rt(item.title) }}</h3>
          <p class="mt-2 text-sm text-ink/80">{{ rt(item.text) }}</p>
        </article>
      </div>
    </section>

    <!-- how it works -->
    <section class="container-page py-14 sm:py-20">
      <div class="grid gap-10 lg:grid-cols-2">
        <div>
          <span class="eyebrow">{{ t('agro.how.eyebrow') }}</span>
          <h2 class="mt-5 text-4xl font-semibold sm:text-5xl">{{ t('agro.how.title') }}</h2>
          <p class="mt-4 text-base text-ink/80">{{ t('agro.how.text') }}</p>
        </div>
        <ol class="space-y-4">
          <li v-for="(s, i) in steps" :key="i" class="card flex gap-5 p-6">
            <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-sans text-sm font-semibold text-white">{{ i + 1 }}</span>
            <div>
              <h3 class="text-lg font-semibold">{{ rt(s.title) }}</h3>
              <p class="mt-1 text-sm text-ink/80">{{ rt(s.text) }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Moerschen use case -->
    <section class="container-page py-14 sm:py-20">
      <div class="rounded-[2rem] bg-navy p-8 text-white sm:p-12">
        <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span class="eyebrow border-white/40 text-white">{{ t('common.useCase') }}</span>
            <h2 class="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {{ t('agro.useCase.title1') }}
              <span class="whitespace-nowrap">
                <img src="/images/agro/moerschen-logo.png" :alt="t('agro.useCase.logoAlt')" width="232" height="232" class="inline-block h-[0.9em] w-[0.9em] rounded-lg align-baseline" loading="lazy" decoding="async" />{{ t('agro.useCase.title2') }}
              </span>
            </h2>
            <p class="mt-5 text-base text-white/80">{{ t('agro.useCase.text') }}</p>
            <NuxtLink :to="localePath('/use-cases/moerschen-use-case')" class="btn-white mt-8">{{ t('common.readUseCase') }}</NuxtLink>
          </div>
          <div class="flex items-end justify-center gap-3">
            <img src="/images/agro/tractor-card-2.png" :alt="t('agro.useCase.cardAlt')" width="430" height="430" class="w-1/4 rounded-2xl" loading="lazy" decoding="async" />
            <img src="/images/agro/tractor-card-1.png" :alt="t('agro.useCase.cardAlt')" width="520" height="520" class="w-2/5 rounded-2xl" loading="lazy" decoding="async" />
            <img src="/images/agro/tractor-card-3.png" :alt="t('agro.useCase.cardAlt')" width="430" height="430" class="w-1/4 rounded-2xl" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <!-- pricing -->
    <section class="container-page py-14 sm:py-20">
      <div class="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span class="eyebrow">{{ t('common.pricing') }}</span>
          <h2 class="mt-5 text-4xl font-semibold sm:text-5xl">{{ t('agro.pricing.title') }}</h2>
          <p class="mt-4 text-base text-ink/80">{{ t('agro.pricing.text') }}</p>
          <NuxtLink :to="localePath('/contact')" class="btn-primary mt-8">{{ t('common.contactUs') }}</NuxtLink>
        </div>
        <div class="card p-6 sm:p-8">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-2xl font-semibold">{{ t('agro.pricing.setupFee') }}</h3>
            <p class="font-sans text-2xl font-semibold text-navy">{{ t('agro.pricing.setupPrice') }}</p>
          </div>
          <p class="mt-5 font-sans text-sm font-semibold text-navy">{{ t('agro.pricing.included') }}</p>
          <ul class="mt-2 flex flex-wrap gap-2">
            <li v-for="(inc, i) in includes" :key="i" class="rounded-full border border-navy/30 px-3 py-1 text-xs">{{ rt(inc) }}</li>
          </ul>
          <p class="mt-6 font-sans text-sm font-semibold text-navy">{{ t('agro.pricing.licence') }}</p>
          <dl class="mt-2 divide-y divide-dashed divide-navy/30 border-y border-navy/30 text-sm">
            <div v-for="(tier, i) in tiers" :key="i" class="flex justify-between py-2.5">
              <dt>{{ rt(tier.label) }}</dt>
              <dd class="font-sans font-semibold text-navy">{{ rt(tier.price) }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt>{{ t('agro.pricing.stickers') }}</dt>
              <dd class="font-sans font-semibold text-navy">{{ t('agro.pricing.stickerPrice') }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <CtaBanner :title="t('agro.cta.title')" :text="t('agro.cta.text')" icon-dark="/images/icons/tractor.png" icon-light="/images/icons/qr-code-white.png" />
  </div>
</template>
