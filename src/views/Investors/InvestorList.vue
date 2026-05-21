<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Инвесторы и партнёры</h1>
      <button
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Добавить инвестора
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select
        v-model="filterType"
        class="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        @change="applyFilters"
      >
        <option value="">Все</option>
        <option value="own">Собственный</option>
        <option value="partner">Партнёр</option>
        <option value="shared">Совместный</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-5 flex items-start gap-3">
          <div class="h-11 w-11 shrink-0 rounded-full skeleton-shimmer" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-36 rounded skeleton-shimmer" />
            <div class="h-3 w-24 rounded skeleton-shimmer" />
          </div>
          <div class="h-6 w-20 rounded-full skeleton-shimmer" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="j in 3" :key="j" class="h-16 rounded-xl skeleton-shimmer" />
        </div>
        <div class="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div class="h-7 w-20 rounded-lg skeleton-shimmer" />
          <div class="h-7 w-28 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="investors.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Landmark class="h-6 w-6 text-gray-400" />
      </div>
      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет инвесторов</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">Добавьте первого инвестора или партнёра</p>
    </div>

    <!-- Investor cards grid -->
    <div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div
        v-for="investor in investors"
        :key="investor.id"
        class="group rounded-2xl border border-gray-200 bg-white p-5 transition-shadow duration-200 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <!-- Card header -->
        <div class="mb-5 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
            >
              {{ investor.full_name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-base font-semibold text-gray-800 dark:text-white/90">
                {{ investor.full_name }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ investor.contact_phone || '—' }}
              </p>
            </div>
          </div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              typeStyle(investor.type_),
            ]"
          >
            {{ typeLabel(investor.type_) }}
          </span>
        </div>

        <!-- KPI stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">Доход</p>
            <p class="mt-1 tabular-nums text-sm font-bold text-success-600 dark:text-success-400">—</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">К выплате</p>
            <p class="mt-1 tabular-nums text-sm font-bold text-gray-800 dark:text-white/90">—</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <p class="text-xs text-gray-500 dark:text-gray-400">Авто</p>
            <p class="mt-1 tabular-nums text-sm font-bold text-gray-800 dark:text-white/90">—</p>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            @click="router.push({ name: 'InvestorDetail', params: { id: investor.id } })"
          >
            <Eye class="h-3.5 w-3.5" />
            Просмотр
          </button>
          <button
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            @click="openEdit(investor)"
          >
            <Pencil class="h-3.5 w-3.5" />
            Редактировать
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
          <!-- Modal header -->
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white/90">
              {{ editingId ? 'Редактировать инвестора' : 'Добавить инвестора' }}
            </h2>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              @click="closeModal"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- full_name -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                ФИО <span class="text-error-500">*</span>
              </label>
              <input
                v-model="form.full_name"
                type="text"
                required
                placeholder="Иванов Иван Иванович"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-brand-500"
              />
            </div>

            <!-- type_ -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Тип <span class="text-error-500">*</span>
              </label>
              <select
                v-model="form.type_"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
              >
                <option value="" disabled>Выберите тип</option>
                <option value="own">Собственный</option>
                <option value="partner">Партнёр</option>
                <option value="shared">Совместный</option>
              </select>
            </div>

            <!-- contact_phone -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Телефон
              </label>
              <input
                v-model="form.contact_phone"
                type="text"
                placeholder="+7 777 000 00 00"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-brand-500"
              />
            </div>

            <!-- contact_email -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                v-model="form.contact_email"
                type="email"
                placeholder="investor@example.com"
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-brand-500"
              />
            </div>

            <!-- notes -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Заметки
              </label>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Дополнительная информация..."
                class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-brand-500"
              />
            </div>

            <!-- Error message -->
            <p v-if="formError" class="text-xs text-error-500">{{ formError }}</p>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                @click="closeModal"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
              >
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ editingId ? 'Сохранить' : 'Создать' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Landmark, Eye, Pencil, X, Loader2 } from 'lucide-vue-next'
import { useInvestors } from '@/composables/useInvestors'
import { useToast } from '@/composables/useToast'
import type { Investor, InvestorType } from '@/types'

const router = useRouter()
const { investors, loading, fetchAll, create, update } = useInvestors()
const toast = useToast()

// --- Filters ---
const filterType = ref<InvestorType | ''>('')

function applyFilters() {
  const filters: Record<string, unknown> = {}
  if (filterType.value) filters.type_ = filterType.value
  fetchAll(filters)
}

onMounted(() => fetchAll())

// --- Type helpers ---
function typeLabel(type: InvestorType): string {
  const map: Record<InvestorType, string> = {
    own: 'Собственный',
    partner: 'Партнёр',
    shared: 'Долевой',
  }
  return map[type] ?? type
}

function typeStyle(type: InvestorType): string {
  const map: Record<InvestorType, string> = {
    own: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    partner: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    shared: 'bg-theme-purple-500/10 text-theme-purple-500',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}

// --- Modal state ---
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')

interface FormState {
  full_name: string
  type_: InvestorType | ''
  contact_phone: string
  contact_email: string
  notes: string
}

const form = reactive<FormState>({
  full_name: '',
  type_: '',
  contact_phone: '',
  contact_email: '',
  notes: '',
})

function resetForm() {
  form.full_name = ''
  form.type_ = ''
  form.contact_phone = ''
  form.contact_email = ''
  form.notes = ''
  formError.value = ''
  editingId.value = null
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(investor: Investor) {
  resetForm()
  editingId.value = investor.id
  form.full_name = investor.full_name
  form.type_ = investor.type_
  form.contact_phone = investor.contact_phone ?? ''
  form.contact_email = investor.contact_email ?? ''
  form.notes = investor.notes ?? ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

async function handleSubmit() {
  if (!form.type_) {
    formError.value = 'Выберите тип инвестора'
    return
  }

  saving.value = true
  formError.value = ''

  const payload: Record<string, unknown> = {
    full_name: form.full_name,
    type_: form.type_,
    contact_phone: form.contact_phone || null,
    contact_email: form.contact_email || null,
    notes: form.notes || null,
  }

  try {
    if (editingId.value) {
      await update(editingId.value, payload)
      toast.success('Данные обновлены')
    } else {
      await create(payload)
      toast.success('Инвестор добавлен')
    }
    closeModal()
    applyFilters()
  } catch {
    formError.value = 'Произошла ошибка. Попробуйте ещё раз.'
    toast.error('Ошибка при сохранении')
  } finally {
    saving.value = false
  }
}
</script>
