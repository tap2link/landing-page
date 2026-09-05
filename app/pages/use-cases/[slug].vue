<script setup lang="ts">
// Use-case pages: hero photo with the two-line title, then the markdown sections (overview,
// results, conclusion). The eyebrow labels ("About", "What we did", "Summing up") come from
// <!-- eyebrow --> comments in the markdown and are rendered as pills above each H2.
const route = useRoute()
const { t, locale } = useI18n()

const page = useUseCase(route.params.slug as string, locale.value)

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Use case not found' })
}

usePageSeo({ title: page.seoTitle, description: page.description, image: page.hero, fullTitle: true })

const heroSize = imageSize(page.hero)

// turn "<!-- eyebrow: X -->" comments into pills and give the H2s ids
const html = computed(() =>
  page.html
    .replace(/<!-- eyebrow: (.*?) -->/g, '<p class="eyebrow-inline">$1</p>')
    .replace(/<h2>(.*?)<\/h2>/g, (_, h) => `<h2 id="${h.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${h}</h2>`)
)
</script>

<template>
  <article>
    <section class="container-page pt-2">
      <div class="relative overflow-hidden rounded-[2rem] bg-navy text-white">
        <img :src="page!.hero" :alt="page!.heroAlt" :width="heroSize.width" :height="heroSize.height" class="h-[70vh] max-h-[720px] min-h-[460px] w-full object-cover" fetchpriority="high" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
        <div class="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-6 pb-8 sm:px-10 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-14">
          <h1 class="font-sans text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">
            {{ page!.titleLine1 }}<br />
            <span class="text-white/70">{{ page!.titleLine2 }}</span>
          </h1>
          <div class="lg:max-w-sm lg:text-right">
            <p class="text-base text-white/85">{{ page!.subtitle }}</p>
            <a href="#overview" class="btn-white mt-5">{{ t('common.learnMore') }}</a>
          </div>
        </div>
      </div>
    </section>

    <section id="overview" class="container-page scroll-mt-24 py-12 sm:py-16">
      <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_3fr]">
        <div class="flex gap-2 lg:sticky lg:top-24 lg:flex-col lg:self-start">
          <span class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-navy">
            <img :src="page!.iconLight" alt="" width="80" height="80" class="h-8 w-8" loading="lazy" decoding="async" />
          </span>
          <span class="inline-flex h-16 w-16 items-center justify-center rounded-full border border-navy bg-white">
            <img :src="page!.iconDark" alt="" width="80" height="80" class="h-8 w-8" loading="lazy" decoding="async" />
          </span>
        </div>
        <div class="card p-6 sm:p-10">
          <div class="prose prose-neutral max-w-none prose-t2l use-case-body" v-html="html" />
        </div>
      </div>
    </section>

    <CtaBanner :title="t('home.cta.title')" :text="t('home.cta.text')" icon-dark="/images/icons/service.png" icon-light="/images/icons/nfc-white.png" />
  </article>
</template>

<style>
.use-case-body .eyebrow-inline {
  display: inline-flex;
  border: 1px solid var(--color-navy);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 2.5rem;
  margin-bottom: 0;
}
.use-case-body .eyebrow-inline + h2 {
  margin-top: 0.75rem;
}
.use-case-body img {
  border-radius: 1rem;
  max-height: 32rem;
  width: auto;
}
</style>
