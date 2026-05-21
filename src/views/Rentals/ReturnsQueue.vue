<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Очередь возвратов</h1>
      <button
        @click="fetchQueue"
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <RefreshCw :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
        Обновить
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && items.length === 0" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="h-10 w-10 rounded-lg skeleton-shimmer" />
        <div class="flex-1 space-y-2">
          <div class="h-4 w-48 rounded skeleton-shimmer" />
          <div class="h-3 w-32 rounded skeleton-shimmer" />
        </div>
        <div class="h-6 w-20 rounded-full skeleton-shimmer" />
        <div class="h-4 w-24 rounded skeleton-shimmer" />
      </div>
    </div>

    <template v-else>
      <!-- Overdue section -->
      <section v-if="overdueItems.length > 0" class="mb-6">
        <div class="mb-3 flex items-center gap-2">
          <AlertTriangle class="h-4 w-4 text-error-500" />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-error-600 dark:text-error-400">
            Просрочены ({{ overdueItems.length }})
          </h2>
        </div>
        <div class="space-y-2">
          <ReturnCard
            v-for="item in overdueItems"
            :key="item.rental_id"
            :item="item"
            variant="overdue"
            @click="$router.push(`/rentals/${item.rental_id}`)"
          />
        </div>
      </section>

      <!-- Today section -->
      <section v-if="todayItems.length > 0" class="mb-6">
        <div class="mb-3 flex items-center gap-2">
          <Clock class="h-4 w-4 text-warning-500" />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Сегодня ({{ todayItems.length }})
          </h2>
        </div>
        <div class="space-y-2">
          <ReturnCard
            v-for="item in todayItems"
            :key="item.rental_id"
            :item="item"
            variant="today"
            @click="$router.push(`/rentals/${item.rental_id}`)"
          />
        </div>
      </section>

      <!-- Tomorrow section -->
      <section v-if="tomorrowItems.length > 0" class="mb-6">
        <div class="mb-3 flex items-center gap-2">
          <CalendarDays class="h-4 w-4 text-gray-400" />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Завтра ({{ tomorrowItems.length }})
          </h2>
        </div>
        <div class="space-y-2">
          <ReturnCard
            v-for="item in tomorrowItems"
            :key="item.rental_id"
            :item="item"
            variant="tomorrow"
            @click="$router.push(`/rentals/${item.rental_id}`)"
          />
        </div>
      </section>

      <!-- Empty state -->
      <div
        v-if="items.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
          <CheckCircle class="h-6 w-6 text-success-500" />
        </div>
        <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Очередь пуста</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Нет предстоящих возвратов</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineComponent, h } from 'vue'
import { AlertTriangle, Clock, CalendarDays, RefreshCw, CheckCircle, Car, Eye, ArrowRight } from 'lucide-vue-next'
import { useReturnsQueue } from '@/composables/useReturnsQueue'
import { formatDateTime } from '@/utils/date'
import { formatKZT } from '@/utils/currency'
import type { ReturnsQueueItem, RentalStatus } from '@/types'

const { items, loading, fetchQueue, overdueItems, todayItems, tomorrowItems } = useReturnsQueue()

onMounted(() => fetchQueue())

function statusLabel(status: RentalStatus): string {
  const map: Record<string, string> = {
    active: 'Активен',
    returning: 'Возврат',
    pending: 'Ожидание',
    confirmed: 'Подтверждён',
    completed: 'Завершён',
    cancelled: 'Отменён',
    disputed: 'Спор',
  }
  return map[status] ?? status
}

function statusBadgeClass(status: RentalStatus): string {
  const map: Record<string, string> = {
    active: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    returning: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
}

const ReturnCard = defineComponent({
  props: {
    item: { type: Object as () => ReturnsQueueItem, required: true },
    variant: { type: String as () => 'overdue' | 'today' | 'tomorrow', required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const borderClass = {
      overdue: 'border-error-200 dark:border-error-800/50',
      today: 'border-warning-200 dark:border-warning-800/50',
      tomorrow: 'border-gray-200 dark:border-gray-800',
    }

    return () =>
      h(
        'div',
        {
          class: [
            'flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 transition-colors hover:bg-gray-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]',
            borderClass[props.variant],
          ],
          onClick: () => emit('click'),
        },
        [
          h(
            'div',
            {
              class: [
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                props.variant === 'overdue'
                  ? 'bg-error-50 dark:bg-error-500/10'
                  : 'bg-gray-100 dark:bg-gray-800',
              ],
            },
            [
              h(Car, {
                class: [
                  'h-5 w-5',
                  props.variant === 'overdue'
                    ? 'text-error-500'
                    : 'text-gray-500 dark:text-gray-400',
                ],
              }),
            ],
          ),
          h('div', { class: 'min-w-0 flex-1' }, [
            h('div', { class: 'flex items-center gap-2' }, [
              h(
                'p',
                { class: 'truncate text-sm font-medium text-gray-800 dark:text-white/90' },
                props.item.vehicle_nickname || props.item.vehicle_license_plate,
              ),
              props.item.is_overdue
                ? h(
                    'span',
                    {
                      class:
                        'rounded-full bg-error-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-error-700 dark:bg-error-500/10 dark:text-error-400',
                    },
                    'Просрочен',
                  )
                : null,
            ]),
            h('p', { class: 'text-xs text-gray-500 dark:text-gray-400' }, [
              props.item.client_name,
              ' · ',
              props.item.vehicle_license_plate,
            ]),
          ]),
          h(
            'span',
            {
              class: [
                'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                statusBadgeClass(props.item.status),
              ],
            },
            statusLabel(props.item.status),
          ),
          h('div', { class: 'hidden shrink-0 text-right sm:block' }, [
            h(
              'p',
              { class: 'text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300' },
              formatKZT(parseFloat(props.item.estimated_total)),
            ),
            h(
              'p',
              { class: 'text-xs text-gray-400 dark:text-gray-500' },
              `до ${formatDateTime(props.item.scheduled_end)}`,
            ),
          ]),
          h(
            'div',
            { class: 'shrink-0 text-gray-300 dark:text-gray-600' },
            [h(ArrowRight, { class: 'h-4 w-4' })],
          ),
        ],
      )
  },
})
</script>
