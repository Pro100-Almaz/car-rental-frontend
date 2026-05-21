<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] transition-shadow duration-200 hover:shadow-theme-sm"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white/90 tabular-nums tracking-tight">
          {{ value }}
        </p>
        <p v-if="changeLabel" class="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {{ changeLabel }}
        </p>
        <p v-if="subtitle" class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {{ subtitle }}
        </p>
        <div
          v-if="change !== undefined"
          :class="[
            'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            change >= 0
              ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
              : 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
          ]"
        >
          <TrendingUp v-if="change >= 0" class="h-3 w-3" />
          <TrendingDown v-else class="h-3 w-3" />
          {{ Math.abs(change).toFixed(1) }}%
        </div>
      </div>
      <div
        :class="[
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          iconBg,
          iconColor,
        ]"
      >
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string
  subtitle?: string
  change?: number
  changeLabel?: string
  iconBg: string
  iconColor: string
}>()
</script>
