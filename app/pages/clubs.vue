<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
usePageSeo({ title: t('seo.clubs.title'), description: t('seo.clubs.description'), fullTitle: true })

const featureIcons = [
  '/images/icons/card.png',
  '/images/icons/envelope.png',
  '/images/icons/desktop.png',
  '/images/icons/calendar-outline.png',
  '/images/icons/money.png',
  '/images/icons/sponsor.png'
]
</script>

<template>
  <div>
    <PageHero :title="t('clubs.title')" :text="t('clubs.text')">
      <NuxtLink :to="localePath('/contact')" class="btn-primary">{{ t('common.contactUs') }}</NuxtLink>
    </PageHero>

    <!-- product showcase: bento of app screenshots -->
    <section class="container-page py-10">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <figure class="card flex flex-col p-5 sm:col-span-2">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.card') }}</figcaption>
          <img src="/images/clubs/club-cards.png" :alt="t('clubs.showcase.cardAlt')" width="527" height="501" class="mx-auto mt-4 h-56 w-auto" loading="lazy" decoding="async" />
        </figure>
        <figure class="card flex flex-col p-5">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.status') }}</figcaption>
          <img src="/images/clubs/club-status.png" :alt="t('clubs.showcase.statusAlt')" width="497" height="264" class="mt-auto w-full" loading="lazy" decoding="async" />
        </figure>
        <figure class="card row-span-2 flex flex-col overflow-hidden p-5">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.landing') }}</figcaption>
          <img src="/images/clubs/club-app-view.png" :alt="t('clubs.showcase.landingAlt')" width="429" height="480" class="mx-auto mt-4 w-full max-w-[260px]" loading="lazy" decoding="async" />
        </figure>
        <figure class="card flex flex-col p-5">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.plans') }}</figcaption>
          <img src="/images/clubs/club-members.png" :alt="t('clubs.showcase.plansAlt')" width="503" height="336" class="mt-auto w-full" loading="lazy" decoding="async" />
        </figure>
        <figure class="card flex flex-col p-5">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.invitations') }}</figcaption>
          <img src="/images/clubs/invite.png" :alt="t('clubs.showcase.invitationsAlt')" width="276" height="228" class="mx-auto mt-auto h-32 w-auto" loading="lazy" decoding="async" />
        </figure>
        <figure class="card flex flex-col p-5">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.payments') }}</figcaption>
          <img src="/images/clubs/payment.png" :alt="t('clubs.showcase.paymentsAlt')" width="338" height="258" class="mx-auto mt-auto h-32 w-auto" loading="lazy" decoding="async" />
        </figure>
        <figure class="card flex flex-col p-5 sm:col-span-2 lg:col-span-3">
          <figcaption class="font-sans text-sm font-semibold text-navy">{{ t('clubs.showcase.url') }}</figcaption>
          <img src="/images/clubs/custom-url.jpg" :alt="t('clubs.showcase.urlAlt')" width="585" height="497" class="mt-4 w-full rounded-2xl" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <FeatureCards message-key="clubs.features" :icons="featureIcons" />

    <CtaBanner :title="t('clubs.cta.title')" :text="t('clubs.cta.text')" icon-dark="/images/icons/employees.png" icon-light="/images/icons/paper-white.png" />
  </div>
</template>
