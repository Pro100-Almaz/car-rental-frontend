<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
        Календарь бронирования
      </h1>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
          <button
            @click="prevMonth"
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <span class="min-w-[120px] text-center text-sm font-medium text-gray-800 dark:text-white/90">
            {{ monthLabel }}
          </span>
          <button
            @click="nextMonth"
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
        <button
          @click="goToToday"
          class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Сегодня
        </button>
        <router-link
          to="/rentals/create"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          <Plus class="h-4 w-4" />
          Новая бронь
        </router-link>
      </div>
    </div>

    <!-- Legend -->
    <div class="mb-4 flex flex-wrap items-center gap-5">
      <div v-for="item in legend" :key="item.label" class="flex items-center gap-2">
        <span :class="['h-3 w-3 rounded-sm', item.color]" />
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.label }}</span>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <div class="w-[160px] shrink-0 border-r border-gray-200 px-3 py-3 dark:border-gray-700">
          <div class="h-4 w-24 rounded skeleton-shimmer" />
        </div>
        <div class="flex flex-1 gap-px overflow-hidden">
          <div v-for="i in 15" :key="i" class="h-10 w-[36px] shrink-0 skeleton-shimmer" />
        </div>
      </div>
      <div v-for="i in 8" :key="i" class="flex border-b border-gray-100 last:border-0 dark:border-gray-800">
        <div class="w-[160px] shrink-0 border-r border-gray-200 px-3 py-2 dark:border-gray-700">
          <div class="space-y-1.5">
            <div class="h-4 w-28 rounded skeleton-shimmer" />
            <div class="h-3 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
        <div class="flex flex-1 items-center px-1">
          <div class="h-7 rounded-md skeleton-shimmer" :style="{ width: `${80 + i * 20}px`, marginLeft: `${i * 15}px` }" />
        </div>
      </div>
    </div>

    <!-- Calendar Gantt Grid -->
    <div
      v-else
      class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <table class="w-full border-collapse" style="table-layout: fixed">
        <thead>
          <tr>
            <th
              class="sticky left-0 z-20 w-[160px] min-w-[160px] border-b border-r border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              Автомобиль
            </th>
            <th
              v-for="day in days"
              :key="day"
              :class="[
                'w-[36px] min-w-[36px] border-b border-r border-gray-200 px-0 py-2 text-center text-xs dark:border-gray-700',
                isToday(day) ? 'bg-brand-50 dark:bg-brand-500/10'
                  : isWeekend(day) ? 'bg-gray-50/70 dark:bg-gray-900/70'
                  : 'bg-gray-50 dark:bg-gray-900',
              ]"
            >
              <div
                :class="[
                  'font-medium leading-none',
                  isToday(day) ? 'text-brand-600 dark:text-brand-400'
                    : isWeekend(day) ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400',
                ]"
              >
                {{ day }}
              </div>
              <div class="mt-0.5 text-[9px] font-normal text-gray-400 dark:text-gray-500">
                {{ getWeekdayShort(day) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.vehicle_id" class="group">
            <td
              class="sticky left-0 z-10 w-[160px] min-w-[160px] border-b border-r border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            >
              <router-link
                :to="`/fleet/${vehicle.vehicle_id}`"
                class="block transition-colors hover:text-brand-500"
              >
                <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ vehicle.nickname || `${vehicle.make} ${vehicle.model}` }}
                </p>
                <p class="text-[10px] text-gray-400 dark:text-gray-500">{{ vehicle.license_plate }}</p>
              </router-link>
            </td>

            <td
              v-for="day in days"
              :key="day"
              :class="[
                'relative border-b border-r border-gray-100 p-0 dark:border-gray-800',
                isWeekend(day) ? 'bg-gray-50/40 dark:bg-white/[0.01]' : '',
                isToday(day) ? 'bg-brand-50/30 dark:bg-brand-500/5' : '',
              ]"
              style="height: 40px"
            >
              <!-- Free cell -->
              <div
                v-if="!getSlotForDay(vehicle, day)"
                class="absolute inset-0 cursor-pointer transition-colors hover:bg-success-50 dark:hover:bg-success-500/5"
                title="Свободен — нажмите для бронирования"
                @click="onFreeCellClick(vehicle.vehicle_id, day)"
              />
              <!-- Gantt bar start -->
              <template v-if="isBarStart(vehicle, day)">
                <div
                  :class="[
                    'absolute top-[6px] z-10 flex cursor-pointer items-center overflow-hidden rounded-md px-2',
                    statusBarClass(getSlotForDay(vehicle, day)!.status),
                  ]"
                  :style="barStyle(vehicle, day)"
                  :title="barTooltip(vehicle, day)"
                  @click="onBarClick(getSlotForDay(vehicle, day)!.rental_id)"
                >
                  <span class="truncate text-[11px] font-medium leading-none">
                    {{ barLabel(vehicle, day) }}
                  </span>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div
        v-if="vehicles.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <CarFront class="h-6 w-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Автомобили не найдены</p>
      </div>
    </div>

    <!-- Rental slide-over -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="selectedRentalId"
          class="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm dark:bg-black/60"
          @click.self="selectedRentalId = null"
        />
      </transition>
      <transition
        enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="selectedRentalId"
          class="fixed right-0 top-0 z-[999999] h-screen w-full bg-white shadow-theme-xl dark:bg-gray-900 sm:w-[480px]"
        >
          <div class="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Детали аренды</h3>
            <button
              @click="selectedRentalId = null"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <div class="p-6">
            <div v-if="selectedSlot" class="space-y-4">
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    statusBadgeClass(selectedSlot.status),
                  ]"
                >
                  {{ statusLabel(selectedSlot.status) }}
                </span>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Клиент</span>
                  <span class="font-medium text-gray-800 dark:text-white/90">{{ selectedSlot.client_name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Начало</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ formatDateTime(selectedSlot.scheduled_start) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Окончание</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ formatDateTime(selectedSlot.scheduled_end) }}</span>
                </div>
              </div>
            </div>
            <router-link
              :to="`/rentals/${selectedRentalId}`"
              class="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Открыть аренду
            </router-link>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Plus, CarFront, X } from 'lucide-vue-next'
