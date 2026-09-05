<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const article = useArticle(route.params.slug as string, locale.value)

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

usePageSeo({ title: article.seoTitle, description: article.description, type: 'article', image: article.image, fullTitle: true })

const dateLabel = computed(() => {
  const d = new Date(article.date)
  return Number.isNaN(d.getTime())
    ? article.date
    : new Intl.DateTimeFormat(locale.value === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
})
const size = imageSize(article.image)

// table of contents from the H2s in the rendered markdown (the old site listed them under the cover)
const headings = computed(() => [...article.html.matchAll(/<h2>(.*?)<\/h2>/g)].map((m) => m[1]!))
const slugify = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '')
const html = computed(() => article.html.replace(/<h2>(.*?)<\/h2>/g, (_, h) => `<h2 id="${slugify(h)}">${h}</h2>`))
</script>

<template>
  <article>
    <section class="container-page pt-14 sm:pt-20">
      <div class="mx-auto max-w-3xl">
        <NuxtLink :to="localePath('/blog')" class="link-arrow">← {{ t('common.backToBlog') }}</NuxtLink>
        <p class="mt-6 font-sans text-xs font-semibold uppercase tracking-wider text-grey-500">{{ dateLabel }}</p>
        <h1 class="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{{ article!.title }}</h1>
      </div>
      <img v-if="article!.image" :src="article!.image" :alt="article!.imageAlt" :width="size.width" :height="size.height" class="mt-10 aspect-[2/1] w-full rounded-[2rem] border border-navy object-cover" decoding="async" />
    </section>

    <section class="container-page py-12">
      <div class="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[260px_1fr]">
        <nav v-if="headings.length" class="lg:sticky lg:top-24 lg:self-start" :aria-label="t('common.tableOfContents')">
          <p class="font-sans text-sm font-semibold text-navy">{{ t('common.tableOfContents') }}</p>
          <ol class="mt-3 space-y-2 text-sm">
            <li v-for="(h, i) in headings" :key="i" class="flex gap-3">
              <span class="font-sans font-semibold text-brand-500">{{ i + 1 }}</span>
              <a :href="`#${slugify(h)}`" class="hover:text-brand-600" v-html="h" />
            </li>
          </ol>
        </nav>
        <div class="card p-6 sm:p-10">
          <div class="prose prose-neutral max-w-none prose-t2l" v-html="html" />
        </div>
      </div>
    </section>
  </article>
</template>
