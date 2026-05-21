<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Мои инвестиции</h1>

      <!-- Period selector -->
      <div class="flex items-center gap-2">
        <input
          v-model="selectedPeriod"
          type="month"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
        <button
          @click="applyPeriod"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          <RefreshCw class="h-4 w-4" />
          Применить
        </button>
      </div>
    </div>

    <!-- Summary cards skeleton -->
    <div v-if="loading" class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-2 h-4 w-24 rounded skeleton-shimmer" />
        <div class="h-8 w-36 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Summary cards -->
    <div v-else-if="dashboard" class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Доход -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Доход</p>
        <p class="tabular-nums text-2xl font-bold tracking-tight text-success-600 dark:text-success-400">
          {{ formatKZT(dashboard.total_revenue) }}
        </p>
      </div>

      <!-- Расходы -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Расходы</p>
        <p class="tabular-nums text-2xl font-bold tracking-tight text-error-600 dark:text-error-400">
          {{ formatKZT(dashboard.total_expenses) }}
        </p>
      </div>

      <!-- Чистая прибыль -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Чистая прибыль</p>
        <p class="tabular-nums text-2xl font-bold tracking-tight text-gray-800 dark:text-white/90">
          {{ formatKZT(dashboard.total_net_profit) }}
        </p>
      </div>

      <!-- Моя доля -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Моя доля</p>
        <p class="tabular-nums text-2xl font-bold tracking-tight text-brand-500">
          {{ formatKZT(dashboard.total_investor_share) }}
        </p>
      </div>
    </div>

    <!-- Per-vehicle table skeleton -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
        <div class="flex gap-6">
          <div v-for="j in 7" :key="j" class="h-4 w-20 rounded skeleton-shimmer" />
        </div>
      </div>
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-center gap-4 border-b border-gray-50 px-5 py-3.5 last:border-0 dark:border-gray-800/50"
      >
        <div v-for="j in 7" :key="j" class="h-4 w-20 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Per-vehicle breakdown table -->
    <div
      v-else-if="dashboard && dashboard.vehicles.length > 0"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Авто ID
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Доход
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Расходы
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Прибыль
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Доля %
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Моя доля
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Загрузка %
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in dashboard.vehicles"
              :key="row.vehicle_id"
              class="border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
            >
              <td class="px-5 py-3">
                <span class="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {{ row.vehicle_id.slice(0, 8) }}…
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-medium text-success-600 dark:text-success-400">
                  {{ formatKZT(row.total_revenue) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-medium text-error-600 dark:text-error-400">
                  {{ formatKZT(row.total_expenses) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
                  {{ formatKZT(row.net_profit) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
                  {{ row.share_percentage }}%
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-semibold text-brand-500">
                  {{ formatKZT(row.investor_share) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
                  {{ row.utilization_percent }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <TrendingUp class="h-6 w-6 text-gray-400" />
      </div>
      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет данных за выбранный период</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">Выберите другой месяц и нажмите «Применить»</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, TrendingUp } from 'lucide-vue-next'
import { useInvestorPortal } from '@/composables/useInvestorPortal'
import { formatKZT } from '@/utils/currency'

const { dashboard, loading, fetchDashboard } = useInvestorPortal()

// Default to current month: 2026-05
function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const selectedPeriod = ref(currentMonth())

function applyPeriod() {
  fetchDashboard({ period: selectedPeriod.value })
}

onMounted(() => {
  fetchDashboard()
})
</script>
