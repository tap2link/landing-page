<script setup lang="ts">
const { t, locale } = useI18n()
usePageSeo({ title: t('seo.blog.title'), description: t('seo.blog.description'), fullTitle: true })

const articles = computed(() => useArticles(locale.value))
</script>

<template>
  <div>
    <PageHero :title="t('blog.title')" :text="t('blog.text')" />
    <section class="container-page pb-20 pt-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="article in articles" :key="article.slug" :article="article" />
      </div>
    </section>
  </div>
</template>
