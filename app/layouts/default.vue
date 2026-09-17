<script setup lang="ts">
// Pages that declare `headerOverlay: true` in definePageMeta (today: the home page) get the
// transparent header floating over their hero photo; every other page keeps the solid bar.
const route = useRoute()
const overlay = computed(() => route.meta.headerOverlay === true)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader :overlay="overlay" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
