<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <router-link
          to="/rentals"
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 shadow-theme-xs transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          <ArrowLeft class="h-4 w-4" />
        </router-link>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          Новое бронирование
        </h1>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <!-- Left column: form sections -->
        <div class="space-y-5 lg:col-span-2">

          <!-- 1. Client & Vehicle Selection -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Users class="h-5 w-5 text-brand-500" />
              Клиент и автомобиль
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Client select -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Клиент <span class="text-error-500">*</span>
                </label>
                <SearchSelect
                  v-model="form.client_id"
                  :options="clientOptions"
                  :loading="loadingClients"
                  placeholder="Поиск клиента..."
                />
              </div>

              <!-- Vehicle select -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Автомобиль <span class="text-error-500">*</span>
                </label>
                <SearchSelect
                  v-model="form.vehicle_id"
                  :options="vehicleOptions"
                  :loading="loadingVehicles"
                  placeholder="Поиск автомобиля..."
                />
              </div>
            </div>
          </div>

          <!-- 2. Schedule -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <CalendarDays class="h-5 w-5 text-brand-500" />
              Расписание
            </h2>

            <!-- Booking type radio -->
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Тип бронирования
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="bt in bookingTypes"
                  :key="bt.value"
                  type="button"
                  @click="onBookingTypeChange(bt.value)"
                  :class="[
                    'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    form.booking_type === bt.value
                      ? 'bg-brand-500 text-white shadow-theme-xs'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]',
                  ]"
                >
                  {{ bt.label }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Start datetime -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Начало <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.scheduled_start"
                  type="datetime-local"
                  required
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- End datetime -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Конец <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.scheduled_end"
                  type="datetime-local"
                  required
                  :min="form.scheduled_start"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <!-- Duration badge -->
            <div v-if="durationLabel" class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <CalendarDays class="h-3.5 w-3.5" />
              {{ durationLabel }}
            </div>
          </div>

          <!-- 3. Pricing -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <CreditCard class="h-5 w-5 text-brand-500" />
              Ценообразование
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Base rate -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Базовая ставка (₸)
                </label>
                <input
                  v-model.number="form.base_rate"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="15000"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Rate type (auto) -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Тип ставки
                </label>
                <div class="relative">
                  <select
                    v-model="form.rate_type"
                    class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="per_hour">За час</option>
                    <option value="per_day">За день</option>
                    <option value="per_week">За неделю</option>
                    <option value="per_month">За месяц</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <!-- Discount code -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Код скидки
                </label>
                <input
                  v-model="form.discount_code"
                  type="text"
                  placeholder="SUMMER10"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 uppercase outline-none transition-colors placeholder:text-gray-400 placeholder:normal-case focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Discount amount -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Сумма скидки (₸)
                </label>
                <input
                  v-model.number="form.discount_amount"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <!-- Estimated total (read-only) -->
            <div class="mt-4 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Расчётная сумма</span>
                <span class="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">
                  {{ formatKZT(estimatedTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 4. Payment -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              <CreditCard class="h-5 w-5 text-brand-500" />
              Оплата и депозит
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Deposit type -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Тип депозита
                </label>
                <div class="relative">
                  <select
                    v-model="form.deposit_type"
                    class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="cash">Наличные</option>
                    <option value="card_hold">Удержание на карте</option>
                    <option value="kaspi">Каспи</option>
                    <option value="debt">Долг</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <!-- Deposit amount -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Сумма депозита (₸)
                </label>
                <input
                  v-model.number="form.deposit_amount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="50000"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Prepayment amount -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Предоплата (₸)
                </label>
                <input
                  v-model.number="form.prepayment_amount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Prepayment status -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Статус предоплаты
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="ps in prepaymentStatuses"
                    :key="ps.value"
                    type="button"
                    @click="form.prepayment_status = ps.value"
                    :class="[
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      form.prepayment_status === ps.value
                        ? 'bg-brand-500 text-white shadow-theme-xs'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]',
                    ]"
                  >
                    {{ ps.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Notes -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Примечания
            </h2>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Дополнительные пожелания или заметки..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            />
          </div>

          <!-- Error message -->
          <div
            v-if="submitError"
            class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            {{ submitError }}
          </div>

          <!-- Form actions -->
          <div class="flex items-center justify-end gap-3 pb-2">
            <router-link
              to="/rentals"
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
              {{ submitting ? 'Создание...' : 'Создать бронь' }}
            </button>
          </div>
        </div>

        <!-- Right column: Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Сводка
            </h2>

            <!-- Selected vehicle -->
            <div v-if="selectedVehicle" class="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <div class="flex items-start gap-2.5">
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/10">
                  <CarFront class="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ selectedVehicle.make }} {{ selectedVehicle.model }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ selectedVehicle.license_plate }} · {{ selectedVehicle.year }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="mb-4 rounded-xl border border-dashed border-gray-200 p-3 text-center text-xs text-gray-400 dark:border-gray-700">
              Автомобиль не выбран
            </div>

            <!-- Selected client -->
            <div v-if="selectedClient" class="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <div class="flex items-start gap-2.5">
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/10">
                  <Users class="h-4 w-4 text-success-600 dark:text-success-400" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ selectedClient.last_name }} {{ selectedClient.first_name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedClient.phone }}</p>
                </div>
              </div>
            </div>
            <div v-else class="mb-4 rounded-xl border border-dashed border-gray-200 p-3 text-center text-xs text-gray-400 dark:border-gray-700">
              Клиент не выбран
            </div>

            <!-- Cost breakdown -->
            <div class="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700/50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  Ставка
                </span>
                <span class="tabular-nums text-gray-700 dark:text-gray-300">
                  {{ form.base_rate > 0 ? formatKZT(form.base_rate) : '—' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Длительность</span>
                <span class="tabular-nums text-gray-700 dark:text-gray-300">{{ durationLabel || '—' }}</span>
              </div>
              <div v-if="form.discount_amount > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Скидка</span>
                <span class="tabular-nums text-success-600 dark:text-success-400">
                  −{{ formatKZT(form.discount_amount) }}
                </span>
              </div>
              <div v-if="form.deposit_amount > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Депозит</span>
                <span class="tabular-nums text-gray-700 dark:text-gray-300">
                  {{ formatKZT(form.deposit_amount) }}
                </span>
              </div>
              <div v-if="form.prepayment_amount > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Предоплата</span>
                <span class="tabular-nums text-gray-700 dark:text-gray-300">
                  {{ formatKZT(form.prepayment_amount) }}
                </span>
              </div>
            </div>

            <div class="mt-4 rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-500/10">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-brand-700 dark:text-brand-300">Итого</span>
                <span class="text-xl font-bold tabular-nums text-brand-700 dark:text-brand-300">
                  {{ formatKZT(estimatedTotal) }}
                </span>
              </div>
              <div v-if="form.prepayment_amount > 0 && estimatedTotal > 0" class="mt-1 flex items-center justify-between">
                <span class="text-xs text-brand-500 dark:text-brand-400">Остаток</span>
                <span class="text-sm tabular-nums font-medium text-brand-600 dark:text-brand-400">
                  {{ formatKZT(Math.max(0, estimatedTotal - form.prepayment_amount)) }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  Users,
  CreditCard,
  Plus,
  Loader2,
  ChevronDown,
} from 'lucide-vue-next'
import { useVehicles } from '@/composables/useVehicles'
import { useClients } from '@/composables/useClients'
import { useRentals } from '@/composables/useRentals'
import { useToast } from '@/composables/useToast'
import { formatKZT } from '@/utils/currency'
import { useAuthStore } from '@/stores/auth'

import SearchSelect from '@/components/ui/SearchSelect.vue'
import type { SearchSelectOption } from '@/components/ui/SearchSelect.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const { vehicles, loading: loadingVehicles, fetchAll: fetchVehicles } = useVehicles()
const { clients, loading: loadingClients, fetchAll: fetchClients } = useClients()
const { create } = useRentals()
const toast = useToast()

const submitting = ref(false)
const submitError = ref('')

// ─── Form state ────────────────────────────────────────────────────────────
interface FormState {
  vehicle_id: string
  client_id: string
  booking_type: 'hourly' | 'daily' | 'weekly' | 'monthly'
  scheduled_start: string
  scheduled_end: string
  base_rate: number
  rate_type: 'per_hour' | 'per_day' | 'per_week' | 'per_month'
  discount_code: string
  discount_amount: number
  deposit_type: 'cash' | 'card_hold' | 'kaspi' | 'debt'
  deposit_amount: number
  prepayment_amount: number
  prepayment_status: 'none' | 'partial' | 'full'
  notes: string
}

const form = ref<FormState>({
  vehicle_id: '',
  client_id: '',
  booking_type: 'daily',
  scheduled_start: '',
  scheduled_end: '',
  base_rate: 0,
  rate_type: 'per_day',
  discount_code: '',
  discount_amount: 0,
  deposit_type: 'kaspi',
  deposit_amount: 0,
  prepayment_amount: 0,
  prepayment_status: 'none',
  notes: '',
})

// ─── Enum options ───────────────────────────────────────────────────────────
const bookingTypes = [
  { value: 'hourly', label: 'Почасово' },
  { value: 'daily', label: 'Посуточно' },
  { value: 'weekly', label: 'Понедельно' },
  { value: 'monthly', label: 'Помесячно' },
] as const

const prepaymentStatuses = [
  { value: 'none', label: 'Нет' },
  { value: 'partial', label: 'Частично' },
  { value: 'full', label: 'Полная' },
] as const

const bookingTypeToRateType: Record<string, FormState['rate_type']> = {
  hourly: 'per_hour',
  daily: 'per_day',
  weekly: 'per_week',
  monthly: 'per_month',
}

function onBookingTypeChange(value: FormState['booking_type']) {
  form.value.booking_type = value
  form.value.rate_type = bookingTypeToRateType[value]
}

// ─── Computed helpers ───────────────────────────────────────────────────────
const availableVehicles = computed(() =>
  vehicles.value.filter((v) => v.status === 'available'),
)

const clientOptions = computed<SearchSelectOption[]>(() =>
  clients.value.map((c) => ({
    id: c.id,
    label: `${c.last_name} ${c.first_name}`,
    secondary: c.phone,
  })),
)

const vehicleOptions = computed<SearchSelectOption[]>(() =>
  availableVehicles.value.map((v) => ({
    id: v.id,
    label: `${v.make} ${v.model} ${v.year}`,
    secondary: `${v.license_plate} · ${v.color}`,
    icon: CarFront,
  })),
)

const selectedVehicle = computed(() =>
  vehicles.value.find((v) => v.id === form.value.vehicle_id) ?? null,
)

const selectedClient = computed(() =>
  clients.value.find((c) => c.id === form.value.client_id) ?? null,
)

/** Returns { hours, days, weeks, months } between scheduled_start and scheduled_end */
const duration = computed(() => {
  if (!form.value.scheduled_start || !form.value.scheduled_end) return null
  const start = new Date(form.value.scheduled_start)
  const end = new Date(form.value.scheduled_end)
  const diffMs = end.getTime() - start.getTime()
  if (diffMs <= 0) return null
  const hours = diffMs / (1000 * 60 * 60)
  const days = hours / 24
  const weeks = days / 7
  const months = days / 30
  return { hours, days, weeks, months }
})

const durationLabel = computed(() => {
  if (!duration.value) return ''
  const { hours, days, weeks, months } = duration.value
  const bt = form.value.booking_type
  if (bt === 'hourly') return `${Math.round(hours)} ч`
  if (bt === 'daily') {
    const d = Math.round(days)
    return `${d} ${plural(d, 'день', 'дня', 'дней')}`
  }
  if (bt === 'weekly') {
    const w = Math.round(weeks)
    return `${w} ${plural(w, 'неделя', 'недели', 'недель')}`
  }
  if (bt === 'monthly') {
    const m = Math.round(months)
    return `${m} ${plural(m, 'месяц', 'месяца', 'месяцев')}`
  }
  return ''
})

const estimatedTotal = computed(() => {
  const d = duration.value
  const rate = form.value.base_rate
  if (!d || rate <= 0) return 0

  let units = 0
  const bt = form.value.booking_type
  if (bt === 'hourly') units = Math.ceil(d.hours)
  else if (bt === 'daily') units = Math.ceil(d.days)
  else if (bt === 'weekly') units = Math.ceil(d.weeks)
  else if (bt === 'monthly') units = Math.ceil(d.months)

  const gross = units * rate
  const discount = form.value.discount_amount ?? 0
  return Math.max(0, gross - discount)
})

// ─── Utilities ──────────────────────────────────────────────────────────────
function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100
  const rem = abs % 10
  if (abs > 10 && abs < 20) return many
  if (rem === 1) return one
  if (rem >= 2 && rem <= 4) return few
  return many
}

/** Formats datetime-local value to ISO 8601 with +06:00 offset */
function toISO(local: string): string {
  if (!local) return ''
  // datetime-local gives "YYYY-MM-DDTHH:mm" — append seconds + KZ offset
  return `${local}:00+06:00`
}

// ─── Query param pre-fill ───────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    fetchVehicles(),
    fetchClients(),
  ])

  const vehicleParam = route.query.vehicle as string | undefined
  const dateParam = route.query.date as string | undefined

  if (vehicleParam) {
    form.value.vehicle_id = vehicleParam
  }

  if (dateParam) {
    // dateParam is YYYY-MM-DD — set as start of day
    form.value.scheduled_start = `${dateParam}T10:00`
    // default: +1 day for daily booking
    const nextDay = new Date(`${dateParam}T10:00`)
    nextDay.setDate(nextDay.getDate() + 1)
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = nextDay.getFullYear()
    const mo = pad(nextDay.getMonth() + 1)
    const d = pad(nextDay.getDate())
    form.value.scheduled_end = `${y}-${mo}-${d}T10:00`
  }
})

