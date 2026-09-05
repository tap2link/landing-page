<script setup lang="ts">
// The tap2link wordmark from the old site (tab2link__logo.svg), recoloured via currentColor.
import logo from '~/assets/logo.svg?raw'

withDefaults(defineProps<{ class?: string }>(), { class: 'h-7 w-auto' })
</script>

<template>
  <span class="inline-flex items-center" :class="$props.class" role="img" aria-label="tap2link" v-html="logo" />
</template>

<style scoped>
span :deep(svg) {
  height: 100%;
  width: auto;
}
</style>
