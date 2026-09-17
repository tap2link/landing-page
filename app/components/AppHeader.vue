<script setup lang="ts">
import { LINKS } from '~/data/links'

withDefaults(defineProps<{
  /** float transparently over the page's hero photo instead of sitting on a solid bar */
  overlay?: boolean
}>(), { overlay: false })

const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const mobileOpen = ref(false)
const openDropdown = ref<'useCases' | 'other' | null>(null)

const useCaseLinks = [
  { key: 'moerschen', slug: 'moerschen-use-case' },
  { key: 'maintenance', slug: 'maintenance-use-case' },
  { key: 'events', slug: 'events-use-case' },
  { key: 'rheinFire', slug: 'rhein-fire-use-case' }
]

const otherLinks = [
  { key: 'blog', path: '/blog' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' }
]

const otherLocale = computed(() => locales.value.find((l) => (typeof l === 'string' ? l : l.code) !== locale.value))
const otherLocaleCode = computed(() => (typeof otherLocale.value === 'string' ? otherLocale.value : otherLocale.value?.code) ?? 'de')

const route = useRoute()
watch(() => route.fullPath, () => { mobileOpen.value = false; openDropdown.value = null })
</script>

<template>
  <header
    class="z-40"
    :class="overlay ? 'fixed inset-x-0 top-0 bg-transparent' : 'sticky top-0 bg-page/90 backdrop-blur'"
  >
    <div class="container-page flex items-center justify-between gap-4 py-4 sm:py-5">
      <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center rounded-full border-2 border-navy bg-white px-6 py-4 text-navy" aria-label="tap2link">
        <LogoMark class="h-6" />
      </NuxtLink>

      <!-- desktop nav: the bordered pill of links from the old design -->
      <nav class="hidden items-center gap-1 rounded-full border-2 border-navy bg-white px-3 py-2 font-sans text-[clamp(0.875rem,0.26rem+0.96vw,1.125rem)] font-medium text-navy lg:flex">
        <div class="relative" @mouseenter="openDropdown = 'useCases'" @mouseleave="openDropdown = null">
          <button type="button" class="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-grey-100" :aria-expanded="openDropdown === 'useCases'" @click="openDropdown = openDropdown === 'useCases' ? null : 'useCases'">
            {{ t('nav.useCases') }}
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
          </button>
          <div v-show="openDropdown === 'useCases'" class="absolute left-0 top-full pt-3">
            <div class="w-56 rounded-2xl border border-navy bg-white p-2 shadow-lg">
              <NuxtLink v-for="uc in useCaseLinks" :key="uc.slug" :to="localePath(`/use-cases/${uc.slug}`)" class="block rounded-xl px-3 py-2 hover:bg-brand-50 hover:text-brand-700">
                {{ t(`useCases.${uc.key}`) }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink :to="localePath('/agro-solutions')" class="rounded-full px-3 py-1.5 hover:bg-grey-100">{{ t('nav.agro') }}</NuxtLink>
        <NuxtLink :to="localePath('/for-business')" class="rounded-full px-3 py-1.5 hover:bg-grey-100">{{ t('nav.business') }}</NuxtLink>
        <NuxtLink :to="localePath('/clubs')" class="rounded-full px-3 py-1.5 hover:bg-grey-100">{{ t('nav.clubs') }}</NuxtLink>
        <a :href="LINKS.amazonShop" target="_blank" rel="noopener" class="rounded-full px-3 py-1.5 hover:bg-grey-100">{{ t('nav.shop') }}</a>
        <NuxtLink :to="localePath('/pricing')" class="rounded-full px-3 py-1.5 hover:bg-grey-100">{{ t('nav.pricing') }}</NuxtLink>
        <div class="relative" @mouseenter="openDropdown = 'other'" @mouseleave="openDropdown = null">
          <button type="button" class="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-grey-100" :aria-expanded="openDropdown === 'other'" @click="openDropdown = openDropdown === 'other' ? null : 'other'">
            {{ t('nav.other') }}
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
          </button>
          <div v-show="openDropdown === 'other'" class="absolute right-0 top-full pt-3">
            <div class="w-72 rounded-2xl border border-navy bg-white p-2 shadow-lg">
              <NuxtLink v-for="o in otherLinks" :key="o.path" :to="localePath(o.path)" class="block rounded-xl px-3 py-2 hover:bg-brand-50 hover:text-brand-700">
                {{ t(`nav.${o.key}`) }}
              </NuxtLink>
              <div class="mt-2 rounded-xl bg-grey-100 p-3">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-grey-500">{{ t('nav.latestPost') }}</p>
                <p class="mt-1 font-semibold">Oceanmata x tap2link</p>
                <NuxtLink :to="localePath('/blog-articles/oceanmata-x-tap2link')" class="link-arrow mt-1">{{ t('common.readPost') }} →</NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink v-if="otherLocale" :to="switchLocalePath(otherLocaleCode)" class="ml-1 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 uppercase hover:bg-brand-100" :aria-label="t('nav.switchLanguage')">
          <svg v-if="otherLocaleCode === 'de'" class="h-4 w-6 shrink-0 rounded-[2px]" viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="1" y="0" fill="#000" /><rect width="5" height="1" y="1" fill="#d00" /><rect width="5" height="1" y="2" fill="#ffce00" /></svg>
          <svg v-else class="h-4 w-6 shrink-0 rounded-[2px]" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169" /><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6" /><path d="M0 0l60 30M60 0L0 30" stroke="#c8102e" stroke-width="3" /><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10" /><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6" /></svg>
          {{ otherLocaleCode }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink v-if="otherLocale" :to="switchLocalePath(otherLocaleCode)" class="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-white px-4 py-3 font-sans text-sm font-semibold uppercase text-navy lg:hidden" :aria-label="t('nav.switchLanguage')">
          <svg v-if="otherLocaleCode === 'de'" class="h-4 w-6 shrink-0 rounded-[2px]" viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="1" y="0" fill="#000" /><rect width="5" height="1" y="1" fill="#d00" /><rect width="5" height="1" y="2" fill="#ffce00" /></svg>
          <svg v-else class="h-4 w-6 shrink-0 rounded-[2px]" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169" /><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6" /><path d="M0 0l60 30M60 0L0 30" stroke="#c8102e" stroke-width="3" /><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10" /><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6" /></svg>
          {{ otherLocaleCode }}
        </NuxtLink>
        <a :href="LINKS.login" target="_blank" rel="noopener" class="btn-dark hidden border-2 border-navy py-3.5 text-[clamp(0.875rem,0.26rem+0.96vw,1.125rem)] sm:inline-flex">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round" /></svg>
          {{ t('nav.login') }}
        </a>
        <button type="button" class="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy bg-white text-navy lg:hidden" :aria-label="mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')" :aria-expanded="mobileOpen" @click="mobileOpen = !mobileOpen">
          <svg v-if="!mobileOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>

    <!-- mobile menu -->
    <div v-if="mobileOpen" class="border-t border-navy/10 bg-page px-5 pb-6 pt-2 lg:hidden">
      <nav class="flex flex-col font-sans text-base font-medium text-navy">
        <p class="pt-3 text-xs font-semibold uppercase tracking-wider text-grey-500">{{ t('nav.useCases') }}</p>
        <NuxtLink v-for="uc in useCaseLinks" :key="uc.slug" :to="localePath(`/use-cases/${uc.slug}`)" class="py-2">{{ t(`useCases.${uc.key}`) }}</NuxtLink>
        <hr class="my-2 border-navy/10" />
        <NuxtLink :to="localePath('/agro-solutions')" class="py-2">{{ t('nav.agro') }}</NuxtLink>
        <NuxtLink :to="localePath('/for-business')" class="py-2">{{ t('nav.business') }}</NuxtLink>
        <NuxtLink :to="localePath('/clubs')" class="py-2">{{ t('nav.clubs') }}</NuxtLink>
        <a :href="LINKS.amazonShop" target="_blank" rel="noopener" class="py-2">{{ t('nav.shop') }}</a>
        <NuxtLink :to="localePath('/pricing')" class="py-2">{{ t('nav.pricing') }}</NuxtLink>
        <hr class="my-2 border-navy/10" />
        <p class="pt-1 text-xs font-semibold uppercase tracking-wider text-grey-500">{{ t('nav.other') }}</p>
        <NuxtLink v-for="o in otherLinks" :key="o.path" :to="localePath(o.path)" class="py-2">{{ t(`nav.${o.key}`) }}</NuxtLink>
        <a :href="LINKS.login" target="_blank" rel="noopener" class="btn-dark mt-4 sm:hidden">{{ t('nav.login') }}</a>
      </nav>
    </div>
  </header>
</template>
