<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Автопарк</h1>
      <router-link
        to="/fleet/add"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Добавить авто
      </router-link>
    </div>

    <!-- Filters bar -->
    <div
      class="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="relative min-w-[200px] flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию, номеру..."
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
        />
      </div>
      <div class="relative min-w-[140px]">
        <select
          v-model="statusFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        >
          <option value="">Все статусы</option>
          <option value="available">Свободен</option>
          <option value="rented">В аренде</option>
          <option value="reserved">Забронирован</option>
          <option value="returning">Возврат</option>
          <option value="in_service">На ТО</option>
          <option value="in_wash">На мойке</option>
          <option value="decommissioned">Списан</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div class="relative min-w-[140px]">
        <select
          v-model="categoryFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        >
          <option value="">Все категории</option>
          <option v-for="cat in activeCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div class="relative min-w-[140px]">
        <select
          v-model="fuelFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        >
          <option value="">Все типы топлива</option>
          <option value="petrol">Бензин</option>
          <option value="diesel">Дизель</option>
          <option value="gas">Газ</option>
          <option value="electric">Электро</option>
          <option value="hybrid">Гибрид</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div class="relative min-w-[140px]">
        <select
          v-model="investorFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        >
          <option value="">Все инвесторы</option>
          <option v-for="inv in investors" :key="inv.id" :value="inv.id">{{ inv.full_name }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model.number="mileageFrom"
          type="number"
          min="0"
          placeholder="Пробег от"
          class="w-28 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-2 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        />
        <span class="text-xs text-gray-400">—</span>
        <input
          v-model.number="mileageTo"
          type="number"
          min="0"
          placeholder="до"
          class="w-28 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-2 text-sm text-gray-700 tabular-nums outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
        />
      </div>
    </div>

    <!-- Status stat pills -->
    <div class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="stat in statusStats"
        :key="stat.status"
        @click="statusFilter = statusFilter === stat.status ? '' : stat.status"
        :class="[
          'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150',
          statusFilter === stat.status
            ? 'border-brand-300 bg-brand-50 text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/5 dark:text-brand-400'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600',
        ]"
      >
        <span :class="['h-2 w-2 rounded-full', stat.dot]" />
        <span>{{ stat.label }}</span>
        <span class="tabular-nums text-xs font-medium">{{ stat.count }}</span>
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading">
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div class="flex gap-4">
            <div class="h-4 w-24 rounded skeleton-shimmer" />
            <div class="h-4 w-20 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 border-b border-gray-50 px-5 py-4 last:border-0 dark:border-gray-800/50">
          <div class="h-10 w-10 shrink-0 rounded-lg skeleton-shimmer" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-40 rounded skeleton-shimmer" />
            <div class="h-3 w-28 rounded skeleton-shimmer" />
          </div>
          <div class="h-4 w-16 rounded skeleton-shimmer" />
          <div class="h-6 w-20 rounded-full skeleton-shimmer" />
          <div class="h-4 w-20 rounded skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- Vehicle table -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Авто</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Категория</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Пробег</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Топливо</th>
              <th class="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 lg:table-cell">Инвестор</th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vehicle in filteredVehicles"
              :key="vehicle.id"
              class="group cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
              @click="$router.push(`/fleet/${vehicle.id}`)"
            >
              <!-- Авто -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <CarFront class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                      {{ vehicle.nickname || `${vehicle.make} ${vehicle.model}` }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ vehicle.make }} {{ vehicle.model }} {{ vehicle.year }} · {{ vehicle.license_plate }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Категория -->
              <td class="px-5 py-4">
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ vehicle.category }}</span>
              </td>

              <!-- Статус -->
              <td class="px-5 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    vehicleStatusStyle(vehicle.status),
                  ]"
                >
                  <span :class="['h-1.5 w-1.5 rounded-full', vehicleStatusDot(vehicle.status)]" />
                  {{ vehicleStatusLabel(vehicle.status) }}
                </span>
              </td>

              <!-- Пробег -->
              <td class="px-5 py-4">
                <span class="tabular-nums text-sm text-gray-700 dark:text-gray-300">
                  {{ formatNumber(vehicle.current_mileage) }} км
                </span>
              </td>

              <!-- Топливо -->
              <td class="px-5 py-4">
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ fuelTypeLabel(vehicle.fuel_type) }}</span>
              </td>

              <!-- Инвестор -->
              <td class="hidden px-5 py-4 lg:table-cell">
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ vehicleInvestorName(vehicle.id) }}</span>
              </td>

              <!-- Действия -->
              <td class="px-5 py-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    @click="$router.push(`/fleet/${vehicle.id}`)"
                    title="Просмотр"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="Редактировать"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredVehicles.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <CarFront class="h-6 w-6 text-gray-400" />
        </div>
        <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Автомобили не найдены</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Добавьте первый автомобиль в парк</p>
        <router-link
          to="/fleet/add"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          <Plus class="h-4 w-4" />
          Добавить авто
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Plus, Search, CarFront, ChevronDown, Eye, Pencil } from 'lucide-vue-next'
import { useVehicles } from '@/composables/useVehicles'
import { useVehicleCategories } from '@/composables/useVehicleCategories'
import { useInvestors } from '@/composables/useInvestors'
import { formatNumber } from '@/utils/currency'
import { vehicleStatusLabel, vehicleStatusDot, vehicleStatusStyle } from '@/utils/status'
import type { VehicleStatus } from '@/types'

