<script setup lang="ts">
// The strip of partner/customer logos (13 PNGs, 176x66) that scrolled under the app cards on the
// old home page. Rendered as a wrapping grid; no carousel script.
const { tm, rt } = useI18n()
const names = computed(() => tm('home.partners.logos') as string[])
const files = [
  'venture-labs', 'one-hive', 'content-creators', 'rhein-fire', 'gerch', 'bms-corporate-solutions',
  'christkindlmarkt', 'moerschen', 'payfree', 'ekp', 'leipzig-kings', 'oceanmata', 'sedumdach'
]
</script>

<template>
  <section class="container-page pb-6">
    <ul class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80">
      <li v-for="(f, i) in files" :key="f">
        <img :src="`/images/partners/${f}.png`" :alt="names[i] ? rt(names[i]!) : ''" width="176" height="66" class="h-8 w-auto" loading="lazy" decoding="async" />
      </li>
    </ul>
  </section>
</template>
