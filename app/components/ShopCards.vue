<script setup lang="ts">
// The "Shop" card row from the old home page. The shop domain (shop.t2l.ink) no longer exists,
// so "Buy now" / "Visit shop" became "Contact us" -> /contact (see README, decisions to confirm).
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const names = computed(() => tm('home.shop.products') as string[])
const files = ['abyss-blue-card', 'simply-violet-card', 'pure-black-card', 'island-turquoise-card', 'diamond-white-card']
</script>

<template>
  <section class="container-page py-14 sm:py-20">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-[22em]">
        <h2 class="text-5xl font-semibold">{{ t('home.shop.title') }}</h2>
        <p class="mt-4 text-sm text-grey-500">{{ t('home.shop.text') }}</p>
      </div>
      <NuxtLink :to="localePath('/contact')" class="btn-primary self-start">{{ t('common.contactUs') }}</NuxtLink>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="(f, i) in files" :key="f" class="card flex flex-col p-7">
        <div class="overflow-hidden rounded-[1.5rem] bg-grey-100">
          <img :src="`/images/shop/${f}.png`" :alt="`${names[i] ? rt(names[i]!) : ''} – ${t('home.shop.cardAlt')}`" width="1024" height="660" class="h-auto w-full" loading="lazy" decoding="async" />
        </div>
        <div class="mt-6 flex flex-col gap-3">
          <h3 class="text-xl font-semibold">{{ names[i] ? rt(names[i]!) : '' }}</h3>
          <p class="text-base text-grey-500">{{ t('home.shop.price') }}</p>
          <NuxtLink :to="localePath('/contact')" class="link-arrow mt-2 w-full justify-between border-t border-dashed border-navy/40 pt-6">
            {{ t('common.contactUs') }}
            <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