const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const fuelFilter = ref('')
const investorFilter = ref('')
const mileageFrom = ref<number | null>(null)
const mileageTo = ref<number | null>(null)

const { vehicles, loading, fetchAll } = useVehicles()
const { activeCategories, fetchCategories } = useVehicleCategories()
const { investors, fetchAll: fetchInvestors } = useInvestors()

onMounted(() => {
  fetchAll()
  fetchCategories()
  fetchInvestors()
})

watch(investorFilter, () => {
  const filters: Record<string, unknown> = {}
  if (investorFilter.value) filters.investor_id = investorFilter.value
  fetchAll(filters)
})

const filteredVehicles = computed(() => {
  return vehicles.value.filter((v) => {
    const displayName = v.nickname || `${v.make} ${v.model}`
    const matchesSearch =
      !searchQuery.value ||
      displayName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.license_plate.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || v.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || v.category === categoryFilter.value
    const matchesFuel = !fuelFilter.value || v.fuel_type === fuelFilter.value
    const matchesMileageFrom = mileageFrom.value === null || v.current_mileage >= mileageFrom.value
    const matchesMileageTo = mileageTo.value === null || v.current_mileage <= mileageTo.value
    return matchesSearch && matchesStatus && matchesCategory && matchesFuel && matchesMileageFrom && matchesMileageTo
  })
})

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  gas: 'Газ',
  electric: 'Электро',
  hybrid: 'Гибрид',
}

function fuelTypeLabel(type: string): string {
  return FUEL_LABELS[type] ?? (type || '—')
}

function vehicleInvestorName(_vehicleId: string): string {
  return '—'
}

const statusStats = computed(() => {
  const counts: Record<string, number> = {}
  vehicles.value.forEach((v) => { counts[v.status] = (counts[v.status] || 0) + 1 })
  return [
    { status: 'available',      label: 'Свободен',    count: counts['available'] || 0,      dot: 'bg-success-500' },
    { status: 'rented',         label: 'В аренде',    count: counts['rented'] || 0,          dot: 'bg-error-500' },
    { status: 'reserved',       label: 'Бронь',       count: counts['reserved'] || 0,        dot: 'bg-warning-500' },
    { status: 'returning',      label: 'Возврат',     count: counts['returning'] || 0,       dot: 'bg-orange-500' },
    { status: 'in_service',     label: 'На ТО',       count: counts['in_service'] || 0,      dot: 'bg-blue-light-500' },
    { status: 'in_wash',        label: 'На мойке',    count: counts['in_wash'] || 0,         dot: 'bg-blue-light-500' },
    { status: 'decommissioned', label: 'Списан',      count: counts['decommissioned'] || 0,  dot: 'bg-gray-400' },
  ]
})

</script>
