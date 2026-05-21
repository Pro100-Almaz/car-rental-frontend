<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Воронка продаж</h1>
      <button
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Новый лид
      </button>
    </div>

    <!-- Kanban board -->
    <div class="flex gap-4 overflow-x-auto pb-4">
      <div
        v-for="column in columns"
        :key="column.status"
        class="w-72 shrink-0"
      >
        <!-- Column header -->
        <div
          class="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="flex items-center gap-2">
            <span :class="['h-2.5 w-2.5 rounded-full', column.dot]" />
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">
              {{ column.title }}
            </h3>
          </div>
          <span
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium tabular-nums text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          >
            {{ getLeadsByStatus(column.status).length }}
          </span>
        </div>

        <!-- Cards list -->
        <div class="space-y-3">
          <div
            v-for="lead in getLeadsByStatus(column.status)"
            :key="lead.id"
            class="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs transition-shadow duration-200 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <!-- Name + source -->
            <div class="mb-2 flex items-start justify-between gap-2">
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ lead.contact_name }}
              </p>
              <span
                :class="[
                  'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                  sourceStyle(lead.source_name),
                ]"
              >
                {{ lead.source_name }}
              </span>
            </div>

            <!-- Phone -->
            <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
              {{ lead.contact_phone }}
            </p>

            <!-- Notes -->
            <p v-if="lead.notes" class="mb-3 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {{ lead.notes }}
            </p>

            <!-- Rejection reason -->
            <div
              v-if="lead.rejection_reason"
              class="mb-3 rounded-lg bg-error-50 px-2.5 py-1.5 text-xs text-error-700 dark:bg-error-500/10 dark:text-error-400"
            >
              {{ rejectionLabel(lead.rejection_reason) }}
            </div>

            <!-- Footer: manager + time -->
            <div class="flex items-center justify-between gap-2">
              <div v-if="lead.manager_name" class="flex items-center gap-1.5">
                <div
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                >
                  {{ lead.manager_name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ lead.manager_name }}</span>
              </div>
              <span v-else class="text-xs text-gray-400 dark:text-gray-500">Не назначен</span>
              <span class="text-[10px] text-gray-400 dark:text-gray-500">
                {{ formatTimeAgo(lead.updated_at) }}
              </span>
            </div>
          </div>

          <!-- Empty column state -->
          <div
            v-if="getLeadsByStatus(column.status).length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700"
          >
            <p class="text-xs text-gray-400 dark:text-gray-500">Нет лидов</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { mockLeads } from '@/stores/mock-data'
import { formatTimeAgo } from '@/utils/date'
import type { LeadStatus, LeadRejectionReason } from '@/types'

const columns: Array<{ status: LeadStatus; title: string; dot: string }> = [
  { status: 'new',         title: 'Новый',       dot: 'bg-brand-500' },
  { status: 'in_progress', title: 'В обработке', dot: 'bg-warning-500' },
  { status: 'booked',      title: 'Забронирован', dot: 'bg-success-500' },
  { status: 'contract',    title: 'Договор',      dot: 'bg-blue-light-500' },
  { status: 'completed',   title: 'Завершён',     dot: 'bg-gray-400' },
  { status: 'rejected',    title: 'Отказ',        dot: 'bg-error-500' },
]

function getLeadsByStatus(status: LeadStatus) {
  return mockLeads.filter((l) => l.status === status)
}

function sourceStyle(source: string): string {
  const map: Record<string, string> = {
    Instagram: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    OLX:       'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    Звонок:    'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    '2GIS':    'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400',
    Сайт:      'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  }
  return map[source] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
}

function rejectionLabel(reason: LeadRejectionReason): string {
  const map: Record<LeadRejectionReason, string> = {
    no_answer:        'Не ответил',
    too_expensive:    'Дорого',
    changed_mind:     'Передумал',
    no_suitable_car:  'Нет подходящего авто',
    other:            'Другое',
  }
  return map[reason] ?? reason
}
</script>
