<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Клиенты</h1>
      <router-link
        to="/clients/new"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Добавить клиента
      </router-link>
    </div>

    <!-- Search & filters -->
    <div
      class="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="relative min-w-[200px] flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Поиск по имени, телефону, email..."
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
        />
      </div>
      <div class="relative min-w-[160px]">
        <select
          v-model="verificationFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="verified">Подтверждён</option>
          <option value="rejected">Отклонён</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      <div class="relative min-w-[160px]">
        <select
          v-model="blacklistFilter"
          class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все клиенты</option>
          <option value="false">Активные</option>
          <option value="true">Заблокированные</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading">
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div class="flex gap-4">
            <div class="h-4 w-20 rounded skeleton-shimmer" />
            <div class="h-4 w-20 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
            <div class="h-4 w-16 rounded skeleton-shimmer" />
          </div>
        </div>
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 border-b border-gray-50 px-5 py-4 last:border-0 dark:border-gray-800/50">
          <div class="h-9 w-9 shrink-0 rounded-full skeleton-shimmer" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-36 rounded skeleton-shimmer" />
            <div class="h-3 w-24 rounded skeleton-shimmer" />
          </div>
          <div class="h-4 w-24 rounded skeleton-shimmer" />
          <div class="h-4 w-16 rounded skeleton-shimmer" />
          <div class="h-6 w-20 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- Client table -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Клиент</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Телефон</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Доверие</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Баланс</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Долг</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="clients.length === 0">
              <td colspan="7" class="px-5 py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Users class="h-6 w-6 text-gray-400" />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Клиенты не найдены</p>
                </div>
              </td>
            </tr>
            <tr
              v-for="client in clients"
              :key="client.id"
              class="group cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
              @click="$router.push(`/clients/${client.id}`)"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  >
                    {{ client.first_name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                      {{ client.first_name }} {{ client.last_name }}
                    </p>
                    <p v-if="client.email" class="text-xs text-gray-400 dark:text-gray-500">
                      {{ client.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4">
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ client.phone }}</p>
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-14 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      :class="['h-full rounded-full transition-all', trustBarColor(client.trust_score)]"
                      :style="{ width: `${client.trust_score}%` }"
                    />
                  </div>
                  <span class="tabular-nums text-xs text-gray-500 dark:text-gray-400">
                    {{ client.trust_score }}
                  </span>
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      trustLevelStyle(client.trust_level),
                    ]"
                  >
                    {{ trustLevelLabel(client.trust_level) }}
                  </span>
                </div>
              </td>

              <td class="px-5 py-4">
                <span
                  v-if="parseFloat(client.wallet_balance) > 0"
                  class="tabular-nums text-sm font-medium text-success-600 dark:text-success-400"
                >
                  {{ formatKZT(parseFloat(client.wallet_balance)) }}
                </span>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>

              <td class="px-5 py-4">
                <span
                  v-if="parseFloat(client.debt_balance) > 0"
                  class="tabular-nums text-sm font-medium text-error-600 dark:text-error-400"
                >
                  {{ formatKZT(parseFloat(client.debt_balance)) }}
                </span>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>

              <td class="px-5 py-4">
                <span
                  v-if="client.is_blacklisted"
                  class="inline-flex items-center gap-1.5 rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-error-500" />
                  Заблокирован
                </span>
                <span
                  v-else-if="client.verification_status === 'verified'"
                  class="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-success-500" />
                  Верифицирован
                </span>
                <span
                  v-else-if="client.verification_status === 'pending'"
                  class="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-warning-500" />
                  На проверке
                </span>
                <span
                  v-else-if="client.verification_status === 'rejected'"
                  class="inline-flex items-center gap-1.5 rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-error-500" />
                  Отклонён
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Не верифицирован
                </span>
              </td>

              <td class="px-5 py-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="Просмотр"
                    @click="$router.push(`/clients/${client.id}`)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Search, Plus, Users, Eye, ChevronDown } from 'lucide-vue-next'
import { useClients } from '@/composables/useClients'
import { formatKZT } from '@/utils/currency'
import { trustLevelLabel, trustLevelStyle } from '@/utils/status'

const search = ref('')
const verificationFilter = ref('')
const blacklistFilter = ref('')

const { clients, loading, fetchAll } = useClients()

let searchTimer: ReturnType<typeof setTimeout> | null = null

function buildFilters(): Record<string, unknown> {
  const f: Record<string, unknown> = {}
  if (search.value.trim()) f.search = search.value.trim()
  if (verificationFilter.value) f.verification_status = verificationFilter.value
  if (blacklistFilter.value) f.is_blacklisted = blacklistFilter.value
  return f
}

function fetchWithFilters() {
  fetchAll(buildFilters())
}

onMounted(() => fetchWithFilters())

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchWithFilters, 300)
})

watch([verificationFilter, blacklistFilter], () => fetchWithFilters())

function trustBarColor(score: number): string {
  if (score >= 80) return 'bg-success-500'
  if (score >= 50) return 'bg-warning-500'
  return 'bg-error-500'
}

</script>
