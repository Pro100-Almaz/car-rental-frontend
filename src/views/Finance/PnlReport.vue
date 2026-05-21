<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
        ОПиУ (Отчёт о прибылях и убытках)
      </h1>
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

    <!-- P&L Card: skeleton -->
    <div
      v-if="loading"
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="space-y-3">
        <div v-for="i in 18" :key="i" class="flex items-center justify-between">
          <div
            :class="[
              'rounded skeleton-shimmer',
              i % 5 === 0 ? 'h-5 w-48' : 'h-4 w-40',
              i % 3 === 1 ? 'ml-6' : '',
            ]"
          />
          <div
            :class="[
              'rounded skeleton-shimmer',
              i % 5 === 0 ? 'h-5 w-28' : 'h-4 w-24',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!pnl"
      class="rounded-2xl border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileText class="h-7 w-7 text-gray-400" />
        </div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Нет данных за выбранный период
        </p>
      </div>
    </div>

    <!-- P&L Statement -->
    <div
      v-else
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <!-- Period label -->
      <p class="mb-5 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Период: {{ pnl.period_from }} — {{ pnl.period_to }}
      </p>

      <div class="space-y-1">
        <!-- Revenue -->
        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-semibold text-gray-800 dark:text-white/90">Выручка</span>
          <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ fmt(pnl.total_revenue) }}
          </span>
        </div>

        <div class="flex items-baseline justify-between py-1">
          <span class="text-sm text-gray-600 dark:text-gray-400">− Возвраты и скидки</span>
          <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
            {{ fmt(pnl.returns_and_discounts) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-1 dark:border-gray-700" />

        <!-- Net revenue -->
        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-bold text-gray-900 dark:text-white">Чистая выручка</span>
          <span class="tabular-nums text-sm font-bold text-gray-900 dark:text-white">
            {{ fmt(pnl.net_revenue) }}
          </span>
        </div>

        <!-- Spacing -->
        <div class="py-1" />

        <!-- Direct expenses header -->
        <div class="py-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Прямые расходы:
          </span>
        </div>

        <div
          v-for="line in pnl.direct_expenses"
          :key="line.category_id ?? line.category_name"
          class="flex items-baseline justify-between py-1 pl-6"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ line.category_name }}</span>
          <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
            {{ fmt(line.amount) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-1 dark:border-gray-700" />

        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-semibold text-gray-800 dark:text-white/90">Итого прямые расходы</span>
          <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ fmt(pnl.total_direct_expenses) }}
          </span>
        </div>

        <!-- Marginal profit -->
        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-bold text-gray-900 dark:text-white">Маржинальная прибыль</span>
          <span
            :class="[
              'tabular-nums text-sm font-bold',
              profitColor(pnl.marginal_profit),
            ]"
          >
            {{ fmt(pnl.marginal_profit) }}
          </span>
        </div>

        <!-- Spacing -->
        <div class="py-1" />

        <!-- Overhead expenses header -->
        <div class="py-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Накладные расходы:
          </span>
        </div>

        <div
          v-for="line in pnl.overhead_expenses"
          :key="line.category_id ?? line.category_name"
          class="flex items-baseline justify-between py-1 pl-6"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ line.category_name }}</span>
          <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
            {{ fmt(line.amount) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-1 dark:border-gray-700" />

        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-semibold text-gray-800 dark:text-white/90">Итого накладные</span>
          <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ fmt(pnl.total_overhead_expenses) }}
          </span>
        </div>

        <!-- Operating profit -->
        <div class="flex items-baseline justify-between py-1.5">
          <span class="text-sm font-bold text-gray-900 dark:text-white">Операционная прибыль</span>
          <span
            :class="[
              'tabular-nums text-sm font-bold',
              profitColor(pnl.operating_profit),
            ]"
          >
            {{ fmt(pnl.operating_profit) }}
          </span>
        </div>

        <!-- Spacing -->
        <div class="py-1" />

        <div class="flex items-baseline justify-between py-1">
          <span class="text-sm text-gray-600 dark:text-gray-400">− Налоги</span>
          <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
            {{ fmt(pnl.taxes) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-1 dark:border-gray-700" />

        <!-- Net profit -->
        <div class="flex items-baseline justify-between py-2">
          <span class="text-base font-bold text-gray-900 dark:text-white">Чистая прибыль</span>
          <span
            :class="[
              'tabular-nums text-base font-bold',
              profitColor(pnl.net_profit),
            ]"
          >
            {{ fmt(pnl.net_profit) }}
          </span>
        </div>

        <!-- Spacing -->
        <div class="py-1" />

        <div class="flex items-baseline justify-between py-1">
          <span class="text-sm text-gray-600 dark:text-gray-400">− Выплаты инвесторам</span>
          <span class="tabular-nums text-sm text-gray-600 dark:text-gray-400">
            {{ fmt(pnl.investor_payouts) }}
          </span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-1 dark:border-gray-700" />

        <!-- Retained profit -->
        <div class="flex items-baseline justify-between py-2">
          <span class="text-base font-bold text-gray-900 dark:text-white">Нераспределённая прибыль</span>
          <span
            :class="[
              'tabular-nums text-base font-bold',
              profitColor(pnl.retained_profit),
            ]"
          >
            {{ fmt(pnl.retained_profit) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, FileText } from 'lucide-vue-next'
import { useReports } from '@/composables/useReports'
import { formatKZT } from '@/utils/currency'
import type { CompanyPnl, ExpenseCategoryLine } from '@/types'

// Suppress unused type warning — types are used implicitly via the composable ref
type _Unused = CompanyPnl | ExpenseCategoryLine

const { pnl, loading, fetchPnl, exportReport } = useReports()

// ─── Period ───────────────────────────────────────────────────────────────────

function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const selectedPeriod = ref(currentMonth())

async function onPeriodChange() {
  await fetchPnl({ period: selectedPeriod.value })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: string | number): string {
  return formatKZT(Number(amount))
}

function profitColor(amount: string | number): string {
  return Number(amount) >= 0
    ? 'text-success-600 dark:text-success-400'
    : 'text-error-600 dark:text-error-400'
}

// ─── Export ───────────────────────────────────────────────────────────────────

async function handleExport() {
  await exportReport('pnl', { period: selectedPeriod.value })
}

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  await fetchPnl({ period: selectedPeriod.value })
})
</script>

<style>
@media print {
  .no-print { display: none !important; }
}
</style>
