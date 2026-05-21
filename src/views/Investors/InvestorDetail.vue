<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading && !investor" class="space-y-5">
      <div class="h-8 w-48 rounded skeleton-shimmer" />
      <div class="h-12 w-72 rounded skeleton-shimmer" />
      <div class="h-64 w-full rounded-2xl skeleton-shimmer" />
    </div>

    <template v-else-if="investor">
      <!-- Header -->
      <div class="mb-6 flex flex-wrap items-start gap-4">
        <button
          @click="router.push('/investors')"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <ArrowLeft class="h-4 w-4" />
          Инвесторы
        </button>
      </div>

      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
          >
            {{ investor.full_name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white/90">{{ investor.full_name }}</h1>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', typeStyle(investor.type_)]">
                {{ typeLabel(investor.type_) }}
              </span>
              <span
                v-if="investor.user_id"
                class="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"
              >
                <CheckCircle class="h-3 w-3" />
                Привязан
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              >
                <XCircle class="h-3 w-3" />
                Не привязан
              </span>
            </div>
          </div>
        </div>

        <button
          @click="openEditModal"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Pencil class="h-4 w-4" />
          Редактировать
        </button>
      </div>

      <!-- Tab bar -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <nav class="-mb-px flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab: Профиль -->
      <div v-if="activeTab === 'profile'">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 class="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">Контактная информация</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p class="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">Телефон</p>
              <p class="text-sm text-gray-800 dark:text-white/80">{{ investor.contact_phone || '—' }}</p>
            </div>
            <div>
              <p class="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">Email</p>
              <p class="text-sm text-gray-800 dark:text-white/80">{{ investor.contact_email || '—' }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">Заметки</p>
              <p class="text-sm text-gray-800 dark:text-white/80">{{ investor.notes || '—' }}</p>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p class="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">Создан</p>
                <p class="text-sm text-gray-800 dark:text-white/80">{{ formatDate(investor.created_at) }}</p>
              </div>
              <div>
                <p class="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500">Обновлён</p>
                <p class="text-sm text-gray-800 dark:text-white/80">{{ formatDate(investor.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Автомобили -->
      <div v-else-if="activeTab === 'vehicles'">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Привязанных авто: <span class="font-semibold text-gray-800 dark:text-white/90">{{ vehicles.length }}</span>
          </p>
          <button
            @click="showLinkDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
          >
            <Plus class="h-4 w-4" />
            Привязать авто
          </button>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div v-if="vehicles.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Car class="h-6 w-6 text-gray-400" />
            </div>
            <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет привязанных авто</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">Привяжите автомобиль к этому инвестору</p>
          </div>

          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">ID авто</th>
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Доля %</th>
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Распределение</th>
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Привязан с</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="v in vehicles" :key="v.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">{{ v.vehicle_id.slice(0, 8) }}…</td>
                <td class="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">{{ v.share_percentage }}%</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {{ distLabel(v.profit_distribution_type) }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-500 dark:text-gray-400">{{ formatDate(v.created_at) }}</td>
                <td class="px-5 py-4 text-right">
                  <button
                    @click="confirmUnlink(v)"
                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-error-600 transition-colors hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                    Отвязать
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: P&L -->
      <div v-else-if="activeTab === 'pnl'">
        <div class="mb-5 flex flex-wrap items-center gap-4">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Период</label>
            <input
              v-model="currentPeriod"
              type="month"
              @change="onPeriodChange"
              class="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
            />
          </div>
        </div>

        <!-- Summary cards -->
        <div v-if="!pnl && loading" class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="h-24 rounded-2xl skeleton-shimmer" />
        </div>

        <div v-else-if="pnl" class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p class="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">Выручка</p>
            <p class="tabular-nums text-xl font-bold text-success-600 dark:text-success-400">{{ fmtKZT(pnl.total_revenue) }}</p>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p class="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">Расходы</p>
            <p class="tabular-nums text-xl font-bold text-error-600 dark:text-error-400">{{ fmtKZT(pnl.total_expenses) }}</p>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p class="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">Чистая прибыль</p>
            <p class="tabular-nums text-xl font-bold text-gray-800 dark:text-white/90">{{ fmtKZT(pnl.total_net_profit) }}</p>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p class="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">Доля инвестора</p>
            <p class="tabular-nums text-xl font-bold text-brand-600 dark:text-brand-400">{{ fmtKZT(pnl.total_investor_share) }}</p>
          </div>
        </div>

        <!-- Per-vehicle table -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="border-b border-gray-100 px-5 py-3.5 dark:border-gray-800">
            <p class="text-sm font-semibold text-gray-800 dark:text-white/90">По автомобилям</p>
          </div>
          <div v-if="!pnl || pnl.vehicles.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <p class="text-sm text-gray-400 dark:text-gray-500">Нет данных за выбранный период</p>
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">ID авто</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Выручка</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Расходы</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Прибыль</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Доля %</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">К инвестору</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Загрузка %</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="row in pnl.vehicles" :key="row.vehicle_id" class="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">{{ row.vehicle_id.slice(0, 8) }}…</td>
                <td class="px-5 py-4 text-right tabular-nums text-success-600 dark:text-success-400">{{ fmtKZT(row.total_revenue) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-error-600 dark:text-error-400">{{ fmtKZT(row.total_expenses) }}</td>
                <td class="px-5 py-4 text-right tabular-nums font-semibold text-gray-800 dark:text-white/90">{{ fmtKZT(row.net_profit) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-gray-400">{{ row.share_percentage }}%</td>
                <td class="px-5 py-4 text-right tabular-nums font-semibold text-brand-600 dark:text-brand-400">{{ fmtKZT(row.investor_share) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-gray-400">{{ row.utilization_percent }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Выплаты -->
      <div v-else-if="activeTab === 'payouts'">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Всего выплат: <span class="font-semibold text-gray-800 dark:text-white/90">{{ payouts.length }}</span>
          </p>
          <button
            @click="showPayoutDialog = true"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
          >
            <Plus class="h-4 w-4" />
            Создать выплату
          </button>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div v-if="payouts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Wallet class="h-6 w-6 text-gray-400" />
            </div>
            <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет выплат</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">Создайте первую выплату инвестору</p>
          </div>

          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Период</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Прибыль</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Сумма доли</th>
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Статус</th>
                <th class="px-5 py-3.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500">Выплачено</th>
                <th class="px-5 py-3.5 text-right text-xs font-medium text-gray-400 dark:text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="p in payouts" :key="p.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-4 font-medium text-gray-800 dark:text-white/90">{{ formatPeriod(p.period_month) }}</td>
                <td class="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-gray-400">{{ fmtKZT(p.calculated_profit) }}</td>
                <td class="px-5 py-4 text-right tabular-nums font-semibold text-gray-800 dark:text-white/90">{{ fmtKZT(p.share_amount) }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', payoutStatusStyle(p.status)]">
                    {{ payoutStatusLabel(p.status) }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-500 dark:text-gray-400">{{ p.paid_at ? formatDate(p.paid_at) : '—' }}</td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="p.status === 'calculated'"
                      @click="handleApprove(p.id)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20"
                    >
                      <CheckCircle class="h-3.5 w-3.5" />
                      Утвердить
                    </button>
                    <button
                      v-if="p.status === 'approved'"
                      @click="handleMarkPaid(p.id)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-1.5 text-xs font-medium text-success-600 transition-colors hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400 dark:hover:bg-success-500/20"
                    >
                      <Banknote class="h-3.5 w-3.5" />
                      Выплачено
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else-if="!loading" class="flex flex-col items-center justify-center py-24 text-center">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Инвестор не найден</p>
    </div>
  </div>

  <!-- Edit Modal -->
  <Teleport to="body">
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="showEditModal = false"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Редактировать инвестора</h2>
          <button @click="showEditModal = false" class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X class="h-5 w-5" />
          </button>
        </div>
        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ФИО</label>
            <input
              v-model="editForm.full_name"
              required
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="Иванов Иван Иванович"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип</label>
            <select
              v-model="editForm.type_"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            >
              <option value="own">Собственный</option>
              <option value="partner">Партнёр</option>
              <option value="shared">Долевой</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Телефон</label>
            <input
              v-model="editForm.contact_phone"
              type="tel"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="+7 777 123 4567"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="editForm.contact_email"
              type="email"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="investor@example.com"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Заметки</label>
            <textarea
              v-model="editForm.notes"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 resize-none"
              placeholder="Дополнительная информация..."
            />
          </div>
          <div class="flex justify-end gap-3 pt-1">
            <button
              type="button"
              @click="showEditModal = false"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="editSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
            >
              <Loader2 v-if="editSubmitting" class="h-4 w-4 animate-spin" />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Link Vehicle Dialog -->
  <Teleport to="body">
    <div
      v-if="showLinkDialog"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="showLinkDialog = false"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Привязать автомобиль</h2>
          <button @click="showLinkDialog = false" class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X class="h-5 w-5" />
          </button>
        </div>
        <form @submit.prevent="submitLink" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Автомобиль</label>
            <select
              v-model="linkForm.vehicle_id"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            >
              <option value="" disabled>Выберите автомобиль</option>
              <option v-for="v in allVehicles" :key="v.id" :value="v.id">
                {{ v.make }} {{ v.model }} {{ v.year }} · {{ v.license_plate }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Доля (%)</label>
            <input
              v-model.number="linkForm.share_percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="50"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Распределение</label>
            <select
              v-model="linkForm.profit_distribution_type"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            >
              <option value="monthly">Ежемесячно</option>
              <option value="quarterly">Ежеквартально</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-1">
            <button
              type="button"
              @click="showLinkDialog = false"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="linkSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
            >
              <Loader2 v-if="linkSubmitting" class="h-4 w-4 animate-spin" />
              Привязать
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Unlink Confirmation Dialog -->
  <Teleport to="body">
    <div
      v-if="unlinkTarget"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="unlinkTarget = null"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
          <Trash2 class="h-6 w-6 text-error-500" />
        </div>
        <h2 class="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">Отвязать автомобиль?</h2>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Автомобиль <span class="font-mono font-semibold">{{ unlinkTarget.vehicle_id.slice(0, 8) }}…</span> будет отвязан от инвестора.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="unlinkTarget = null"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Отмена
          </button>
          <button
            @click="submitUnlink"
            :disabled="unlinkSubmitting"
            class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-error-600 active:bg-error-700 disabled:opacity-60"
          >
            <Loader2 v-if="unlinkSubmitting" class="h-4 w-4 animate-spin" />
            Отвязать
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Create Payout Dialog -->
  <Teleport to="body">
    <div
      v-if="showPayoutDialog"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="showPayoutDialog = false"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Создать выплату</h2>
          <button @click="showPayoutDialog = false" class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <X class="h-5 w-5" />
          </button>
        </div>
        <form @submit.prevent="submitPayout" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Период</label>
            <input
              v-model="payoutForm.period_month"
              type="month"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Рассчитанная прибыль (₸)</label>
            <input
              v-model.number="payoutForm.calculated_profit"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="0"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Сумма доли (₸)</label>
            <input
              v-model.number="payoutForm.share_amount"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="0"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Заметки</label>
            <textarea
              v-model="payoutForm.notes"
              rows="2"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 resize-none"
              placeholder="Необязательно..."
            />
          </div>
          <div class="flex justify-end gap-3 pt-1">
            <button
              type="button"
              @click="showPayoutDialog = false"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="payoutSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
            >
              <Loader2 v-if="payoutSubmitting" class="h-4 w-4 animate-spin" />
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Pencil, CheckCircle, XCircle, Plus, Car, Wallet,
  Trash2, Banknote, X, Loader2, User, Truck, BarChart2, CreditCard,
} from 'lucide-vue-next'
import { useInvestorDetail } from '@/composables/useInvestorDetail'
import { useVehicles } from '@/composables/useVehicles'
import { useToast } from '@/composables/useToast'
import type { InvestorType, InvestorVehicle, PayoutStatus } from '@/types'
import api from '@/api/client'

const route = useRoute()
const router = useRouter()
const investorId = route.params.id as string

const {
  investor, vehicles, pnl, payouts, loading,
  fetchInvestor, fetchVehicles, fetchPnl, fetchPayouts,
  linkVehicle, unlinkVehicle, createPayout, updatePayoutStatus,
} = useInvestorDetail()

const { vehicles: allVehicles, fetchAll: fetchAllVehicles } = useVehicles()
const toast = useToast()

// ── Tabs ────────────────────────────────────────────────────────────────────
const activeTab = ref<string>('profile')
const tabs = [
  { key: 'profile',  label: 'Профиль',    icon: User },
  { key: 'vehicles', label: 'Автомобили', icon: Truck },
  { key: 'pnl',      label: 'P&L',        icon: BarChart2 },
  { key: 'payouts',  label: 'Выплаты',    icon: CreditCard },
]

// ── Period ───────────────────────────────────────────────────────────────────
const now = new Date()
const currentPeriod = ref<string>(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
)

function onPeriodChange() {
  fetchPnl(investorId, { period: currentPeriod.value })
}

// ── Formatters ───────────────────────────────────────────────────────────────
const kztFormatter = new Intl.NumberFormat('ru-KZ', {
  style: 'currency',
  currency: 'KZT',
  minimumFractionDigits: 0,
})
function fmtKZT(amount: string | number): string {
  return kztFormatter.format(Number(amount))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-KZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

function formatPeriod(periodMonth: string): string {
  const [year, month] = periodMonth.split('-')
  const m = parseInt(month, 10) - 1
  return `${MONTHS_RU[m] ?? month} ${year}`
}

function typeLabel(type: InvestorType): string {
  return { own: 'Собственный', partner: 'Партнёр', shared: 'Долевой' }[type] ?? type
}

function typeStyle(type: InvestorType): string {
  const map: Record<InvestorType, string> = {
    own:     'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    partner: 'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400',
    shared:  'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}

function distLabel(type: string): string {
  return { monthly: 'Ежемесячно', quarterly: 'Ежеквартально' }[type] ?? type
}

function payoutStatusLabel(status: PayoutStatus): string {
  return { calculated: 'Рассчитано', approved: 'Утверждено', paid: 'Выплачено' }[status] ?? status
}

function payoutStatusStyle(status: PayoutStatus): string {
  const map: Record<PayoutStatus, string> = {
    calculated: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    approved:   'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
    paid:       'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

// ── Edit Modal ───────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const editSubmitting = ref(false)
const editForm = reactive({
  full_name: '',
  type_: 'own' as InvestorType,
  contact_phone: '',
  contact_email: '',
  notes: '',
})

function openEditModal() {
  if (!investor.value) return
  editForm.full_name = investor.value.full_name
  editForm.type_ = investor.value.type_
  editForm.contact_phone = investor.value.contact_phone ?? ''
  editForm.contact_email = investor.value.contact_email ?? ''
  editForm.notes = investor.value.notes ?? ''
  showEditModal.value = true
}

async function submitEdit() {
  editSubmitting.value = true
  try {
    await api.patch(`/investors/${investorId}`, {
      full_name: editForm.full_name,
      type_: editForm.type_,
      contact_phone: editForm.contact_phone || null,
      contact_email: editForm.contact_email || null,
      notes: editForm.notes || null,
    })
    await fetchInvestor(investorId)
    showEditModal.value = false
    toast.success('Данные обновлены')
  } catch {
    toast.error('Ошибка при сохранении данных')
  } finally {
    editSubmitting.value = false
  }
}

// ── Link Vehicle ─────────────────────────────────────────────────────────────
const showLinkDialog = ref(false)
const linkSubmitting = ref(false)
const linkForm = reactive({
  vehicle_id: '',
  share_percentage: 50,
  profit_distribution_type: 'monthly',
})

async function submitLink() {
  linkSubmitting.value = true
  try {
    await linkVehicle(investorId, {
      vehicle_id: linkForm.vehicle_id,
      share_percentage: String(linkForm.share_percentage),
      profit_distribution_type: linkForm.profit_distribution_type,
    })
    showLinkDialog.value = false
    linkForm.vehicle_id = ''
    linkForm.share_percentage = 50
    linkForm.profit_distribution_type = 'monthly'
    toast.success('Автомобиль привязан')
  } catch {
    toast.error('Ошибка при привязке автомобиля')
  } finally {
    linkSubmitting.value = false
  }
}

// ── Unlink Vehicle ───────────────────────────────────────────────────────────
const unlinkTarget = ref<InvestorVehicle | null>(null)
const unlinkSubmitting = ref(false)

function confirmUnlink(v: InvestorVehicle) {
  unlinkTarget.value = v
}

async function submitUnlink() {
  if (!unlinkTarget.value) return
  unlinkSubmitting.value = true
  try {
    await unlinkVehicle(investorId, unlinkTarget.value.vehicle_id)
    unlinkTarget.value = null
    toast.success('Автомобиль отвязан')
  } catch {
    toast.error('Ошибка при отвязке автомобиля')
  } finally {
    unlinkSubmitting.value = false
  }
}

// ── Payout Actions ───────────────────────────────────────────────────────────
async function handleApprove(payoutId: string) {
  try {
    await updatePayoutStatus(payoutId, 'approved')
    await fetchPayouts(investorId)
    toast.success('Статус выплаты обновлён')
  } catch {
    toast.error('Ошибка при обновлении статуса выплаты')
  }
}

async function handleMarkPaid(payoutId: string) {
  try {
    await updatePayoutStatus(payoutId, 'paid')
    await fetchPayouts(investorId)
    toast.success('Статус выплаты обновлён')
  } catch {
    toast.error('Ошибка при обновлении статуса выплаты')
  }
}

// ── Create Payout ─────────────────────────────────────────────────────────────
const showPayoutDialog = ref(false)
const payoutSubmitting = ref(false)
const payoutForm = reactive({
  period_month: currentPeriod.value,
  calculated_profit: 0,
  share_amount: 0,
  notes: '',
})

async function submitPayout() {
  payoutSubmitting.value = true
  try {
    await createPayout(investorId, {
      period_month: payoutForm.period_month,
      calculated_profit: String(payoutForm.calculated_profit),
      share_amount: String(payoutForm.share_amount),
      notes: payoutForm.notes || null,
    })
    showPayoutDialog.value = false
    payoutForm.calculated_profit = 0
    payoutForm.share_amount = 0
    payoutForm.notes = ''
    toast.success('Выплата создана')
  } catch {
    toast.error('Ошибка при создании выплаты')
  } finally {
    payoutSubmitting.value = false
  }
}

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchInvestor(investorId)
  fetchVehicles(investorId)
  fetchPayouts(investorId)
  fetchPnl(investorId, { period: currentPeriod.value })
  fetchAllVehicles()
})
</script>
