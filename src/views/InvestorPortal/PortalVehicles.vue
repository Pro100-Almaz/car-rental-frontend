<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Мои автомобили</h1>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div class="border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
        <div class="flex gap-6">
          <div v-for="j in 4" :key="j" class="h-4 w-28 rounded skeleton-shimmer" />
        </div>
      </div>
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-6 border-b border-gray-50 px-5 py-3.5 last:border-0 dark:border-gray-800/50"
      >
        <div class="h-4 w-32 rounded skeleton-shimmer" />
        <div class="h-4 w-16 rounded skeleton-shimmer" />
        <div class="h-5 w-28 rounded-full skeleton-shimmer" />
        <div class="h-4 w-24 rounded skeleton-shimmer" />
      </div>
    </div>

    <!-- Vehicles table -->
    <div
      v-else-if="vehicles.length > 0"
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
                Доля %
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Тип распределения
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Добавлен
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="v in vehicles"
              :key="v.id"
              class="border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
            >
              <td class="px-5 py-3">
                <span class="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {{ v.vehicle_id.slice(0, 8) }}…
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
                  {{ v.share_percentage }}%
                </span>
              </td>
              <td class="px-5 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    v.profit_distribution_type === 'monthly'
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'bg-theme-purple-500/10 text-theme-purple-500',
                  ]"
                >
                  {{ distributionLabel(v.profit_distribution_type) }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(v.created_at) }}
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
        <Car class="h-6 w-6 text-gray-400" />
      </div>
      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет автомобилей</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">К вашему аккаунту не привязано ни одного авто</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Car } from 'lucide-vue-next'
import { useInvestorPortal } from '@/composables/useInvestorPortal'
import { formatDate } from '@/utils/date'

const { vehicles, loading, fetchVehicles } = useInvestorPortal()

function distributionLabel(type: string): string {
  const map: Record<string, string> = {
    monthly: 'Ежемесячно',
    quarterly: 'Ежеквартально',
  }
  return map[type] ?? type
}

onMounted(() => {
  fetchVehicles()
})
</script>
