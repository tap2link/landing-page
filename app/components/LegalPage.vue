<script setup lang="ts">
// Shared template for the four legal pages (markdown from content/legal, EN + DE).
const props = defineProps<{ slug: string }>()
const { locale } = useI18n()
const page = useLegalPage(props.slug, locale.value)

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

usePageSeo({ title: page.seoTitle, description: page.description, fullTitle: true })
</script>

<template>
  <div>
    <PageHero :title="page!.title" align="left" />
    <section class="container-page pb-20">
      <div class="card max-w-4xl p-6 sm:p-10">
        <div class="prose prose-neutral max-w-none prose-t2l" v-html="page!.html" />
      </div>
    </section>
  </div>
</template>
