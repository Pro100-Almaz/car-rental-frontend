<template>
  <div>
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Профиль организации</h1>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="space-y-5">
        <!-- Name skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-24 rounded skeleton-shimmer" />
          <div class="h-10 w-full rounded-lg skeleton-shimmer" />
        </div>
        <!-- Address skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-20 rounded skeleton-shimmer" />
          <div class="h-10 w-full rounded-lg skeleton-shimmer" />
        </div>
        <!-- Phone + Email skeleton -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div class="mb-1.5 h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
          <div>
            <div class="mb-1.5 h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
        </div>
        <!-- Slug skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-12 rounded skeleton-shimmer" />
          <div class="h-10 w-full rounded-lg skeleton-shimmer" />
        </div>
        <!-- Plan + Created skeleton -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div class="mb-1.5 h-4 w-28 rounded skeleton-shimmer" />
            <div class="h-8 w-32 rounded-full skeleton-shimmer" />
          </div>
          <div>
            <div class="mb-1.5 h-4 w-24 rounded skeleton-shimmer" />
            <div class="h-5 w-40 rounded skeleton-shimmer" />
          </div>
        </div>
        <!-- Actions skeleton -->
        <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
          <div class="h-9 w-24 rounded-lg skeleton-shimmer" />
          <div class="h-9 w-28 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- Form card -->
    <div
      v-else
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <form @submit.prevent="handleSave">
        <div class="space-y-5">
          <!-- Название -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Название <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Название организации"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            />
          </div>

          <!-- Адрес -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Адрес
            </label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Адрес организации"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            />
          </div>

          <!-- Телефон + Email -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Телефон
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="+7 (700) 000-00-00"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="org@example.com"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
              />
            </div>
          </div>

          <!-- Slug (read-only) -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug
            </label>
            <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/60">
              <Link2 class="h-4 w-4 shrink-0 text-gray-400" />
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ organization?.slug ?? '—' }}</span>
            </div>
          </div>

          <!-- Тарифный план + Дата создания -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Тарифный план
              </label>
              <div class="mt-1">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <BadgeCheck class="h-3.5 w-3.5" />
                  {{ organization?.subscription_plan ?? '—' }}
                </span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Дата регистрации
              </label>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ formattedCreatedAt }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="saveError"
          class="mt-5 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
        >
          {{ saveError }}
        </div>

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
          <button
            type="button"
            @click="resetForm"
            :disabled="saving"
            class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
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
import { ref, computed, watch, onMounted } from 'vue'
import { Loader2, Link2, BadgeCheck } from 'lucide-vue-next'
import { useOrganizationProfile } from '@/composables/useOrganizationProfile'
import { useToast } from '@/composables/useToast'

const { organization, loading, fetchOrganization, updateProfile } = useOrganizationProfile()
const toast = useToast()

// Reactive form state
const form = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
})

const saving = ref(false)
const saveError = ref('')

// Formatted created_at date
const formattedCreatedAt = computed(() => {
  if (!organization.value?.created_at) return '—'
  return new Date(organization.value.created_at).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
})

// Sync form whenever organization data loads or changes
watch(
  organization,
  (org) => {
    if (!org) return
    form.value = {
      name: org.name ?? '',
      address: org.settings?.address ?? '',
      phone: org.settings?.phone ?? '',
      email: org.settings?.email ?? '',
    }
  },
  { immediate: true },
)

function resetForm() {
  const org = organization.value
  if (!org) return
  form.value = {
    name: org.name ?? '',
    address: org.settings?.address ?? '',
    phone: org.settings?.phone ?? '',
    email: org.settings?.email ?? '',
  }
  saveError.value = ''
}

async function handleSave() {
  saveError.value = ''
  saving.value = true
  try {
    await updateProfile({
      name: form.value.name.trim(),
      settings: {
        address: form.value.address.trim() || null,
        phone: form.value.phone.trim() || null,
        email: form.value.email.trim() || null,
      },
    })
    toast.success('Профиль сохранён')
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    saveError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка. Попробуйте снова.'
    toast.error('Ошибка при сохранении')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchOrganization()
})
</script>
