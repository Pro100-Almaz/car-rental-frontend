<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          Панель управления
        </h1>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ todayFormatted }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <!-- Month selector -->
        <div class="inline-flex items-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <button
            @click="prevMonth"
            class="flex h-[42px] w-[42px] items-center justify-center rounded-l-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
            :aria-label="'Предыдущий месяц'"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <span class="min-w-[110px] select-none px-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ currentMonthLabel }}
          </span>
          <button
            @click="nextMonth"
            :disabled="isCurrentMonth"
            class="flex h-[42px] w-[42px] items-center justify-center rounded-r-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
            :aria-label="'Следующий месяц'"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
        <!-- Refresh button -->
        <button
          @click="fetchAll"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]"
        >
          <RefreshCw :class="['h-4 w-4', loading && 'animate-spin']" />
          Обновить
        </button>
        <!-- Last updated -->
        <span
          v-if="lastRefreshed"
          class="text-xs text-gray-400 dark:text-gray-500"
        >
          Обновлено: {{ formatLastRefreshed(lastRefreshed) }}
        </span>
        <!-- New rental button -->
        <router-link
          to="/rentals/create"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          <Plus class="h-4 w-4" />
          Новое бронирование
        </router-link>
      </div>
    </div>

    <!-- Skeleton: first load -->
    <template v-if="loading && kpis === null">
      <!-- KPI skeleton -->
      <div class="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-6">
        <div
          v-for="i in 6"
          :key="i"
          class="h-28 rounded-2xl border border-gray-200 bg-white skeleton-shimmer dark:border-gray-800 dark:bg-white/[0.03]"
        />
      </div>
      <!-- Fleet bar skeleton -->
      <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="h-3 w-32 rounded skeleton-shimmer mb-4" />
        <div class="h-3 w-full rounded-full skeleton-shimmer" />
      </div>
      <!-- Chart + alerts skeleton -->
      <div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="col-span-1 h-80 rounded-2xl border border-gray-200 bg-white skeleton-shimmer dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-2" />
        <div class="col-span-1 h-80 rounded-2xl border border-gray-200 bg-white skeleton-shimmer dark:border-gray-800 dark:bg-white/[0.03]" />
      </div>
    </template>

    <!-- Loaded content -->
    <template v-else>
      <!-- KPI Cards -->
      <div class="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-6">
        <KPICard
          title="Выручка"
          :value="kpis ? formatKZT(Number(kpis.total_revenue.value)) : '—'"
          :change="kpis ? kpiChange(kpis.total_revenue) : undefined"
          icon-bg="bg-brand-50 dark:bg-brand-500/10"
          icon-color="text-brand-600 dark:text-brand-400"
        >
          <template #icon><TrendingUp class="h-6 w-6" /></template>
        </KPICard>

        <KPICard
          title="Расходы"
          :value="kpis ? formatKZT(Number(kpis.total_expenses.value)) : '—'"
          :change="kpis ? kpiChange(kpis.total_expenses) : undefined"
          icon-bg="bg-error-50 dark:bg-error-500/10"
          icon-color="text-error-600 dark:text-error-400"
        >
          <template #icon><TrendingDown class="h-6 w-6" /></template>
        </KPICard>

        <KPICard
          title="Чистая прибыль"
          :value="kpis ? formatKZT(Number(kpis.net_profit.value)) : '—'"
          :change="kpis ? kpiChange(kpis.net_profit) : undefined"
          icon-bg="bg-success-50 dark:bg-success-500/10"
          icon-color="text-success-600 dark:text-success-400"
        >
          <template #icon><DollarSign class="h-6 w-6" /></template>
        </KPICard>

        <KPICard
          title="Загрузка"
          :value="kpis ? String(kpis.fleet_utilization.value) + '%' : '—'"
          :change="kpis ? kpiChange(kpis.fleet_utilization) : undefined"
          icon-bg="bg-warning-50 dark:bg-warning-500/10"
          icon-color="text-warning-600 dark:text-warning-400"
        >
          <template #icon><Gauge class="h-6 w-6" /></template>
        </KPICard>

        <KPICard
          title="Активные аренды"
          :value="kpis ? String(kpis.active_rentals_count.value) : '—'"
          :change="kpis ? kpiChange(kpis.active_rentals_count) : undefined"
          icon-bg="bg-blue-light-50 dark:bg-blue-light-500/10"
          icon-color="text-blue-light-600 dark:text-blue-light-400"
        >
          <template #icon><CalendarDays class="h-6 w-6" /></template>
        </KPICard>

        <KPICard
          title="Задолженности"
          :value="kpis ? formatKZT(Number(kpis.outstanding_debts.value)) : '—'"
          :change="kpis ? kpiChange(kpis.outstanding_debts) : undefined"
          icon-bg="bg-error-50 dark:bg-error-500/10"
          icon-color="text-error-600 dark:text-error-400"
        >
          <template #icon><CreditCard class="h-6 w-6" /></template>
        </KPICard>
      </div>

      <!-- Fleet Status Bar -->
      <div
        v-if="kpis && kpis.fleet_status.total > 0"
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Состояние автопарка</p>
        <div class="flex h-3 overflow-hidden rounded-full">
          <div
            v-for="seg in fleetSegments"
            :key="seg.key"
            :style="{ width: seg.pct + '%', background: seg.color }"
            :title="seg.label + ': ' + seg.count"
          />
        </div>
        <div class="mt-3 flex flex-wrap gap-4">
          <div
            v-for="seg in fleetSegments.filter(s => s.count > 0)"
            :key="seg.key"
            class="flex items-center gap-1.5"
          >
            <span
              class="h-2.5 w-2.5 shrink-0 rounded-full"
              :style="{ background: seg.color }"
            />
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ seg.label }}</span>
            <span class="text-xs font-medium text-gray-800 dark:text-white/80">{{ seg.count }}</span>
          </div>
        </div>
      </div>

      <!-- Revenue chart + Alerts -->
      <div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <!-- Revenue chart (2/3) -->
        <div
          class="col-span-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-2"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Выручка за неделю
            </h3>
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                {{ weekTotal }}
              </span>
              <div class="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  @click="prevWeek"
                  class="flex h-8 w-8 items-center justify-center rounded-l-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                  aria-label="Предыдущая неделя"
                >
                  <ChevronLeft class="h-3.5 w-3.5" />
                </button>
                <span class="min-w-[140px] select-none px-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ weekRangeLabel }}
                </span>
                <button
                  @click="nextWeek"
                  :disabled="isCurrentWeek"
                  class="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                  aria-label="Следующая неделя"
                >
                  <ChevronRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div @wheel.prevent="() => {}">
            <apexchart
              class="w-full"
              type="area"
              height="280"
              width="95%"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <!-- Alerts panel (1/3) -->
        <div
          class="col-span-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Оповещения</h3>
            <span
              v-if="alerts && alerts.total_alerts > 0"
              class="min-w-[18px] rounded-full bg-error-500 px-2 py-0.5 text-center text-[10px] font-medium text-white"
            >
              {{ alerts.total_alerts }}
            </span>
          </div>

          <!-- Empty state -->
          <div
            v-if="!alerts || alerts.total_alerts === 0"
            class="flex flex-col items-center justify-center py-8 text-center"
          >
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CheckCircle2 class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет оповещений</p>
          </div>

          <div v-else class="space-y-1 overflow-y-auto max-h-[340px]">
            <!-- Overdue returns -->
            <template v-if="alerts.overdue_returns.length > 0">
              <p class="mb-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-error-500">
                Просроченные возвраты
              </p>
              <div
                v-for="item in alerts.overdue_returns"
                :key="item.rental_id"
                class="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                @click="router.push('/rentals/' + item.rental_id)"
              >
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error-50 dark:bg-error-500/10">
                  <Clock class="h-4 w-4 text-error-600 dark:text-error-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ item.vehicle_nickname ?? item.license_plate }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.client_name }} · {{ item.days_overdue }} дн. просрочки
                  </p>
                </div>
              </div>
            </template>

            <!-- Expiring documents -->
            <template v-if="alerts.expiring_documents.length > 0">
              <p class="mb-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-warning-500">
                Истекающие документы
              </p>
              <div
                v-for="item in alerts.expiring_documents"
                :key="item.vehicle_id + item.document_type"
                class="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                @click="router.push('/fleet/' + item.vehicle_id)"
              >
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-50 dark:bg-warning-500/10">
                  <Shield class="h-4 w-4 text-warning-600 dark:text-warning-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ item.vehicle_nickname ?? item.license_plate }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ docTypeLabel(item.document_type) }} · через {{ item.days_remaining }} дн.
                  </p>
                </div>
              </div>
            </template>

            <!-- Clients with debt -->
            <template v-if="alerts.clients_with_debt.length > 0">
              <p class="mb-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-orange-500">
                Клиенты с долгом
              </p>
              <div
                v-for="item in alerts.clients_with_debt"
                :key="item.client_id"
                class="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                @click="router.push('/clients/' + item.client_id)"
              >
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                  <CreditCard class="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ item.client_name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatKZT(Number(item.debt_balance)) }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Active Rentals Table -->
      <div
        class="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Активные аренды</h3>
          <router-link
            to="/rentals"
            class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Все аренды →
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Автомобиль</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Клиент</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Возврат</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Осталось</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!activeRentals || activeRentals.active_rentals.length === 0">
                <td colspan="4" class="px-5 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <CalendarDays class="h-6 w-6 text-gray-400" />
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Нет активных аренд</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="rental in activeRentals?.active_rentals ?? []"
                :key="rental.rental_id"
                class="cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
                @click="router.push('/rentals/' + rental.rental_id)"
              >
                <td class="px-5 py-4">
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ rental.vehicle_nickname ?? rental.license_plate }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">{{ rental.license_plate }}</p>
                </td>
                <td class="px-5 py-4">
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ rental.client_name }}</p>
                </td>
                <td class="px-5 py-4">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ formatReturnDate(rental.scheduled_end) }}
                  </p>
                </td>
                <td class="px-5 py-4">
                  <span :class="remainingClass(rental.hours_remaining)">
                    {{ remainingLabel(rental.hours_remaining) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Returns today sub-section -->
        <div
          v-if="activeRentals && activeRentals.returns_today_count > 0"
          class="border-t border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <p class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Возвраты сегодня: {{ activeRentals.returns_today_count }}
          </p>
          <div class="space-y-2">
            <div
              v-for="item in activeRentals.returns_today"
              :key="item.rental_id"
              class="flex items-center gap-3 text-sm"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-warning-500" />
              <span class="font-medium text-gray-800 dark:text-white/80">
                {{ item.vehicle_nickname ?? item.license_plate }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">{{ item.client_name }}</span>
              <span class="ml-auto text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                {{ formatReturnDate(item.scheduled_end) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <router-link
          v-for="action in quickActions"
          :key="action.path"
          :to="action.path"
          class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
        >
          <div :class="['flex h-10 w-10 items-center justify-center rounded-lg', action.iconBg]">
            <component :is="action.icon" :class="['h-5 w-5', action.iconColor]" />
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ action.label }}</span>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gauge,
  CalendarDays,
  CreditCard,
  RefreshCw,
  Plus,
  Clock,
  Shield,
  CheckCircle2,
  Users,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { useDashboard } from '@/composables/useDashboard'
import { formatKZT } from '@/utils/currency'
import type { KpiValue, ExpiringDocumentAlert } from '@/types'
import KPICard from './KPICard.vue'

const router = useRouter()
const {
  kpis, alerts, activeRentals, revenueChart, loading, period, lastRefreshed,
  fetchAll, fetchKpis, fetchRevenueChart,
} = useDashboard()

// Month navigator helpers
const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const currentMonthLabel = computed(() => {
  const [y, m] = period.value.split('-').map(Number)
  return `${MONTH_NAMES_RU[m - 1]} ${y}`
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return period.value === current
})

function prevMonth() {
  const [y, m] = period.value.split('-').map(Number)
  const d = new Date(y, m - 2, 1) // go back one month
  period.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth() {
  if (isCurrentMonth.value) return
  const [y, m] = period.value.split('-').map(Number)
  const d = new Date(y, m, 1) // advance one month
  period.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

watch(period, () => Promise.all([fetchKpis(), fetchRevenueChart()]))

const todayFormatted = new Date().toLocaleDateString('ru-KZ', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatLastRefreshed(d: Date): string {
  return d.toLocaleString('ru-KZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function kpiChange(kpi: KpiValue): number | undefined {
  return kpi.change_percent !== null ? Number(kpi.change_percent) : undefined
}

// Fleet status segments
const fleetSegments = computed(() => {
  const fs = kpis.value?.fleet_status
  if (!fs || fs.total === 0) return []
  const total = fs.total
  return [
    { key: 'available', label: 'Свободно',   count: fs.available,   color: '#22c55e', pct: (fs.available   / total) * 100 },
    { key: 'rented',    label: 'Арендовано', count: fs.rented,      color: '#3b82f6', pct: (fs.rented      / total) * 100 },
    { key: 'reserved',  label: 'Резерв',     count: fs.reserved,    color: '#f59e0b', pct: (fs.reserved    / total) * 100 },
    { key: 'service',   label: 'На ТО',      count: fs.in_service,  color: '#ef4444', pct: (fs.in_service  / total) * 100 },
    { key: 'other',     label: 'Другое',     count: fs.other,       color: '#9ca3af', pct: (fs.other       / total) * 100 },
  ]
})

// Week navigation for revenue chart
const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const weekOffset = ref(0)

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

const currentWeekMonday = computed(() => {
  const mon = getMonday(new Date())
  mon.setDate(mon.getDate() + weekOffset.value * 7)
  return mon
})

const currentWeekSunday = computed(() => {
  const sun = new Date(currentWeekMonday.value)
  sun.setDate(sun.getDate() + 6)
  return sun
})

const isCurrentWeek = computed(() => weekOffset.value >= 0)

watch(currentWeekMonday, (mon) => {
  const newPeriod = `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, '0')}`
  if (period.value !== newPeriod) {
    period.value = newPeriod
  }
})

function prevWeek() { weekOffset.value-- }
function nextWeek() { if (!isCurrentWeek.value) weekOffset.value++ }

const weekRangeLabel = computed(() => {
  const fmt = (d: Date) => d.toLocaleDateString('ru-KZ', { day: 'numeric', month: 'short' })
  return `${fmt(currentWeekMonday.value)} – ${fmt(currentWeekSunday.value)}`
})

// Revenue chart data — filter monthly API data to selected week
const chartData = computed(() => {
  if (!revenueChart.value) return { labels: [...WEEKDAY_LABELS], data: Array(7).fill(0) as number[] }
  const points = revenueChart.value.data_points
  const revenueMap = new Map(points.map(p => [p.date, Number(p.revenue)]))
  const data: number[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekMonday.value)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    data.push(revenueMap.get(key) ?? 0)
  }
  return { labels: [...WEEKDAY_LABELS], data }
})

const weekTotal = computed(() => {
  const sum = chartData.value.data.reduce((a, b) => a + b, 0)
  return formatKZT(sum)
})

const chartOptions = computed(() => ({
  chart: {
    id: 'revenue-week',
    toolbar: { show: false },
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    animations: { enabled: false },
    redrawOnParentResize: false,
    redrawOnWindowResize: false,
    zoom: { enabled: false },
    selection: { enabled: false },
  },
  colors: ['#465fff'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 100] },
  },
  stroke: { curve: 'smooth' as const, width: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: chartData.value.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#667085',
        fontSize: '12px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#667085',
        fontSize: '12px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      },
      formatter: (val: number) => `${(val / 1000).toFixed(0)}k`,
    },
  },
  grid: {
    borderColor: '#f2f4f7',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    x: {
      formatter: (_val: number, opts: { dataPointIndex: number }) => {
        const d = new Date(currentWeekMonday.value)
        d.setDate(d.getDate() + opts.dataPointIndex)
        return d.toLocaleDateString('ru-KZ', { weekday: 'long', day: 'numeric', month: 'long' })
      },
    },
    y: { formatter: (val: number) => formatKZT(val) },
  },
}))

const chartSeries = computed(() => [{ name: 'Выручка', data: chartData.value.data }])

// Alerts helpers
function docTypeLabel(type: ExpiringDocumentAlert['document_type']): string {
  return type === 'insurance' ? 'Страховка' : 'Тех. осмотр'
}

// Active rentals helpers
function formatReturnDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-KZ', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function remainingLabel(hours: number): string {
  if (hours <= 0) return 'Просрочено'
  if (hours < 24) return `${hours}ч`
  const d = Math.floor(hours / 24)
  const h = hours % 24
  return `${d}д ${h}ч`
}

