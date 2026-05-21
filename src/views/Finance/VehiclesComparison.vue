<template>
  <div>
    <!-- Page header -->
    <div class="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Сравнение автомобилей</h1>
      <div class="flex items-center gap-2">
        <input
          v-model="selectedPeriod"
          type="month"
          @change="onPeriodChange"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
        <button
          @click="handleExport"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download class="h-4 w-4" />
          Экспорт
        </button>
      </div>
    </div>

    <!-- Skeleton loading -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="sticky left-0 bg-white px-5 py-3 dark:bg-gray-900">
                <div class="h-4 w-28 rounded skeleton-shimmer" />
              </th>
              <th v-for="i in 4" :key="i" class="px-5 py-3 text-center">
                <div class="mx-auto h-4 w-24 rounded skeleton-shimmer" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in 8"
              :key="i"
              class="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
            >
              <td class="sticky left-0 bg-white px-5 py-3 dark:bg-gray-900">
                <div class="h-4 w-32 rounded skeleton-shimmer" />
              </td>
              <td v-for="j in 4" :key="j" class="px-5 py-3 text-center">
                <div class="mx-auto h-4 w-20 rounded skeleton-shimmer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!vehiclesComparison || vehiclesComparison.vehicles.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <BarChart3 class="h-7 w-7 text-gray-400" />
      </div>
      <p class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        Нет данных за выбранный период
      </p>
    </div>

    <!-- Comparison table -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th
                class="sticky left-0 z-10 bg-white px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Показатель
              </th>
              <th
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                {{ vehicle.nickname || vehicle.license_plate }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Выручка -->
            <tr class="border-b border-gray-50 dark:border-gray-800/50">
              <td
                class="sticky left-0 z-10 bg-white px-5 py-3 text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                Выручка
              </td>
              <td
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                class="px-5 py-3 text-center tabular-nums text-sm text-success-600 dark:text-success-400"
              >
                {{ formatKZT(vehicle.total_revenue) }}
              </td>
            </tr>

            <!-- Expense category rows -->
            <tr
              v-for="category in vehiclesComparison.expense_categories"
              :key="category"
              class="border-b border-gray-50 dark:border-gray-800/50"
            >
              <td
                class="sticky left-0 z-10 bg-white px-5 py-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400"
              >
                {{ category }}
              </td>
              <td
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                class="px-5 py-3 text-center tabular-nums text-sm text-error-600 dark:text-error-400"
              >
                {{ formatKZT(expenseAmount(vehicle, category)) }}
              </td>
            </tr>

            <!-- Итого расходы -->
            <tr class="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
              <td
                class="sticky left-0 z-10 bg-gray-50/50 px-5 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                Итого расходы
              </td>
              <td
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                class="px-5 py-3 text-center tabular-nums text-sm font-semibold text-error-600 dark:text-error-400"
              >
                {{ formatKZT(vehicle.total_expenses) }}
              </td>
            </tr>

            <!-- Чистая прибыль -->
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td
                class="sticky left-0 z-10 bg-white px-5 py-3 text-sm font-bold text-gray-800 dark:bg-gray-900 dark:text-white/90"
              >
                Чистая прибыль
              </td>
              <td
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                :class="[
                  'px-5 py-3 text-center tabular-nums text-sm font-bold',
                  netProfitCellClass(vehicle.vehicle_id),
                  parseFloat(vehicle.net_profit) >= 0
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-error-600 dark:text-error-400',
                ]"
              >
                {{ formatKZT(vehicle.net_profit) }}
              </td>
            </tr>

            <!-- Утилизация -->
            <tr>
              <td
                class="sticky left-0 z-10 bg-white px-5 py-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400"
              >
                Утилизация
              </td>
              <td
                v-for="vehicle in vehiclesComparison.vehicles"
                :key="vehicle.vehicle_id"
                class="px-5 py-3 text-center tabular-nums text-sm text-gray-700 dark:text-gray-300"
              >
                {{ vehicle.utilization_percent }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, BarChart3 } from 'lucide-vue-next'
import { useReports } from '@/composables/useReports'
import type { VehicleComparisonItem } from '@/types'

const { vehiclesComparison, loading, fetchVehiclesComparison, exportReport } = useReports()

// ─── Period selector ──────────────────────────────────────────────────────────

function currentMonthValue(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const selectedPeriod = ref(currentMonthValue())

async function onPeriodChange() {
  await fetchVehiclesComparison({ period: selectedPeriod.value })
}

// ─── Export ───────────────────────────────────────────────────────────────────

async function handleExport() {
  await exportReport('vehicles-comparison', { period: selectedPeriod.value })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKZT(amount: string | number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

function expenseAmount(vehicle: VehicleComparisonItem, categoryName: string): string {
  const line = vehicle.expenses.find((e) => e.category_name === categoryName)
  return line?.amount ?? '0'
}

// ─── Net profit highlight ─────────────────────────────────────────────────────

const bestVehicleId = computed<string | null>(() => {
  if (!vehiclesComparison.value || vehiclesComparison.value.vehicles.length === 0) return null
  return vehiclesComparison.value.vehicles.reduce((best, v) =>
    parseFloat(v.net_profit) > parseFloat(best.net_profit) ? v : best,
  ).vehicle_id
})

const worstVehicleId = computed<string | null>(() => {
  if (!vehiclesComparison.value || vehiclesComparison.value.vehicles.length === 0) return null
  return vehiclesComparison.value.vehicles.reduce((worst, v) =>
    parseFloat(v.net_profit) < parseFloat(worst.net_profit) ? v : worst,
  ).vehicle_id
})

function netProfitCellClass(vehicleId: string): string {
  if (vehicleId === bestVehicleId.value) {
    return 'bg-success-50 dark:bg-success-500/10'
  }
  if (vehicleId === worstVehicleId.value) {
    return 'bg-error-50 dark:bg-error-500/10'
  }
  return ''
}

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  await fetchVehiclesComparison({ period: selectedPeriod.value })
})
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
