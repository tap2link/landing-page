<script setup lang="ts">
import { LINKS } from '~/data/links'

const { t } = useI18n()
usePageSeo({ title: t('seo.contact.title'), description: t('seo.contact.description'), fullTitle: true })

const socials = [
  { label: 'Instagram', href: LINKS.instagram },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'Facebook', href: LINKS.facebook }
]
</script>

<template>
  <div>
    <PageHero :title="t('contact.title')" :text="t('contact.text')" align="left" />
    <section class="container-page pb-20">
      <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <a :href="`mailto:${LINKS.contactEmail}`" class="font-sans text-lg font-semibold text-brand-500 underline hover:text-brand-700">{{ LINKS.contactEmail }}</a>
          <ul class="mt-8 space-y-3">
            <li v-for="s in socials" :key="s.href">
              <a :href="s.href" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full border border-navy bg-white px-5 py-2.5 font-sans text-sm font-semibold text-navy hover:bg-grey-100">
                {{ s.label }}
                <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 14L14 6M8 6h6v6" /></svg>
              </a>
            </li>
          </ul>
        </div>
        <div class="card p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  </div>
</template>