function remainingClass(hours: number): string {
  if (hours <= 0) return 'text-sm font-medium text-error-600 dark:text-error-400'
  if (hours < 24) return 'text-sm font-medium text-warning-600 dark:text-warning-400'
  return 'text-sm text-gray-500 dark:text-gray-400'
}

// Quick Actions
const quickActions = [
  {
    label: 'Новое бронирование',
    path: '/rentals/create',
    icon: Plus,
    iconBg: 'bg-brand-50 dark:bg-brand-500/10',
    iconColor: 'text-brand-500',
  },
  {
    label: 'Новый клиент',
    path: '/clients',
    icon: Users,
    iconBg: 'bg-success-50 dark:bg-success-500/10',
    iconColor: 'text-success-600 dark:text-success-400',
  },
  {
    label: 'Записать расход',
    path: '/finance/cash-journal',
    icon: Receipt,
    iconBg: 'bg-warning-50 dark:bg-warning-500/10',
    iconColor: 'text-warning-600 dark:text-warning-400',
  },
  {
    label: 'Календарь',
    path: '/rentals/calendar',
    icon: CalendarDays,
    iconBg: 'bg-blue-light-50 dark:bg-blue-light-500/10',
    iconColor: 'text-blue-light-600 dark:text-blue-light-400',
  },
]

onMounted(() => fetchAll())
</script>
