<script setup lang="ts">
// "Design workshop" bento section of the pricing page.
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="container-page py-14 sm:py-20">
    <div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div>
        <h2 class="text-4xl font-semibold leading-tight sm:text-5xl">{{ t('pricing.workshop.title') }}</h2>
        <p class="mt-4 max-w-xs text-sm text-ink/80">{{ t('pricing.workshop.text') }}</p>
        <NuxtLink :to="localePath('/contact')" class="btn-primary mt-6">{{ t('common.contactUs') }}</NuxtLink>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div class="card overflow-hidden p-6 sm:col-span-2 lg:col-span-1">
          <h3 class="text-2xl font-semibold">{{ t('pricing.workshop.cardDesign') }}</h3>
          <img src="/images/pricing/custom-card-design.png" :alt="t('pricing.workshop.cardDesignAlt')" width="984" height="599" class="mt-6 w-full rounded-2xl" loading="lazy" decoding="async" />
        </div>
        <div class="card p-6">
          <h3 class="text-2xl font-semibold">{{ t('pricing.workshop.profileDesign') }}</h3>
          <div class="mt-6 rounded-2xl bg-brand-100 p-5">
            <div class="mx-auto flex max-w-[220px] items-center gap-3 rounded-xl bg-brand-400/40 p-3">
              <img src="/images/pricing/user-photo.png" :alt="t('pricing.workshop.profileAlt')" width="244" height="244" class="h-12 w-12 rounded-full object-cover" loading="lazy" decoding="async" />
              <div>
                <p class="font-sans text-sm font-semibold text-navy">{{ t('pricing.workshop.profileName') }}</p>
                <p class="text-xs text-navy/70">{{ t('pricing.workshop.profileRole') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex min-h-[220px] flex-col justify-between rounded-3xl bg-navy p-6 text-white">
          <div class="flex gap-1.5">
            <span class="h-3 w-3 rounded-full bg-white" /><span class="h-3 w-3 rounded-full bg-white" /><span class="h-3 w-3 rounded-full border border-white" />
          </div>
          <h3 class="text-3xl font-semibold text-white">{{ t('pricing.workshop.threeRounds') }}</h3>
        </div>
        <div class="flex min-h-[220px] items-end rounded-3xl bg-brand-500 p-6 text-white">
          <h3 class="text-3xl font-semibold text-white">{{ t('pricing.workshop.oneHour') }}</h3>
        </div>
        <div class="card relative min-h-[220px] overflow-hidden">
          <img src="/images/pricing/designer.png" :alt="t('pricing.workshop.seniorDesignerAlt')" width="794" height="1190" class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent p-6 pt-12">
            <h3 class="text-2xl font-semibold">{{ t('pricing.workshop.seniorDesigner') }}</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
