<script setup lang="ts">
const { tm, rt } = useI18n()
const items = computed(() => tm('faq.items') as Array<{ q: string; a: string }>)
const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-3">
    <div v-for="(item, i) in items" :key="i" class="card overflow-hidden">
      <button type="button" class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-sans font-semibold text-navy" :aria-expanded="openIndex === i" @click="toggle(i)">
        {{ rt(item.q) }}
        <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
          <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-45': openIndex === i }" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
          </svg>
        </span>
      </button>
      <div v-show="openIndex === i" class="px-6 pb-6 text-sm leading-relaxed text-ink/80">
        {{ rt(item.a) }}
      </div>
    </div>
  </div>
</template>
