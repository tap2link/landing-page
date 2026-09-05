<script setup lang="ts">
// The "Features" section used on the home, for-business and clubs pages: an eyebrow, a title and
// a masonry-ish grid of bordered cards. Each card has an icon, a title, a short text and a
// "Learn more" toggle that reveals the second paragraph (the old site's plus/minus accordion).
interface FeatureItem {
  title: string
  text: string
  more: string
}

const props = defineProps<{
  /** i18n key of the section object ({ title, text, items[] }) */
  messageKey: string
  /** icon paths, in item order */
  icons: string[]
  eyebrow?: string
  centered?: boolean
}>()

const { t, tm, rt } = useI18n()
const items = computed(() => tm(`${props.messageKey}.items`) as FeatureItem[])
const open = ref<Set<number>>(new Set())

function toggle(i: number) {
  const next = new Set(open.value)
  next.has(i) ? next.delete(i) : next.add(i)
  open.value = next
}
</script>

<template>
  <section class="container-page py-14 sm:py-20">
    <div :class="centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
      <span class="eyebrow">{{ eyebrow ?? t('common.whatWeOffer') }}</span>
      <h2 class="mt-5 text-4xl font-semibold sm:text-5xl">{{ t(`${messageKey}.title`) }}</h2>
      <p class="mt-4 text-base text-grey-500">{{ t(`${messageKey}.text`) }}</p>
    </div>

    <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="(item, i) in items" :key="i" class="card flex flex-col p-7" :class="i % 3 === 1 ? 'lg:mt-10' : ''">
        <img v-if="icons[i]" :src="icons[i]" alt="" width="80" height="80" class="h-10 w-10" loading="lazy" decoding="async" />
        <h3 class="mt-5 text-xl font-semibold">{{ rt(item.title) }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-ink/80">{{ rt(item.text) }}</p>
        <p v-show="open.has(i)" class="mt-3 text-sm leading-relaxed text-ink/80">{{ rt(item.more) }}</p>
        <button type="button" class="link-arrow mt-5 self-start" :aria-expanded="open.has(i)" @click="toggle(i)">
          {{ open.has(i) ? t('common.showLess') : t('common.learnMore') }}
          <svg class="h-4 w-4 transition-transform" :class="open.has(i) ? 'rotate-45' : ''" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" /></svg>
        </button>
      </article>
    </div>
  </section>
</template>