// ─── Submit ─────────────────────────────────────────────────────────────────
async function handleSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    const payload: Record<string, unknown> = {
      vehicle_id: form.value.vehicle_id,
      client_id: form.value.client_id,
      manager_id: auth.user?.id ?? null,
      booking_type: form.value.booking_type,
      scheduled_start: toISO(form.value.scheduled_start),
      scheduled_end: toISO(form.value.scheduled_end),
      base_rate: String(form.value.base_rate),
      rate_type: form.value.rate_type,
      estimated_total: String(estimatedTotal.value),
      deposit_type: form.value.deposit_type,
      deposit_amount: String(form.value.deposit_amount),
      prepayment_amount: String(form.value.prepayment_amount),
      prepayment_status: form.value.prepayment_status,
    }

    if (form.value.discount_code.trim()) {
      payload.discount_code = form.value.discount_code.trim().toUpperCase()
    }
    if (form.value.discount_amount > 0) {
      payload.discount_amount = String(form.value.discount_amount)
    }
    if (form.value.notes.trim()) {
      payload.notes = form.value.notes.trim()
    }

    const data = await create(payload)
    toast.success('Бронирование создано')
    router.push(`/rentals/${data.id}`)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    submitError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка при создании брони. Попробуйте снова.'
    toast.error('Ошибка при создании бронирования')
  } finally {
    submitting.value = false
  }
}
</script>
