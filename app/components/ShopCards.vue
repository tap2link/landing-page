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
      <div class="max-w-md">
        <h2 class="text-4xl font-semibold sm:text-5xl">{{ t('home.shop.title') }}</h2>
        <p class="mt-3 text-base text-grey-500">{{ t('home.shop.text') }}</p>
      </div>
      <NuxtLink :to="localePath('/contact')" class="btn-primary self-start">{{ t('common.contactUs') }}</NuxtLink>
    </div>

    <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="(f, i) in files" :key="f" class="card flex flex-col p-5">
        <div class="overflow-hidden rounded-2xl bg-grey-100">
          <img :src="`/images/shop/${f}.png`" :alt="`${names[i] ? rt(names[i]!) : ''} – ${t('home.shop.cardAlt')}`" width="1024" height="660" class="h-auto w-full" loading="lazy" decoding="async" />
        </div>
        <div class="mt-5 flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold">{{ names[i] ? rt(names[i]!) : '' }}</h3>
            <p class="text-sm text-grey-500">{{ t('home.shop.price') }}</p>
          </div>
          <NuxtLink :to="localePath('/contact')" class="link-arrow shrink-0">{{ t('common.contactUs') }} →</NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
