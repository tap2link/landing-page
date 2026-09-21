<script setup lang="ts">
// The "Features" section used on the home, for-business and clubs pages: an eyebrow, a title and
// a staggered grid of bordered cards. Each card has an icon, a title, a short text, a dashed
// divider and a "Learn more" toggle that reveals the second paragraph (the old site's plus/minus
// accordion). From lg up the cards sit in three columns with different starting offsets, the way
// the original staggers them; below lg the column wrappers are display:contents and the cards
// flow in the plain grid. The fluid type scale makes the card copy large enough that German
// compounds can outgrow a phone-width card, so the text wraps and hyphenates (from the document's
// own lang) and the card itself may shrink below its content's intrinsic width.
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

/** the items split into three balanced columns, keeping their order and their icon index */
const columns = computed(() => {
  const list = items.value ?? []
  const cols: { item: FeatureItem, i: number }[][] = []
  let from = 0
  for (let c = 0; c < 3; c++) {
    const take = Math.ceil((list.length - from) / (3 - c))
    cols.push(list.slice(from, from + take).map((item, n) => ({ item, i: from + n })))
    from += take
  }
  return cols
})

/** the original starts the middle column highest, then the right, then the left */
const columnOffset = ['lg:mt-40', '', 'lg:mt-20']

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
      <h2 class="mt-5 text-5xl font-semibold">{{ t(`${messageKey}.title`) }}</h2>
      <p class="mt-5 text-sm text-grey-500">{{ t(`${messageKey}.text`) }}</p>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:flex lg:items-start lg:gap-6">
      <div v-for="(col, c) in columns" :key="c" class="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-6" :class="columnOffset[c]">
        <article v-for="entry in col" :key="entry.i" class="card flex min-w-0 flex-col p-7 sm:p-10">
          <img v-if="icons[entry.i]" :src="icons[entry.i]" alt="" width="80" height="80" class="h-10 w-10" loading="lazy" decoding="async" />
          <h3 class="mt-6 hyphens-auto break-words text-xl font-semibold">{{ rt(entry.item.title) }}</h3>
          <p class="mt-3 hyphens-auto break-words text-base leading-relaxed text-navy">{{ rt(entry.item.text) }}</p>
          <p v-show="open.has(entry.i)" class="mt-3 hyphens-auto break-words text-base leading-relaxed text-navy">{{ rt(entry.item.more) }}</p>
          <button type="button" class="link-arrow mt-auto w-full justify-between border-t-2 border-dashed border-navy pt-8" :aria-expanded="open.has(entry.i)" @click="toggle(entry.i)">
            {{ open.has(entry.i) ? t('common.showLess') : t('common.learnMore') }}
            <svg class="h-6 w-6 shrink-0 transition-transform" :class="open.has(entry.i) ? 'rotate-45' : ''" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" /></svg>
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
