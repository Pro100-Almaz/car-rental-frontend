<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Категории автомобилей</h1>
      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Добавить категорию
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="h-5 w-5 rounded skeleton-shimmer" />
        <div class="h-4 w-40 rounded skeleton-shimmer" />
        <div class="ml-auto h-4 w-16 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Category list -->
    <div v-else class="space-y-2">
      <div
        v-for="cat in categories"
        :key="cat.id"
        :class="[
          'flex items-center gap-4 rounded-2xl border bg-white p-4 transition-colors dark:bg-white/[0.03]',
          cat.is_active
            ? 'border-gray-200 dark:border-gray-800'
            : 'border-dashed border-gray-300 opacity-60 dark:border-gray-700',
        ]"
      >
        <GripVertical class="h-4 w-4 shrink-0 cursor-grab text-gray-300 dark:text-gray-600" />

        <div class="flex min-w-0 flex-1 items-center gap-3">
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
              cat.is_active
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
            ]"
          >
            {{ cat.sort_order }}
          </div>
          <span class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
            {{ cat.name }}
          </span>
          <span
            v-if="!cat.is_active"
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          >
            Скрыта
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button
            @click="toggleActive(cat)"
            :title="cat.is_active ? 'Скрыть' : 'Показать'"
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              cat.is_active
                ? 'text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            <Eye v-if="cat.is_active" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
          </button>
          <button
            @click="openEdit(cat)"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Редактировать"
          >
            <Pencil class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="categories.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Tag class="h-6 w-6 text-gray-400" />
        </div>
        <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет категорий</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Добавьте первую категорию для автомобилей</p>
      </div>
    </div>

    <!-- Create / Edit modal -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @mousedown.self="closeModal"
      >
        <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
          <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ editingCategory ? 'Редактировать категорию' : 'Новая категория' }}
          </h3>

          <form @submit.prevent="handleSave">
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="modalForm.name"
                  type="text"
                  required
                  placeholder="SUV"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Порядок сортировки
                </label>
                <input
                  v-model.number="modalForm.sort_order"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>

            <div
              v-if="modalError"
              class="mt-4 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
            >
              {{ modalError }}
            </div>

            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
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
                {{ saving ? 'Сохранение...' : editingCategory ? 'Сохранить' : 'Создать' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, GripVertical, Eye, EyeOff, Pencil, Tag, Loader2 } from 'lucide-vue-next'
import { useVehicleCategories } from '@/composables/useVehicleCategories'
import { useToast } from '@/composables/useToast'
import type { VehicleCategory } from '@/types'

const {
  categories,
  loading,
  fetchCategories,
  createCategory,
  updateCategory,
} = useVehicleCategories()

const toast = useToast()

onMounted(() => fetchCategories())

const modalOpen = ref(false)
const saving = ref(false)
const modalError = ref('')
const editingCategory = ref<VehicleCategory | null>(null)

const modalForm = ref({
  name: '',
  sort_order: 0,
})

function openCreate() {
  editingCategory.value = null
  modalForm.value = { name: '', sort_order: categories.value.length }
  modalError.value = ''
  modalOpen.value = true
}

function openEdit(cat: VehicleCategory) {
  editingCategory.value = cat
  modalForm.value = { name: cat.name, sort_order: cat.sort_order }
  modalError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingCategory.value = null
}

async function handleSave() {
  modalError.value = ''
  saving.value = true
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, {
        name: modalForm.value.name.trim(),
        sort_order: modalForm.value.sort_order,
      })
      toast.success('Категория обновлена')
    } else {
      await createCategory(modalForm.value.name.trim(), modalForm.value.sort_order)
      toast.success('Категория создана')
    }
    closeModal()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    modalError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка. Попробуйте снова.'
    toast.error('Ошибка при сохранении категории')
  } finally {
    saving.value = false
  }
}

async function toggleActive(cat: VehicleCategory) {
  try {
    await updateCategory(cat.id, { is_active: !cat.is_active })
    toast.success('Статус обновлён')
  } catch {
    toast.error('Ошибка при обновлении статуса')
  }
}
</script>
