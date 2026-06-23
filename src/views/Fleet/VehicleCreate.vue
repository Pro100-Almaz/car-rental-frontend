<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <router-link
          to="/fleet"
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          <ArrowLeft class="h-4 w-4" />
        </router-link>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Новый автомобиль</h1>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div class="space-y-5 lg:col-span-2">

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Car class="h-5 w-5 text-brand-500" />
              Основная информация
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Марка <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.make"
                  type="text"
                  required
                  placeholder="Toyota"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Модель <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.model"
                  type="text"
                  required
                  placeholder="Camry"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Год <span class="text-error-500">*</span>
                </label>
                <input
                  v-model.number="form.year"
                  type="number"
                  required
                  placeholder="2024"
                  min="1990"
                  max="2030"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Гос. номер <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.license_plate"
                  type="text"
                  required
                  placeholder="123ABC02"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  VIN
                </label>
                <input
                  v-model="form.vin"
                  type="text"
                  placeholder="JTDBR32E740012345"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Цвет <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.color"
                  type="text"
                  required
                  placeholder="Белый"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название (никнейм)
                </label>
                <input
                  v-model="form.nickname"
                  type="text"
                  placeholder="Белая Камри"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Tag class="h-5 w-5 text-brand-500" />
              Классификация
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Категория <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.category"
                    required
                    class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="" disabled>Выберите категорию</option>
                    <option
                      v-for="cat in activeCategories"
                      :key="cat.id"
                      :value="cat.name"
                    >
                      {{ cat.name }}
                    </option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Тип топлива <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.fuel_type"
                    required
                    class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="" disabled>Выберите тип</option>
                    <option value="petrol">Бензин</option>
                    <option value="diesel">Дизель</option>
                    <option value="gas">Газ</option>
                    <option value="electric">Электро</option>
                    <option value="hybrid">Гибрид</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Коробка передач <span class="text-error-500">*</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="opt in transmissionOptions"
                    :key="opt.value"
                    :class="[
                      'cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                      form.transmission === opt.value
                        ? 'bg-brand-500 text-white shadow-theme-xs'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]',
                    ]"
                  >
                    <input
                      type="radio"
                      class="sr-only"
                      :value="opt.value"
                      v-model="form.transmission"
                    />
                    {{ opt.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Gauge class="h-5 w-5 text-brand-500" />
              Пробег и оборудование
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Текущий пробег (км)
                </label>
                <input
                  v-model.number="form.current_mileage"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID GPS-устройства
                </label>
                <input
                  v-model="form.gps_device_id"
                  type="text"
                  placeholder="GPS-001"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Users class="h-5 w-5 text-brand-500" />
              Инвестор
            </h2>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Инвестор
              </label>
              <div class="relative">
                <select
                  v-model="form.investor_id"
                  class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="">Без инвестора (собственный)</option>
                  <option v-for="inv in investors" :key="inv.id" :value="inv.id">{{ inv.full_name }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <CalendarDays class="h-5 w-5 text-brand-500" />
              Покупка и даты
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Цена покупки (₸)
                </label>
                <input
                  v-model.number="form.purchase_price"
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Дата покупки
                </label>
                <input
                  v-model="form.purchase_date"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Страховка до
                </label>
                <input
                  v-model="form.insurance_expiry"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Техосмотр до
                </label>
                <input
                  v-model="form.inspection_expiry"
                  type="date"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Banknote class="h-5 w-5 text-brand-500" />
              Цена за аренду
            </h2>
            <div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Цена дневного тарифа (₸)
                </label>
                <input
                  v-model.number="pricing_form.base_daily_rate"
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Действителен с:
                  </label>
                  <input
                    v-model="pricing_form.valid_from"
                    type="date"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Действителен до:
                  </label>
                  <input
                    v-model="pricing_form.valid_to"
                    type="date"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
              </div>

            </div>
          </div>

          <div
            v-if="submitError"
            class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            {{ submitError }}
          </div>

          <div class="flex items-center justify-end gap-3 pb-2">
            <router-link
              to="/fleet"
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
              {{ submitting ? 'Создание...' : 'Добавить автомобиль' }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Сводка</h2>

            <div class="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <div class="flex items-start gap-2.5">
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/10">
                  <Car class="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ previewName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ form.license_plate || '—' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700/50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Категория</span>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ categoryLabel || '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Цвет</span>
                <span class="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span
                    v-if="form.color"
                    class="inline-block h-2.5 w-2.5 rounded-full border border-gray-200 dark:border-gray-600"
                    :style="{ backgroundColor: colorDot }"
                  />
                  {{ form.color || '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">КПП</span>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ transmissionLabel || '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Топливо</span>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ fuelLabel || '—' }}
                </span>
              </div>
              <div v-if="form.purchase_price > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Цена покупки</span>
                <span class="tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ formatKZT(form.purchase_price) }}
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
import {
  ArrowLeft,
  Car,
  Tag,
  Gauge,
  CalendarDays,
  ChevronDown,
  Plus,
  Loader2,
  Users,
  Banknote
} from 'lucide-vue-next'
import { useVehicles } from '@/composables/useVehicles'
import { useVehicleCategories } from '@/composables/useVehicleCategories'
import { useInvestors } from '@/composables/useInvestors'
import { useToast } from '@/composables/useToast'
import { formatKZT } from '@/utils/currency'

const router = useRouter()
const { create, createRentalPrice } = useVehicles()
const { activeCategories, loading: categoriesLoading, fetchCategories } = useVehicleCategories()
const { investors, fetchAll: fetchInvestors, bindVehicle } = useInvestors()
const toast = useToast()

fetchCategories()
fetchInvestors()

const submitting = ref(false)
const submitError = ref('')

interface FormState {
  make: string
  model: string
  year: number | null
  license_plate: string
  vin: string
  color: string
  nickname: string
  category: string
  fuel_type: string
  transmission: 'manual' | 'automatic'
  current_mileage: number
  gps_device_id: string
  purchase_price: number
  purchase_date: string
  insurance_expiry: string
  inspection_expiry: string
  investor_id: string
}

const form = ref<FormState>({
  make: '',
  model: '',
  year: null,
  license_plate: '',
  vin: '',
  color: '',
  nickname: '',
  category: '',
  fuel_type: '',
  transmission: 'automatic',
  current_mileage: 0,
  gps_device_id: '',
  purchase_price: 0,
  purchase_date: '',
  insurance_expiry: '',
  inspection_expiry: '',
  investor_id: '',
})

interface PriceForm {
  vehicle_id: string
  base_daily_rate: number
  valid_from: string
  valid_to: string
}

const pricing_form = ref<PriceForm>({
  vehicle_id:'',
  base_daily_rate:0,
  valid_from:'',
  valid_to:'',
})


const transmissionOptions = [
  { value: 'manual', label: 'Механика' },
  { value: 'automatic', label: 'Автомат' },
] as const

const categoryLabel = computed(() => {
  const cat = activeCategories.value.find((c) => c.name === form.value.category)
  return cat?.name ?? ''
})

const fuelLabels: Record<string, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  gas: 'Газ',
  electric: 'Электро',
  hybrid: 'Гибрид',
}

const transmissionLabels: Record<string, string> = {
  manual: 'Механика',
  automatic: 'Автомат',
}

const colorDotMap: Record<string, string> = {
  белый: '#ffffff',
  черный: '#1a1a1a',
  чёрный: '#1a1a1a',
  серый: '#9ca3af',
  серебристый: '#d1d5db',
  красный: '#ef4444',
  синий: '#3b82f6',
  зеленый: '#22c55e',
  зелёный: '#22c55e',
  желтый: '#eab308',
  жёлтый: '#eab308',
  оранжевый: '#f97316',
  коричневый: '#92400e',
  бежевый: '#d4b896',
}

const previewName = computed(() => {
  const parts = [form.value.make.trim(), form.value.model.trim()].filter(Boolean)
  const name = parts.length ? parts.join(' ') : 'Марка и модель'
  return form.value.year ? `${name} ${form.value.year}` : name
})

const fuelLabel = computed(() => fuelLabels[form.value.fuel_type] ?? '')
const transmissionLabel = computed(() => transmissionLabels[form.value.transmission] ?? '')

const colorDot = computed(() => {
  const key = form.value.color.trim().toLowerCase()
  return colorDotMap[key] ?? '#9ca3af'
})

async function handleSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    const payload: Record<string, unknown> = {
      make: form.value.make.trim(),
      model: form.value.model.trim(),
      year: form.value.year,
      license_plate: form.value.license_plate.trim(),
      color: form.value.color.trim(),
      category: form.value.category,
      fuel_type: form.value.fuel_type,
      transmission: form.value.transmission,
      current_mileage: form.value.current_mileage,
    }

    if (form.value.vin.trim()) {
      payload.vin = form.value.vin.trim()
    }
    if (form.value.nickname.trim()) {
      payload.nickname = form.value.nickname.trim()
    }
    if (form.value.gps_device_id.trim()) {
      payload.gps_device_id = form.value.gps_device_id.trim()
    }
    if (form.value.purchase_price > 0) {
      payload.purchase_price = String(form.value.purchase_price)
    }
    if (form.value.purchase_date) {
      payload.purchase_date = form.value.purchase_date
    }
    if (form.value.insurance_expiry) {
      payload.insurance_expiry = form.value.insurance_expiry
    }
    if (form.value.inspection_expiry) {
      payload.inspection_expiry = form.value.inspection_expiry
    }

    const data = await create(payload)
    if (form.value.investor_id) {
      await bindVehicle(form.value.investor_id, data.id)
    }
    toast.success('Автомобиль добавлен')

    const pricing_payload: Record<string, unknown> = {
      vehicle_id: data.id,
      base_daily_rate:String(pricing_form.value.base_daily_rate),
      valid_from: pricing_form.value.valid_from.trim(),
      valid_to : pricing_form.value.valid_to.trim(),
      name: 'Default',
      multiplier: '1.00',
    }

    const pricing_data = await createRentalPrice(pricing_payload)

    router.push(`/fleet/${data.id}`)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    submitError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка при создании автомобиля. Попробуйте снова.'
    toast.error('Ошибка при добавлении автомобиля')
  } finally {
    submitting.value = false
  }
}
</script>
