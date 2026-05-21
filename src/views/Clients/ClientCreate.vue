<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <router-link
          to="/clients"
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          <ArrowLeft class="h-4 w-4" />
        </router-link>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Новый клиент</h1>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div class="space-y-5 lg:col-span-2">
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <User class="h-5 w-5 text-brand-500" />
              Личные данные
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Имя <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.first_name"
                  type="text"
                  required
                  placeholder="Алмаз"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Фамилия <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.last_name"
                  type="text"
                  required
                  placeholder="Аманжолов"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Телефон <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="+7 701 234 5678"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="client@example.com"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <FileText class="h-5 w-5 text-brand-500" />
              Документы
            </h2>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Документы можно загрузить позже
            </p>
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Удостоверение личности (URL)
                </label>
                <input
                  v-model="form.id_document_url"
                  type="text"
                  placeholder="URL"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Лицевая сторона прав (URL)
                </label>
                <input
                  v-model="form.license_front_url"
                  type="text"
                  placeholder="URL"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Обратная сторона прав (URL)
                </label>
                <input
                  v-model="form.license_back_url"
                  type="text"
                  placeholder="URL"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Примечания
            </h2>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Дополнительные заметки о клиенте..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <div
            v-if="submitError"
            class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            {{ submitError }}
          </div>

          <div class="flex items-center justify-end gap-3 pb-2">
            <router-link
              to="/clients"
              class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
            >
              Отмена
            </router-link>
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
              <Plus v-else class="h-4 w-4" />
              {{ submitting ? 'Создание...' : 'Создать клиента' }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Сводка</h2>

            <div class="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <div class="flex items-start gap-2.5">
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  {{ previewInitial }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ previewName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ form.phone || '—' }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    {{ form.email || '—' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700/50">
              <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Документы
              </p>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Удостоверение</span>
                <span
                  :class="form.id_document_url ? 'text-success-600 dark:text-success-400' : 'text-gray-400 dark:text-gray-500'"
                  class="text-xs font-medium"
                >
                  {{ form.id_document_url ? 'Загружен' : 'Не загружен' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Права (лицо)</span>
                <span
                  :class="form.license_front_url ? 'text-success-600 dark:text-success-400' : 'text-gray-400 dark:text-gray-500'"
                  class="text-xs font-medium"
                >
                  {{ form.license_front_url ? 'Загружен' : 'Не загружен' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Права (обрат.)</span>
                <span
                  :class="form.license_back_url ? 'text-success-600 dark:text-success-400' : 'text-gray-400 dark:text-gray-500'"
                  class="text-xs font-medium"
                >
                  {{ form.license_back_url ? 'Загружен' : 'Не загружен' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, FileText, Plus, Loader2 } from 'lucide-vue-next'
import { useClients } from '@/composables/useClients'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { create } = useClients()
const toast = useToast()

const submitting = ref(false)
const submitError = ref('')

interface FormState {
  first_name: string
  last_name: string
  phone: string
  email: string
  id_document_url: string
  license_front_url: string
  license_back_url: string
  notes: string
}

const form = ref<FormState>({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  id_document_url: '',
  license_front_url: '',
  license_back_url: '',
  notes: '',
})

const previewName = computed(() => {
  const parts = [form.value.first_name.trim(), form.value.last_name.trim()].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Имя не указано'
})

const previewInitial = computed(() => {
  const name = form.value.first_name.trim() || form.value.last_name.trim()
  return name ? name.charAt(0).toUpperCase() : '?'
})

async function handleSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    const payload: Record<string, unknown> = {
      first_name: form.value.first_name.trim(),
      last_name: form.value.last_name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim() || null,
    }

    if (form.value.id_document_url.trim()) {
      payload.id_document_url = form.value.id_document_url.trim()
    }
    if (form.value.license_front_url.trim()) {
      payload.license_front_url = form.value.license_front_url.trim()
    }
    if (form.value.license_back_url.trim()) {
      payload.license_back_url = form.value.license_back_url.trim()
    }
    if (form.value.notes.trim()) {
      payload.metadata = { notes: form.value.notes.trim() }
    }

    const data = await create(payload)
    toast.success('Клиент создан')
    router.push(`/clients/${data.id}`)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    submitError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка при создании клиента. Попробуйте снова.'
    toast.error('Ошибка при создании клиента')
  } finally {
    submitting.value = false
  }
}
</script>
