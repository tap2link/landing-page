<script setup lang="ts">
import { LINKS } from '~/data/links'

const { t } = useI18n()
const localePath = useLocalePath()
const year = new Date().getFullYear()

const useCaseLinks = [
  { key: 'moerschen', slug: 'moerschen-use-case' },
  { key: 'maintenance', slug: 'maintenance-use-case' },
  { key: 'events', slug: 'events-use-case' },
  { key: 'rheinFire', slug: 'rhein-fire-use-case' }
]

const socials = [
  { label: 'Instagram', href: LINKS.instagram },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'Facebook', href: LINKS.facebook }
]
</script>

<template>
  <footer class="bg-navy text-white">
    <!-- the original's footer measures 721px at 1440; the padding below is what gets it there -->
    <div class="container-page grid gap-14 pb-28 pt-24 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:gap-10 lg:pt-[10rem]">
      <div>
        <NuxtLink :to="localePath('/')" class="inline-flex text-white" aria-label="tap2link">
          <LogoMark class="h-10" />
        </NuxtLink>
        <p class="mt-10 text-sm leading-relaxed text-white/70">
          {{ t('footer.company') }}<br />
          {{ t('footer.street') }}<br />
          {{ t('footer.city') }}<br />
          {{ t('footer.country') }}
        </p>
        <p class="mt-10 font-sans text-sm font-semibold">{{ t('footer.download') }}</p>
        <AppBadges class="mt-4" variant="white" />
      </div>

      <div>
        <h3 class="font-sans text-base font-semibold">{{ t('footer.solutions') }}</h3>
        <ul class="mt-5 divide-y divide-white/15 border-t border-white/15 text-sm">
          <li><NuxtLink :to="localePath('/agro-solutions')" class="block py-3 hover:text-brand-400">{{ t('nav.agro') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/')" class="block py-3 hover:text-brand-400">{{ t('footer.forIndividuals') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/for-business')" class="block py-3 hover:text-brand-400">{{ t('nav.business') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/clubs')" class="block py-3 hover:text-brand-400">{{ t('nav.clubs') }}</NuxtLink></li>
          <li><a :href="LINKS.amazonShop" target="_blank" rel="noopener" class="block py-3 hover:text-brand-400">{{ t('nav.shop') }}</a></li>
          <li><NuxtLink :to="localePath('/pricing')" class="block py-3 hover:text-brand-400">{{ t('nav.pricing') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h3 class="font-sans text-base font-semibold">{{ t('footer.useCases') }}</h3>
        <ul class="mt-5 divide-y divide-white/15 border-t border-white/15 text-sm">
          <li v-for="uc in useCaseLinks" :key="uc.slug">
            <NuxtLink :to="localePath(`/use-cases/${uc.slug}`)" class="block py-3 hover:text-brand-400">{{ t(`useCases.${uc.key}`) }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-sans text-base font-semibold">{{ t('footer.other') }}</h3>
        <ul class="mt-5 divide-y divide-white/15 border-t border-white/15 text-sm">
          <li><NuxtLink :to="localePath('/blog')" class="block py-3 hover:text-brand-400">{{ t('nav.blog') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/faq')" class="block py-3 hover:text-brand-400">{{ t('nav.faq') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/contact')" class="block py-3 hover:text-brand-400">{{ t('footer.contacts') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h3 class="font-sans text-base font-semibold">{{ t('footer.socials') }}</h3>
        <ul class="mt-5 divide-y divide-white/15 border-t border-white/15 text-sm">
          <li v-for="s in socials" :key="s.href">
            <a :href="s.href" target="_blank" rel="noopener" class="flex items-center justify-between py-3 hover:text-brand-400">
              {{ s.label }}
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 14L14 6M8 6h6v6" /></svg>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-white/15">
      <div class="container-page flex flex-col gap-4 py-10 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ t('footer.copyright', { year }) }}</p>
        <nav class="flex flex-wrap gap-x-6 gap-y-2">
          <NuxtLink :to="localePath('/imprint')" class="hover:text-white">{{ t('footer.imprint') }}</NuxtLink>
          <NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white">{{ t('footer.privacy') }}</NuxtLink>
          <NuxtLink :to="localePath('/terms-of-service')" class="hover:text-white">{{ t('footer.terms') }}</NuxtLink>
          <NuxtLink :to="localePath('/shipping-policy')" class="hover:text-white">{{ t('footer.shipping') }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
