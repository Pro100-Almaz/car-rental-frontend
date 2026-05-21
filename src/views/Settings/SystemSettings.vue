<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Системные настройки</h1>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="space-y-5">
        <div v-for="i in 3" :key="i">
          <div class="mb-1.5 h-4 w-32 rounded skeleton-shimmer" />
          <div class="h-10 w-full rounded-lg skeleton-shimmer" />
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <div class="h-10 w-24 rounded-lg skeleton-shimmer" />
          <div class="h-10 w-28 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- Form card -->
    <div
      v-else
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <form @submit.prevent="handleSave" class="space-y-5">
        <!-- Часовой пояс -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Часовой пояс
          </label>
          <div class="relative">
            <select
              v-model="form.timezone"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            >
              <option value="Asia/Almaty">Asia/Almaty — Алматы (UTC+6)</option>
              <option value="Asia/Aqtau">Asia/Aqtau — Актау (UTC+5)</option>
              <option value="Asia/Aqtobe">Asia/Aqtobe — Актобе (UTC+5)</option>
              <option value="Asia/Atyrau">Asia/Atyrau — Атырау (UTC+5)</option>
              <option value="Asia/Oral">Asia/Oral — Уральск (UTC+5)</option>
              <option value="Europe/Moscow">Europe/Moscow — Москва (UTC+3)</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <!-- Валюта -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Валюта
          </label>
          <div class="relative">
            <select
              v-model="form.currency"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            >
              <option value="KZT">KZT — Тенге (₸)</option>
              <option value="RUB">RUB — Рубль (₽)</option>
              <option value="USD">USD — Доллар ($)</option>
              <option value="EUR">EUR — Евро (€)</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <!-- Формат даты -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Формат даты
          </label>
          <div class="relative">
            <select
              v-model="form.date_format"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            >
              <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="handleReset"
            class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { ChevronDown, Loader2 } from 'lucide-vue-next'
import { useOrganizationProfile } from '@/composables/useOrganizationProfile'
import { useToast } from '@/composables/useToast'

const { organization, loading, fetchOrganization, updateSettings } = useOrganizationProfile()
const toast = useToast()

const saving = ref(false)

const form = reactive({
  timezone: 'Asia/Almaty',
  currency: 'KZT',
  date_format: 'DD.MM.YYYY',
})

watch(organization, (org) => {
  if (org) {
    form.timezone = org.settings?.timezone ?? 'Asia/Almaty'
    form.currency = org.settings?.currency ?? 'KZT'
    form.date_format = org.settings?.date_format ?? 'DD.MM.YYYY'
  }
})

function handleReset() {
  const org = organization.value
  form.timezone = org?.settings?.timezone ?? 'Asia/Almaty'
  form.currency = org?.settings?.currency ?? 'KZT'
  form.date_format = org?.settings?.date_format ?? 'DD.MM.YYYY'
}

async function handleSave() {
  saving.value = true
  try {
    await updateSettings({
      timezone: form.timezone,
      currency: form.currency,
      date_format: form.date_format,
    })
    toast.success('Настройки сохранены')
  } catch {
    toast.error('Ошибка при сохранении')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchOrganization())
</script>