import { useRentalCalendar } from '@/composables/useRentalCalendar'
import { getMonthName, getDaysInMonth, formatDateTime } from '@/utils/date'
import type { CalendarVehicle, CalendarSlot, RentalStatus } from '@/types'

const router = useRouter()
const { calendar, loading, currentMonth, fetchCalendar, prevMonth, nextMonth, goToToday } =
  useRentalCalendar()

onMounted(() => fetchCalendar())

const DAY_COL_WIDTH = 36
const selectedRentalId = ref<string | null>(null)
const selectedSlot = ref<CalendarSlot | null>(null)

const parsedMonth = computed(() => {
  const [y, m] = currentMonth.value.split('-').map(Number)
  return { year: y, month: m - 1 }
})

const monthLabel = computed(() => `${getMonthName(parsedMonth.value.month)} ${parsedMonth.value.year}`)

const days = computed(() => {
  const { year, month } = parsedMonth.value
  const count = getDaysInMonth(year, month)
  return Array.from({ length: count }, (_, i) => i + 1)
})

const vehicles = computed<CalendarVehicle[]>(() => calendar.value?.vehicles ?? [])

const legend = [
  { label: 'Свободен', color: 'bg-success-500' },
  { label: 'Подтверждён', color: 'bg-brand-500' },
  { label: 'Активен', color: 'bg-error-500' },
  { label: 'Ожидание', color: 'bg-warning-300' },
  { label: 'Возврат', color: 'bg-orange-400' },
  { label: 'Завершён', color: 'bg-gray-300 dark:bg-gray-600' },
]

const now = new Date()

function isToday(day: number): boolean {
  const { year, month } = parsedMonth.value
  return day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
}

function isWeekend(day: number): boolean {
  const { year, month } = parsedMonth.value
  const d = new Date(year, month, day)
  return d.getDay() === 0 || d.getDay() === 6
}

function getWeekdayShort(day: number): string {
  const labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const { year, month } = parsedMonth.value
  return labels[new Date(year, month, day).getDay()]
}

