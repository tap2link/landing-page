<script setup lang="ts">
import type { ArticleContent } from '~/composables/useContent'

const props = defineProps<{ article: ArticleContent }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const dateLabel = computed(() => {
  const d = new Date(props.article.date)
  return Number.isNaN(d.getTime())
    ? props.article.date
    : new Intl.DateTimeFormat(locale.value === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
})
const size = imageSize(props.article.image)
</script>

<template>
  <article class="card flex flex-col overflow-hidden">
    <NuxtLink :to="localePath(`/blog-articles/${article.slug}`)" class="block aspect-[16/9] overflow-hidden border-b border-navy bg-grey-100">
      <img v-if="article.image" :src="article.image" :alt="article.imageAlt" :width="size.width" :height="size.height" class="h-full w-full object-cover" loading="lazy" decoding="async" />
    </NuxtLink>
    <div class="flex flex-1 flex-col p-6">
      <p class="font-sans text-xs font-semibold uppercase tracking-wider text-grey-500">{{ dateLabel }}</p>
      <h3 class="mt-2 text-lg font-semibold leading-snug">
        <NuxtLink :to="localePath(`/blog-articles/${article.slug}`)" class="hover:text-brand-600">{{ article.title }}</NuxtLink>
      </h3>
      <p class="mt-3 line-clamp-3 text-sm text-ink/70">{{ article.description }}</p>
      <NuxtLink :to="localePath(`/blog-articles/${article.slug}`)" class="link-arrow mt-auto pt-5">{{ t('common.readPost') }} →</NuxtLink>
    </div>
  </article>
</template>
