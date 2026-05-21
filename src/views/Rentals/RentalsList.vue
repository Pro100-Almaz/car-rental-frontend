<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Аренды</h1>
      <div class="flex items-center gap-2">
        <router-link
          to="/rentals/calendar"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          <CalendarDays class="h-4 w-4" />
          Календарь
        </router-link>
        <router-link
          to="/rentals/create"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          <Plus class="h-4 w-4" />
          Новая бронь
        </router-link>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading">
      <div class="mb-5 flex gap-2">
        <div v-for="i in 5" :key="i" class="h-9 w-24 rounded-full skeleton-shimmer" />
      </div>
      <div class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-28 rounded-2xl skeleton-shimmer" />
      </div>
    </div>

    <template v-else>
      <!-- Status filter pills -->
      <div class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatus = tab.value"
          :class="[
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150',
            activeStatus === tab.value
              ? 'bg-brand-500 text-white shadow-theme-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          ]"
        >
          {{ tab.label }}
          <span
            :class="[
              'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
              activeStatus === tab.value
                ? 'bg-white/20 text-white'
                : 'bg-white text-gray-500 dark:bg-gray-700 dark:text-gray-400',
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Rentals table -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Автомобиль</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Клиент</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Период</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Сумма</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
                <th class="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:table-cell">Оплата</th>
                <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredRentals.length === 0">
                <td colspan="7" class="px-5 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <CalendarDays class="h-6 w-6 text-gray-400" />
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Нет аренд с этим статусом</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="rental in filteredRentals"
                :key="rental.id"
                class="group cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
                @click="$router.push(`/rentals/${rental.id}`)"
              >
                <!-- Автомобиль -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <CarFront class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                        {{ vehicleLabel(rental.vehicle_id) }}
                      </p>
                      <p v-if="vehiclePlate(rental.vehicle_id)" class="text-xs text-gray-400 dark:text-gray-500">
                        {{ vehiclePlate(rental.vehicle_id) }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Клиент -->
                <td class="px-5 py-4">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ clientName(rental.client_id) }}
                  </p>
                  <p v-if="clientPhone(rental.client_id)" class="text-xs text-gray-400 dark:text-gray-500">
                    {{ clientPhone(rental.client_id) }}
                  </p>
                </td>

                <!-- Период -->
                <td class="px-5 py-4">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDate(rental.scheduled_start) }} — {{ formatDate(rental.scheduled_end) }}
                  </p>
                  <p
                    v-if="rental.status === 'active'"
                    :class="[
                      'text-xs',
                      getRemainingUrgency(rental.scheduled_end) === 'overdue'
                        ? 'font-medium text-error-600 dark:text-error-400'
                        : getRemainingUrgency(rental.scheduled_end) === 'soon'
                          ? 'text-warning-600 dark:text-warning-400'
                          : 'text-gray-400 dark:text-gray-500',
                    ]"
                  >
                    {{ getRemainingTime(rental.scheduled_end) }}
                  </p>
                </td>

                <!-- Сумма -->
                <td class="px-5 py-4">
                  <p class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ formatKZT(parseFloat(rental.estimated_total)) }}
                  </p>
                </td>

                <!-- Статус -->
                <td class="px-5 py-4">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      rentalStatusStyle(rental.status),
                    ]"
                  >
                    <span :class="['h-1.5 w-1.5 rounded-full', rentalStatusDot(rental.status)]" />
                    {{ rentalStatusLabel(rental.status) }}
                  </span>
                </td>

                <!-- Оплата -->
                <td class="hidden px-5 py-4 sm:table-cell">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      prepaymentStyle(rental.prepayment_status),
                    ]"
                  >
                    {{ prepaymentLabel(rental.prepayment_status) }}
                  </span>
                </td>

                <!-- Действия -->
                <td class="px-5 py-4 text-right" @click.stop>
                  <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      @click="$router.push(`/rentals/${rental.id}`)"
                      title="Просмотр"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, CalendarDays, CarFront, Eye } from 'lucide-vue-next'
import { useRentals } from '@/composables/useRentals'
import { useVehicles } from '@/composables/useVehicles'
import { useClients } from '@/composables/useClients'
import { formatKZT } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { rentalStatusLabel, rentalStatusDot, rentalStatusStyle, prepaymentLabel, prepaymentStyle } from '@/utils/status'
import type { Vehicle, Client } from '@/types'

const { rentals, loading, fetchAll } = useRentals()
const { vehicles, fetchAll: fetchVehicles } = useVehicles()
const { clients, fetchAll: fetchClients } = useClients()

const vehicleMap = computed(() => {
  const map = new Map<string, Vehicle>()
  for (const v of vehicles.value) map.set(v.id, v)
  return map
})

const clientMap = computed(() => {
  const map = new Map<string, Client>()
  for (const c of clients.value) map.set(c.id, c)
  return map
})

function vehicleLabel(id: string): string {
  const v = vehicleMap.value.get(id)
  return v ? (v.nickname ?? `${v.make} ${v.model}`) : id.slice(0, 8).toUpperCase()
}

function vehiclePlate(id: string): string {
  return vehicleMap.value.get(id)?.license_plate ?? ''
}

function clientName(id: string): string {
  const c = clientMap.value.get(id)
  return c ? `${c.first_name} ${c.last_name}` : id.slice(0, 8).toUpperCase()
}

function clientPhone(id: string): string {
  return clientMap.value.get(id)?.phone ?? ''
}

onMounted(() => Promise.all([fetchAll(), fetchVehicles(), fetchClients()]))

const activeStatus = ref('all')

const statusTabs = computed(() => {
  const counts: Record<string, number> = { all: rentals.value.length }
  rentals.value.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1 })
  return [
    { value: 'all',       label: 'Все',          count: counts.all },
    { value: 'active',    label: 'Активные',     count: counts.active || 0 },
    { value: 'pending',   label: 'Ожидание',     count: counts.pending || 0 },
    { value: 'confirmed', label: 'Подтверждено', count: counts.confirmed || 0 },
    { value: 'completed', label: 'Завершённые',  count: counts.completed || 0 },
    { value: 'cancelled', label: 'Отменённые',   count: counts.cancelled || 0 },
  ]
})

const filteredRentals = computed(() =>
  activeStatus.value === 'all'
    ? rentals.value
    : rentals.value.filter((r) => r.status === activeStatus.value),
)

function getRemainingUrgency(endDate: string): 'overdue' | 'soon' | 'ok' {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return 'overdue'
  if (diff < 86400000) return 'soon'
  return 'ok'
}

function getRemainingTime(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return 'Просрочено'
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `Осталось ${hours}ч`
  return `Осталось ${Math.floor(hours / 24)}д ${hours % 24}ч`
}

</script>
