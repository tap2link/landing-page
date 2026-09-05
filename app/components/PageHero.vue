<script setup lang="ts">
// Simple inner-page opener: big centred title, short text, optional action buttons in the slot.
defineProps<{ title: string; text?: string; align?: 'center' | 'left' }>()
</script>

<template>
  <section class="container-page pb-6 pt-14 sm:pt-20" :class="align === 'left' ? '' : 'text-center'">
    <div :class="align === 'left' ? 'max-w-3xl' : 'mx-auto max-w-3xl'">
      <h1 class="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="text" class="mt-5 text-base text-grey-500 sm:text-lg">{{ text }}</p>
      <div v-if="$slots.default" class="mt-8 flex flex-wrap gap-3" :class="align === 'left' ? '' : 'justify-center'">
        <slot />
      </div>
    </div>
  </section>
</template>
