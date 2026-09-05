<script setup lang="ts">
// Pricing plans with the "General plans / Plans for clubs" toggle from the old site.
// General: a comparison table on large screens (Basic / Professional / Enterprise) and stacked
// plan cards on small screens; Clubs: one plan card + the "Membership club cards" teaser.
import { LINKS } from '~/data/links'

interface Row { label: string; note?: string; tiers: boolean[] }

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const tab = ref<'general' | 'clubs'>('general')
const rows = computed(() => tm('pricing.rows') as Row[])
const clubFeatures = computed(() => tm('pricing.clubs.features') as string[])

const plans = computed(() => [
  { key: 'basic', name: t('pricing.plans.basic.name'), price: t('pricing.plans.basic.price'), cta: 'start', trial: true },
  { key: 'professional', name: t('pricing.plans.professional.name'), price: t('pricing.plans.professional.price'), cta: 'start', trial: true },
  { key: 'enterprise', name: t('pricing.plans.enterprise.name'), price: t('pricing.plans.enterprise.price'), cta: 'contact', trial: false }
])

/** rows of a plan that the previous plan does not have (for the stacked cards) */
function extraRows(planIndex: number) {
  return rows.value.filter((r) => r.tiers[planIndex] && (planIndex === 0 || !r.tiers[planIndex - 1]))
}
</script>

<template>
  <section class="container-page pb-16">
    <div class="flex justify-center">
      <div class="inline-flex rounded-full border border-navy bg-white p-1 shadow-[0_3px_0_0_#051822]" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'general'" class="rounded-full px-5 py-2 font-sans text-sm font-semibold transition" :class="tab === 'general' ? 'bg-navy text-white' : 'text-navy hover:bg-grey-100'" @click="tab = 'general'">
          {{ t('pricing.tabGeneral') }}
        </button>
        <button type="button" role="tab" :aria-selected="tab === 'clubs'" class="rounded-full px-5 py-2 font-sans text-sm font-semibold transition" :class="tab === 'clubs' ? 'bg-navy text-white' : 'text-navy hover:bg-grey-100'" @click="tab = 'clubs'">
          {{ t('pricing.tabClubs') }}
        </button>
      </div>
    </div>

    <!-- General plans -->
    <div v-show="tab === 'general'" class="mt-10">
      <!-- comparison table (large screens) -->
      <div class="card hidden overflow-hidden lg:block">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" class="w-[34%] p-6 text-left align-bottom">
                <span class="sr-only">{{ t('pricing.features') }}</span>
              </th>
              <th v-for="p in plans" :key="p.key" scope="col" class="p-6 text-center align-bottom">
                <span v-if="p.key === 'professional'" class="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-700">{{ t('pricing.trialBadge') }}</span>
                <span class="block font-sans text-3xl font-semibold text-navy">{{ p.name }}</span>
                <span class="mt-1 block text-sm text-grey-500">{{ p.price }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="i" class="border-t border-dashed border-navy/40" :class="i === 0 ? 'border-solid' : ''">
              <th scope="row" class="px-6 py-4 text-left font-body text-sm font-normal text-ink">
                {{ rt(row.label) }}
                <span v-if="row.note" class="block text-xs text-grey-500">{{ rt(row.note) }}</span>
              </th>
              <td v-for="(has, j) in row.tiers" :key="j" class="px-6 py-4 text-center">
                <svg v-if="has" class="mx-auto h-5 w-5 text-navy" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 10.5l4 4 8-9" /></svg>
                <span v-if="has" class="sr-only">✓</span>
                <span v-else class="sr-only">–</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t border-navy">
              <td class="p-6" />
              <td v-for="p in plans" :key="p.key" class="p-6 text-center">
                <a v-if="p.cta === 'start'" :href="LINKS.getStarted" target="_blank" rel="noopener" class="btn-primary w-full">{{ t('common.getStarted') }}</a>
                <NuxtLink v-else :to="localePath('/contact')" class="btn-primary w-full">{{ t('common.contactUs') }}</NuxtLink>
                <p v-if="p.trial" class="mt-3 text-xs text-grey-500">{{ t('pricing.trialNote') }}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- stacked plan cards (small screens) -->
      <div class="grid gap-5 sm:grid-cols-2 lg:hidden">
        <article v-for="(p, i) in plans" :key="p.key" class="card flex flex-col p-6">
          <span v-if="p.key === 'professional'" class="mb-3 self-start rounded-full bg-brand-100 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-700">{{ t('pricing.trialBadge') }}</span>
          <h3 class="text-3xl font-semibold">{{ p.name }}</h3>
          <p class="mt-1 text-sm text-grey-500">{{ p.price }}</p>
          <p class="mt-5 font-sans text-sm font-semibold text-navy">
            <template v-if="i === 0">{{ t('pricing.included') }}</template>
            <template v-else>{{ t('pricing.allFrom', { plan: plans[0]!.name }) }}</template>
          </p>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="(row, r) in extraRows(i)" :key="r" class="flex items-start gap-2">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-navy" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 10.5l4 4 8-9" /></svg>
              <span>{{ rt(row.label) }}<span v-if="row.note" class="block text-xs text-grey-500">{{ rt(row.note) }}</span></span>
            </li>
          </ul>
          <div class="mt-auto pt-6">
            <a v-if="p.cta === 'start'" :href="LINKS.getStarted" target="_blank" rel="noopener" class="btn-primary w-full">{{ t('common.getStarted') }}</a>
            <NuxtLink v-else :to="localePath('/contact')" class="btn-primary w-full">{{ t('common.contactUs') }}</NuxtLink>
            <p v-if="p.trial" class="mt-3 text-center text-xs text-grey-500">{{ t('pricing.trialNote') }}</p>
          </div>
        </article>
      </div>
    </div>

    <!-- Plans for clubs -->
    <div v-show="tab === 'clubs'" class="mt-10 grid gap-5 lg:grid-cols-2">
      <article class="card flex flex-col p-6 sm:p-8">
        <h3 class="text-3xl font-semibold">{{ t('pricing.clubs.name') }}</h3>
        <p class="mt-1 text-sm text-grey-500">{{ t('pricing.clubs.price') }}</p>
        <p class="mt-5 font-sans text-sm font-semibold text-navy">{{ t('pricing.included') }}</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li v-for="(f, i) in clubFeatures" :key="i" class="flex items-start gap-2">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-navy" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 10.5l4 4 8-9" /></svg>
            <span>{{ rt(f) }}</span>
          </li>
        </ul>
        <div class="mt-auto pt-6">
          <a :href="LINKS.getStarted" target="_blank" rel="noopener" class="btn-primary w-full sm:w-auto">{{ t('common.getStarted') }}</a>
        </div>
      </article>
      <article class="flex flex-col justify-between rounded-3xl bg-navy p-6 text-white sm:p-8">
        <div>
          <img src="/images/clubs/club-cards.png" :alt="t('clubs.showcase.cardAlt')" width="527" height="501" class="h-40 w-auto" loading="lazy" decoding="async" />
          <h3 class="mt-6 text-3xl font-semibold text-white">{{ t('pricing.clubs.cardTitle') }}</h3>
          <p class="mt-3 text-sm text-white/80">{{ t('pricing.clubs.cardText') }}</p>
        </div>
        <NuxtLink :to="localePath('/clubs')" class="btn-white mt-8 self-start">{{ t('common.learnMore') }}</NuxtLink>
      </article>
    </div>
  </section>
</template>