function getSlotForDay(vehicle: CalendarVehicle, day: number): CalendarSlot | undefined {
  const { year, month } = parsedMonth.value
  const date = new Date(year, month, day, 12, 0, 0)
  return vehicle.slots.find((s) => {
    const start = new Date(s.scheduled_start)
    const end = new Date(s.scheduled_end)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return date >= start && date <= end
  })
}

function isBarStart(vehicle: CalendarVehicle, day: number): boolean {
  const slot = getSlotForDay(vehicle, day)
  if (!slot) return false
  const { year, month } = parsedMonth.value
  const rentalStart = new Date(slot.scheduled_start)
  rentalStart.setHours(0, 0, 0, 0)
  const monthStart = new Date(year, month, 1)
  const barDisplayStart = rentalStart < monthStart ? monthStart : rentalStart
  return barDisplayStart.getDate() === day
}

function getVisibleDays(vehicle: CalendarVehicle, day: number): number {
  const slot = getSlotForDay(vehicle, day)
  if (!slot) return 0
  const { year, month } = parsedMonth.value
  const rentalStart = new Date(slot.scheduled_start)
  rentalStart.setHours(0, 0, 0, 0)
  const rentalEnd = new Date(slot.scheduled_end)
  rentalEnd.setHours(23, 59, 59, 999)
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  const barStart = rentalStart < monthStart ? monthStart : rentalStart
  const barEnd = rentalEnd > monthEnd ? monthEnd : rentalEnd
  return Math.round((barEnd.getTime() - barStart.getTime()) / 86400000) + 1
}

function statusBarClass(status: RentalStatus): string {
  const map: Record<string, string> = {
    active: 'bg-error-500 text-white',
    confirmed: 'bg-brand-500 text-white dark:bg-brand-600',
    pending: 'bg-warning-300 text-warning-900 dark:bg-warning-400/80 dark:text-warning-950',
    returning: 'bg-orange-400 text-white',
    completed: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300',
    disputed: 'bg-theme-purple-500 text-white',
  }
  return map[status] ?? 'bg-brand-500 text-white'
}

function statusBadgeClass(status: RentalStatus): string {
  const map: Record<string, string> = {
    pending: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    confirmed: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    active: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    returning: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    completed: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
    cancelled: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    disputed: 'bg-theme-purple-500/10 text-theme-purple-500',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: RentalStatus): string {
  const map: Record<string, string> = {
    pending: 'Ожидание',
    confirmed: 'Подтверждён',
    active: 'Активен',
    returning: 'Возврат',
    completed: 'Завершён',
    cancelled: 'Отменён',
    disputed: 'Спор',
  }
  return map[status] ?? status
}

function barStyle(vehicle: CalendarVehicle, day: number): Record<string, string> {
  const dur = getVisibleDays(vehicle, day)
  if (!dur) return {}
  return {
    left: '2px',
    width: `${dur * DAY_COL_WIDTH - 4}px`,
    height: '28px',
  }
}

function barLabel(vehicle: CalendarVehicle, day: number): string {
  const slot = getSlotForDay(vehicle, day)
  if (!slot) return ''
  const dur = getVisibleDays(vehicle, day)
  if (dur <= 1) return ''
  const name = slot.client_name.split(' ')[0]
  if (dur >= 4) return `${name} · ${dur}д`
  return name
}

function barTooltip(vehicle: CalendarVehicle, day: number): string {
  const slot = getSlotForDay(vehicle, day)
  if (!slot) return 'Свободен'
  return `${slot.client_name} — ${statusLabel(slot.status)}`
}

function onFreeCellClick(vehicleId: string, day: number) {
  const { year, month } = parsedMonth.value
  const date = new Date(year, month, day)
  const dateStr = date.toISOString().split('T')[0]
  router.push(`/rentals/create?vehicle=${vehicleId}&date=${dateStr}`)
}

function onBarClick(rentalId: string) {
  const slot = vehicles.value
    .flatMap((v) => v.slots)
    .find((s) => s.rental_id === rentalId)
  selectedSlot.value = slot ?? null
  selectedRentalId.value = rentalId
}
</script>
