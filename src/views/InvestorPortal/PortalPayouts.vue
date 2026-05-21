<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Мои выплаты</h1>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
        <div class="flex gap-6">
          <div v-for="j in 5" :key="j" class="h-4 w-24 rounded skeleton-shimmer" />
        </div>
      </div>
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-6 border-b border-gray-50 px-5 py-3.5 last:border-0 dark:border-gray-800/50"
      >
        <div class="h-4 w-24 rounded skeleton-shimmer" />
        <div class="h-4 w-32 rounded skeleton-shimmer" />
        <div class="h-4 w-32 rounded skeleton-shimmer" />
        <div class="h-5 w-24 rounded-full skeleton-shimmer" />
        <div class="h-4 w-24 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Payouts table -->
    <div
      v-else-if="payouts.length > 0"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Период
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Расчётная прибыль
              </th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Моя доля
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Статус
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Дата выплаты
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="payout in payouts"
              :key="payout.id"
              class="border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
            >
              <td class="px-5 py-3">
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ formatPeriodMonth(payout.period_month) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm text-gray-700 dark:text-gray-300">
                  {{ formatKZT(payout.calculated_profit) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-semibold text-brand-500">
                  {{ formatKZT(payout.share_amount) }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span :class="statusClass(payout.status)">
                  {{ statusLabel(payout.status) }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ payout.paid_at ? formatDate(payout.paid_at) : 'Ожидает' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Wallet class="h-6 w-6 text-gray-400" />
      </div>
      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет выплат</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">История выплат появится здесь</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Wallet } from 'lucide-vue-next'
import { useInvestorPortal } from '@/composables/useInvestorPortal'
import { formatKZT } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import type { PayoutStatus } from '@/types'

const { payouts, loading, fetchPayouts } = useInvestorPortal()

function formatPeriodMonth(periodMonth: string): string {
  // periodMonth is expected as "YYYY-MM" or "YYYY-MM-DD"
  const [year, month] = periodMonth.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('ru-KZ', { month: 'long', year: 'numeric' })
}

function statusLabel(status: PayoutStatus): string {
  const map: Record<PayoutStatus, string> = {
    calculated: 'Рассчитано',
    approved: 'Утверждено',
    paid: 'Выплачено',
  }
  return map[status] ?? status
}

function statusClass(status: PayoutStatus): string {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  const variants: Record<PayoutStatus, string> = {
    calculated: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    approved: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    paid: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  }
  return `${base} ${variants[status] ?? 'bg-gray-100 text-gray-600'}`
}

onMounted(() => {
  fetchPayouts()
})
</script>
