<script setup lang="ts">
// Netlify Forms: the form is detected at deploy time from the static HTML (name + data-netlify),
// submissions go to POST / as application/x-www-form-urlencoded with the form-name field.
const { t } = useI18n()
const localePath = useLocalePath()

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

async function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  status.value = 'submitting'

  try {
    await $fetch('/', {
      method: 'POST',
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    status.value = 'success'
    form.reset()
  } catch {
    status.value = 'error'
  }
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-navy/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
</script>

<template>
  <div>
    <form
      v-if="status !== 'success'"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      class="space-y-5"
      @submit.prevent="handleSubmit"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p class="hidden">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="firstName" class="block font-sans text-sm font-medium text-navy">{{ t('contact.form.firstName') }}</label>
          <input id="firstName" name="firstName" type="text" required autocomplete="given-name" :class="inputClass" />
        </div>
        <div>
          <label for="lastName" class="block font-sans text-sm font-medium text-navy">{{ t('contact.form.lastName') }}</label>
          <input id="lastName" name="lastName" type="text" required autocomplete="family-name" :class="inputClass" />
        </div>
      </div>

      <div>
        <label for="email" class="block font-sans text-sm font-medium text-navy">{{ t('contact.form.email') }}</label>
        <input id="email" name="email" type="email" required autocomplete="email" :class="inputClass" />
      </div>

      <div>
        <label for="company" class="block font-sans text-sm font-medium text-navy">{{ t('contact.form.company') }}</label>
        <input id="company" name="company" type="text" autocomplete="organization" :class="inputClass" />
      </div>

      <div>
        <label for="message" class="block font-sans text-sm font-medium text-navy">{{ t('contact.form.message') }}</label>
        <textarea id="message" name="message" rows="5" required :class="inputClass" />
      </div>

      <i18n-t keypath="contact.form.privacyNote" tag="p" class="text-xs text-grey-500">
        <template #privacy>
          <NuxtLink :to="localePath('/privacy-policy')" class="underline hover:text-navy">{{ t('footer.privacy') }}</NuxtLink>
        </template>
      </i18n-t>

      <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? t('contact.form.sending') : t('contact.form.submit') }}
      </button>

      <p v-if="status === 'error'" class="text-sm text-red-600">{{ t('contact.form.error') }}</p>
    </form>

    <div v-else class="rounded-2xl border border-green-200 bg-green-50 p-6 font-sans font-semibold text-green-800">
      {{ t('contact.form.success') }}
    </div>
  </div>
</template>
