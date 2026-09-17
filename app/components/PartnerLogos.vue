<script setup lang="ts">
// The strip of partner/customer logos (13 PNGs, 176x66) that scrolled under the app cards on the
// old home page. One non-wrapping greyscale row from lg up (the original marquees the same row and
// clips it; the movement is deliberately not reproduced) - each logo keeps its aspect ratio and
// shrinks into its share of the row, so all 13 stay visible and nothing overflows.
const { tm, rt } = useI18n()
const names = computed(() => tm('home.partners.logos') as string[])
const files = [
  'venture-labs', 'one-hive', 'content-creators', 'rhein-fire', 'gerch', 'bms-corporate-solutions',
  'christkindlmarkt', 'moerschen', 'payfree', 'ekp', 'leipzig-kings', 'oceanmata', 'sedumdach'
]
</script>

<template>
  <section class="w-full overflow-hidden pb-10">
    <ul class="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 px-5 sm:px-8 lg:flex-nowrap lg:gap-x-4">
      <li v-for="(f, i) in files" :key="f" class="flex min-w-0 items-center justify-center lg:flex-1">
        <img
          :src="`/images/partners/${f}.png`"
          :alt="names[i] ? rt(names[i]!) : ''"
          width="176"
          height="66"
          class="h-[2.75rem] w-auto max-w-full object-contain grayscale lg:h-[3.125rem]"
          loading="lazy"
          decoding="async"
        />
      </li>
    </ul>
  </section>
</template>
