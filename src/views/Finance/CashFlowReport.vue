<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
        Cash Flow <span class="font-normal text-gray-500 dark:text-gray-400">(Движение денежных средств)</span>
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <!-- Date range -->
        <input
          v-model="dateFrom"
          type="date"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
        <span class="text-sm text-gray-400">—</span>
        <input
          v-model="dateTo"
          type="date"
          class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />

        <!-- Apply button -->
        <button
          @click="handleApply"
          :disabled="loading"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          Применить
        </button>

        <!-- Export button -->
        <button
          @click="handleExport"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download class="h-4 w-4" />
          Экспорт
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Начальный остаток -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Начальный остаток</p>
        <template v-if="loading">
          <div class="h-8 w-36 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-gray-800 dark:text-white/90">
          {{ cashFlow ? formatKZT(summaryValue(cashFlow, 'opening_balance')) : '—' }}
        </p>
      </div>

      <!-- Поступления -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Поступления</p>
        <template v-if="loading">
          <div class="h-8 w-36 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-success-600 dark:text-success-400">
          {{ cashFlow ? formatKZT(summaryValue(cashFlow, 'total_income')) : '—' }}
        </p>
      </div>

      <!-- Расходы -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Расходы</p>
        <template v-if="loading">
          <div class="h-8 w-36 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-error-600 dark:text-error-400">
          {{ cashFlow ? formatKZT(summaryValue(cashFlow, 'total_expense')) : '—' }}
        </p>
      </div>

      <!-- Конечный остаток -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Конечный остаток</p>
        <template v-if="loading">
          <div class="h-8 w-36 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
          {{ cashFlow ? formatKZT(summaryValue(cashFlow, 'closing_balance')) : '—' }}
        </p>
      </div>
    </div>

    <!-- Skeleton table -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <!-- Skeleton thead -->
      <div class="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
        <div class="flex gap-6">
          <div class="h-3.5 w-16 rounded skeleton-shimmer" />
          <div class="h-3.5 w-28 rounded skeleton-shimmer" />
          <div class="h-3.5 w-24 rounded skeleton-shimmer" />
          <div class="h-3.5 w-20 rounded skeleton-shimmer" />
        </div>
      </div>
      <!-- Skeleton rows -->
      <div
        v-for="i in 10"
        :key="i"
        class="flex items-center gap-4 border-b border-gray-50 px-4 py-3 last:border-0 dark:border-gray-800/50"
      >
        <div class="h-4 w-24 rounded skeleton-shimmer" />
        <div class="h-4 w-32 rounded skeleton-shimmer" />
        <div class="h-4 w-28 rounded skeleton-shimmer" />
        <div class="h-4 w-24 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!cashFlow"
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <BarChart2 class="h-7 w-7 text-gray-400" />
      </div>
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Нет данных за выбранный период</p>
    </div>

    <!-- Daily breakdown table -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Дата
              </th>
              <th class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Поступления
              </th>
              <th class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Расходы
              </th>
              <th class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Нетто
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty daily breakdown -->
            <tr v-if="cashFlow.daily_breakdown.length === 0">
              <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">
                Нет данных за выбранный период
              </td>
            </tr>

            <tr
              v-for="day in cashFlow.daily_breakdown"
              :key="day.date"
              class="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
            >
              <!-- Дата -->
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {{ formatDateDMY(day.date) }}
              </td>

              <!-- Поступления -->
              <td class="px-4 py-3 text-sm tabular-nums font-medium text-success-600 dark:text-success-400">
                {{ formatKZT(parseFloat(day.income)) }}
              </td>

              <!-- Расходы -->
              <td class="px-4 py-3 text-sm tabular-nums font-medium text-error-600 dark:text-error-400">
                {{ formatKZT(parseFloat(day.expense)) }}
              </td>

              <!-- Нетто -->
              <td
                class="px-4 py-3 text-sm tabular-nums font-semibold"
                :class="netClass(day)"
              >
                {{ netPrefix(day) }}{{ formatKZT(parseFloat(day.net)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, BarChart2 } from 'lucide-vue-next'
import { useReports } from '@/composables/useReports'
import { formatKZT } from '@/utils/currency'
import type { CashFlow, CashFlowDay } from '@/types'

const { cashFlow, loading, fetchCashFlow, exportReport } = useReports()

function netClass(day: CashFlowDay): string {
  return parseFloat(day.net) >= 0
    ? 'text-success-600 dark:text-success-400'
    : 'text-error-600 dark:text-error-400'
}

function netPrefix(day: CashFlowDay): string {
  return parseFloat(day.net) >= 0 ? '+' : ''
}

function summaryValue(cf: CashFlow, key: keyof Pick<CashFlow, 'opening_balance' | 'total_income' | 'total_expense' | 'closing_balance'>): number {
  return parseFloat(cf[key])
}

// ─── Date range ───────────────────────────────────────────────────────────────

function currentMonthStart(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function currentMonthEnd(): string {
  const d = new Date()
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`
}

const dateFrom = ref(currentMonthStart())
const dateTo = ref(currentMonthEnd())

// ─── Actions ──────────────────────────────────────────────────────────────────

async function handleApply() {
  await fetchCashFlow({ from: dateFrom.value, to: dateTo.value })
}

async function handleExport() {
  await exportReport('cash-flow', { from: dateFrom.value, to: dateTo.value })
}

// ─── Date formatter (DD.MM.YYYY) ──────────────────────────────────────────────

function formatDateDMY(date: string): string {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(() => {
  fetchCashFlow({ from: dateFrom.value, to: dateTo.value })
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
