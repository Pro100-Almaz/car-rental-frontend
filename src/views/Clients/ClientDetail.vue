<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading">
      <div class="mb-6 flex items-center gap-4">
        <div class="h-9 w-9 rounded-lg skeleton-shimmer" />
        <div class="h-7 w-56 rounded-lg skeleton-shimmer" />
        <div class="h-6 w-24 rounded-full skeleton-shimmer" />
        <div class="h-6 w-20 rounded-full skeleton-shimmer" />
      </div>
      <div class="mb-4 flex gap-2">
        <div v-for="i in 3" :key="i" class="h-9 w-32 rounded-lg skeleton-shimmer" />
      </div>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="h-64 rounded-2xl skeleton-shimmer" />
        <div class="h-64 rounded-2xl skeleton-shimmer" />
      </div>
    </div>

    <template v-else-if="client">
      <!-- Header -->
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <router-link
            to="/clients"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft class="h-4 w-4" />
          </router-link>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
                {{ client.first_name }} {{ client.last_name }}
              </h1>
              <span
                v-if="client.is_blacklisted"
                class="rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
              >
                Чёрный список
              </span>
              <span
                :class="['rounded-full px-2 py-0.5 text-xs font-medium', verificationStyle(client.verification_status)]"
              >
                {{ verificationLabel(client.verification_status) }}
              </span>
              <span
                :class="['rounded-full px-2 py-0.5 text-xs font-medium', trustLevelStyle(client.trust_level)]"
              >
                {{ trustLevelLabel(client.trust_level) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <template v-if="client.verification_status === 'pending'">
            <button
              @click="verifyIntent = 'verify'; showVerifyModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CheckCircle2 class="h-4 w-4" />
              Подтвердить
            </button>
            <button
              @click="verifyIntent = 'reject'; showVerifyModal = true"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <X class="h-4 w-4" />
              Отклонить
            </button>
          </template>
          <template v-else-if="client.verification_status === 'rejected'">
            <button
              @click="handleResubmit"
              :disabled="actionLoading"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
            >
              <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
              <RefreshCw v-else class="h-4 w-4" />
              Переотправить
            </button>
          </template>
          <button
            v-if="!client.is_blacklisted"
            @click="showBlacklistModal = true"
            class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
          >
            <ShieldOff class="h-4 w-4" />
            В чёрный список
          </button>
          <button
            v-if="client.is_blacklisted"
            @click="showUnblacklistModal = true"
            class="inline-flex items-center gap-2 rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-success-600 active:bg-success-700"
          >
            <ShieldCheck class="h-4 w-4" />
            Разблокировать
          </button>
          <router-link
            :to="`/clients/${client.id}/edit`"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            <Pencil class="h-4 w-4" />
            Редактировать
          </router-link>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-5 flex gap-1 border-b border-gray-200 dark:border-gray-800">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'relative px-4 py-2.5 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1.5 tabular-nums text-xs text-gray-400 dark:text-gray-500">
            {{ tab.count }}
          </span>
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-brand-500"
          />
        </button>
      </div>

      <!-- Tab: Profile -->
      <div v-if="activeTab === 'profile'">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Contact info -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <User class="h-4 w-4 text-brand-500" />
              </div>
              <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Контакты и информация</h2>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Телефон</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ client.phone }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Email</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ client.email || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Создан</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDateTime(client.created_at) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Обновлён</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDateTime(client.updated_at) }}</span>
              </div>
              <div v-if="client.is_blacklisted && client.blacklist_reason" class="rounded-xl bg-error-50 p-3 dark:bg-error-500/10">
                <p class="mb-1 text-xs font-medium text-error-700 dark:text-error-400">Причина блокировки</p>
                <p class="text-sm text-error-600 dark:text-error-400">{{ client.blacklist_reason }}</p>
              </div>
            </div>
          </div>

          <!-- Financial -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <CreditCard class="h-4 w-4 text-brand-500" />
              </div>
              <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Финансы</h2>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Баланс кошелька</span>
                <span
                  :class="[
                    'tabular-nums text-sm font-medium',
                    parseFloat(client.wallet_balance) >= 0
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-error-600 dark:text-error-400',
                  ]"
                >
                  {{ formatKZT(parseFloat(client.wallet_balance)) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Долг</span>
                <span
                  v-if="parseFloat(client.debt_balance) > 0"
                  class="tabular-nums text-sm font-medium text-error-600 dark:text-error-400"
                >
                  {{ formatKZT(parseFloat(client.debt_balance)) }}
                </span>
                <span v-else class="text-sm text-gray-400 dark:text-gray-500">Нет долга</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Рейтинг доверия</span>
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full bg-brand-500 transition-all"
                      :style="{ width: `${client.trust_score}%` }"
                    />
                  </div>
                  <span class="tabular-nums text-xs text-gray-500 dark:text-gray-400">{{ client.trust_score }}%</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Уровень доверия</span>
                <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', trustLevelStyle(client.trust_level)]">
                  {{ trustLevelLabel(client.trust_level) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <FileText class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Документы</h2>
          </div>

          <input
            ref="documentFileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            class="hidden"
            @change="handleDocumentFileSelected"
          />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              v-for="doc in documentSlots"
              :key="doc.key"
              class="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {{ doc.label }}
                  </p>
                  <p
                    :class="[
                      'mt-1 text-xs',
                      doc.url
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-gray-400 dark:text-gray-500',
                    ]"
                  >
                    {{ doc.url ? 'Загружен' : 'Не загружен' }}
                  </p>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="openDocumentUpload(doc)"
                    :disabled="documentActionLoading === doc.key"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100 disabled:opacity-60 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20"
                    title="Загрузить"
                  >
                    <Loader2
                      v-if="documentActionLoading === doc.key"
                      class="h-4 w-4 animate-spin"
                    />
                    <Upload v-else class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    @click="handleDeleteDocument(doc)"
                    :disabled="!doc.document || documentActionLoading === doc.key"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-error-50 text-error-600 transition-colors hover:bg-error-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-error-500/10 dark:text-error-400 dark:hover:bg-error-500/20"
                    title="Удалить"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                v-if="doc.url"
                class="mb-3 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <img
                  v-if="isImageUrl(doc.url)"
                  :src="resolveDocumentUrl(doc.url)"
                  :alt="doc.label"
                  class="h-40 w-full object-cover"
                />

                <div
                  v-else
                  class="flex h-40 items-center justify-center"
                >
                  <FileText class="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <a
                v-if="doc.url"
                :href="resolveDocumentUrl(doc.url)"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20"
              >
                <ExternalLink class="h-4 w-4 shrink-0" />
                Открыть документ
              </a>

              <div
                v-else
                class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"
              >
                <FileText class="h-4 w-4 shrink-0 text-gray-400" />
                <span class="text-sm text-gray-400 dark:text-gray-500">Не загружен</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Rentals -->
      <div v-if="activeTab === 'rentals'">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div v-if="rentalsLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-14 rounded-xl skeleton-shimmer" />
          </div>

          <div v-else-if="rentals.length === 0" class="flex flex-col items-center gap-3 py-8">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Calendar class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет аренд</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800">
                  <th class="pb-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">ID</th>
                  <th class="pb-2 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
                  <th class="pb-2 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Период</th>
                  <th class="pb-2 px-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Сумма</th>
                  <th class="pb-2 px-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Залог</th>
                  <th class="pb-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in rentals"
                  :key="r.id"
                  class="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
                >
                  <td class="py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    #{{ r.id.slice(0, 8).toUpperCase() }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      :class="[
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                        rentalStatusStyle(r.status),
                      ]"
                    >
                      <span :class="['h-1.5 w-1.5 rounded-full', rentalStatusDot(r.status)]" />
                      {{ rentalStatusLabel(r.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {{ formatDate(r.scheduled_start) }} — {{ formatDate(r.scheduled_end) }}
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ formatKZT(parseFloat(r.actual_total ?? r.estimated_total)) }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="text-right">
                      <span class="tabular-nums text-xs text-gray-600 dark:text-gray-400">
                        {{ formatKZT(parseFloat(r.deposit_amount)) }}
                      </span>
                      <span
                        :class="[
                          'ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                          depositStatusStyle(r.deposit_status),
                        ]"
                      >
                        {{ depositStatusLabel(r.deposit_status) }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 text-right">
                    <router-link
                      :to="`/rentals/${r.id}`"
                      class="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <Eye class="h-3.5 w-3.5" />
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Payments -->
      <div v-if="activeTab === 'payments'">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div v-if="paymentsLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-14 rounded-xl skeleton-shimmer" />
          </div>

          <div v-else-if="payments.length === 0" class="flex flex-col items-center gap-3 py-8">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CreditCard class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет транзакций</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800">
                  <th class="pb-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Дата</th>
                  <th class="pb-2 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Тип</th>
                  <th class="pb-2 px-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Сумма</th>
                  <th class="pb-2 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Метод</th>
                  <th class="pb-2 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
                  <th class="pb-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Аренда</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in payments"
                  :key="p.id"
                  class="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
                >
                  <td class="py-3 text-xs text-gray-600 dark:text-gray-400">
                    {{ formatDateTime(p.created_at) }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {{ paymentTypeLabel(p.type_) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ formatKZT(parseFloat(p.amount)) }}
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {{ paymentMethodLabel(p.payment_method) }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      :class="[
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        paymentStatusStyle(p.status),
                      ]"
                    >
                      {{ paymentStatusLabel(p.status) }}
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <router-link
                      v-if="p.rental_id"
                      :to="`/rentals/${p.rental_id}`"
                      class="font-mono text-xs text-brand-600 hover:underline dark:text-brand-400"
                    >
                      #{{ p.rental_id.slice(0, 8).toUpperCase() }}
                    </router-link>
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <div v-else-if="!loading" class="flex flex-col items-center gap-4 py-20">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <AlertTriangle class="h-8 w-8 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Клиент не найден</p>
      <router-link
        to="/clients"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        <ArrowLeft class="h-4 w-4" />
        К списку клиентов
      </router-link>
    </div>

    <!-- Verify modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showVerifyModal"
          class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
          @click.self="showVerifyModal = false"
        >
          <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">
                {{ verifyIntent === 'reject' ? 'Отклонить верификацию' : 'Подтвердить верификацию' }}
              </h3>
              <button
                @click="showVerifyModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <p class="mb-5 text-sm text-gray-600 dark:text-gray-400">
              {{ verifyIntent === 'reject' ? 'Отклонить документы клиента' : 'Подтвердить документы клиента' }}
              <span class="font-semibold text-gray-800 dark:text-white/90">{{ client?.first_name }} {{ client?.last_name }}</span>?
            </p>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="showVerifyModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                v-if="verifyIntent === 'reject'"
                @click="handleReject"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600 active:bg-error-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Отклонить
              </button>
              <button
                v-else
                @click="handleVerify"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Blacklist modal -->
      <transition name="modal">
        <div
          v-if="showBlacklistModal"
          class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
          @click.self="showBlacklistModal = false"
        >
          <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
                <AlertTriangle class="h-5 w-5 text-error-500" />
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Добавить в чёрный список</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Это действие заблокирует клиента</p>
              </div>
              <button
                @click="showBlacklistModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="mb-5">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Причина <span class="text-error-500">*</span>
              </label>
              <textarea
                v-model="blacklistReason"
                rows="3"
                placeholder="Укажите причину блокировки…"
                class="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-error-500 focus:ring-4 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-error-500"
              />
            </div>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="showBlacklistModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleBlacklist"
                :disabled="actionLoading || !blacklistReason.trim()"
                class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600 active:bg-error-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Заблокировать
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Unblacklist modal -->
      <transition name="modal">
        <div
          v-if="showUnblacklistModal"
          class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
          @click.self="showUnblacklistModal = false"
        >
          <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
                <ShieldCheck class="h-5 w-5 text-success-500" />
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Разблокировать клиента</h3>
              </div>
              <button
                @click="showUnblacklistModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <p class="mb-5 text-sm text-gray-600 dark:text-gray-400">
              Убрать клиента <span class="font-semibold text-gray-800 dark:text-white/90">{{ client?.first_name }} {{ client?.last_name }}</span> из чёрного списка?
            </p>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="showUnblacklistModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleUnblacklist"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-success-600 active:bg-success-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Разблокировать
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, User, CreditCard, FileText, Calendar, Eye,
  AlertTriangle, X, Loader2, CheckCircle2, ExternalLink,
  RefreshCw, ShieldOff, ShieldCheck, Pencil, Upload, Trash2
} from 'lucide-vue-next'
import { useClients } from '@/composables/useClients'
import { useToast } from '@/composables/useToast'
import { formatKZT } from '@/utils/currency'
import { formatDate, formatDateTime } from '@/utils/date'
import {
  verificationLabel, verificationStyle, trustLevelLabel, trustLevelStyle,
  rentalStatusLabel, rentalStatusDot, rentalStatusStyle,
  depositStatusLabel, depositStatusStyle,
  paymentTypeLabel, paymentMethodLabel, paymentStatusLabel, paymentStatusStyle,
} from '@/utils/status'
import type { Rental, PaymentTransaction, RentalStatus, DepositStatus, PaymentMethod } from '@/types'
import api from '@/api/client'

const route = useRoute()
const clientId = route.params.id as string

const {
  client, loading, fetchOne, verify, blacklist, unblacklist,
  fetchClientRentals, fetchClientPayments,
} = useClients()

const toast = useToast()

const activeTab = ref<'profile' | 'rentals' | 'payments'>('profile')
const actionLoading = ref(false)
const showVerifyModal = ref(false)
const verifyIntent = ref<'verify' | 'reject'>('verify')
const showBlacklistModal = ref(false)
const showUnblacklistModal = ref(false)
const blacklistReason = ref('')

const rentals = ref<Rental[]>([])
const rentalsLoading = ref(false)
const payments = ref<PaymentTransaction[]>([])
const paymentsLoading = ref(false)

const tabs = computed(() => [
  { key: 'profile' as const, label: 'Профиль' },
  { key: 'rentals' as const, label: 'Аренды', count: rentals.value.length },
  { key: 'payments' as const, label: 'Платежи', count: payments.value.length },
])


type ClientDocumentType = 'national_id' | 'license_front' | 'license_back'

type ClientDocument = {
  id : string
  document_type: ClientDocumentType
  url?: string | null
  status?: string
  name?: string | null
  description?: string | null
}

type DocumentSlot = {
  key: ClientDocumentType
  label: string
  url?: string | null
  document?: ClientDocument
}


const clientDocuments = ref<ClientDocument[]>([])
const documentFileInput = ref<HTMLInputElement| null>(null)
const selectedDocumentSlot = ref<DocumentSlot | null>(null)
const documentActionLoading = ref<ClientDocumentType | null>(null)

const documentSlots = computed<DocumentSlot[]>(() => {
  const findDoc = (type : ClientDocumentType) =>
    clientDocuments.value.find(doc => doc.document_type === type)

  return [
    {
      key: 'national_id',
      label: 'Удостоверение личности',
      document: findDoc('national_id'),
      url: findDoc('national_id')?.url ?? findDoc('national_id')?.url ?? null,
    },
    {
      key: 'license_front',
      label: 'Лицензия (лицевая)',
      document: findDoc('license_front'),
      url: findDoc('license_front')?.url ?? findDoc('license_front')?.url ?? null,
    },
    {
      key: 'license_back',
      label: 'Лицензия (обратная)',
      document: findDoc('license_back'),
      url: findDoc('license_back')?.url ?? findDoc('license_back')?.url ?? null,
    }
  ]
})



onMounted(async () => {
  await fetchOne(clientId)
  await LoadClientDocuments()
  loadRentals()
  loadPayments()
})

async function LoadClientDocuments() {
  try {
    const res = await api.get(`/clients/${clientId}/documents`)

    clientDocuments.value = [
      res.data.national_id,
      res.data.license_front,
      res.data.license_back,
    ].filter(Boolean)
  } catch (error) {
    toast.error('Ошибка при загрузке документов клиента')
  }
}

function openDocumentUpload(doc: DocumentSlot) {
  selectedDocumentSlot.value = doc
  documentFileInput.value?.click()
}


async function handleDocumentFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const doc = selectedDocumentSlot.value

  if (!file || !doc) return

  documentActionLoading.value = doc.key

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', doc.key)

    if (doc.document?.id) {
      formData.append('document_id', doc.document.id)
      formData.append('status', doc.document.status ?? 'pending')

      await api.patch(`/clients/${clientId}/documents`, formData)

      toast.success('Документ обновлён')
    } else {
      await api.post(`/clients/${clientId}/documents`, formData)

      toast.success('Документ загружен')
    }

    await LoadClientDocuments()
    await fetchOne(clientId)
  } catch (error) {
    toast.error('Ошибка при загрузке документа')
  } finally {
    documentActionLoading.value = null
    selectedDocumentSlot.value = null
    input.value = ''
  }
}

async function handleDeleteDocument(doc: DocumentSlot) {
  if (!doc.document?.id) return

  documentActionLoading.value = doc.key

  try {
    await api.delete(`/clients/${clientId}/documents`, {
      data: {
        client_id: clientId,
        document_id: doc.document.id,
      },
    })

    await LoadClientDocuments()
    await fetchOne(clientId)

    toast.success('Документ удалён')
  } catch {
    toast.error('Ошибка при удалении документа')
  } finally {
    documentActionLoading.value = null
  }
}

function resolveDocumentUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
  return `${backendUrl}${url}`
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url.split('?')[0])
}

async function loadRentals() {
  rentalsLoading.value = true
  try {
    rentals.value = await fetchClientRentals(clientId)
  } finally {
    rentalsLoading.value = false
  }
}

async function loadPayments() {
  paymentsLoading.value = true
  try {
    payments.value = await fetchClientPayments(clientId)
  } finally {
    paymentsLoading.value = false
  }
}

async function handleVerify() {
  actionLoading.value = true
  try {
    await verify(clientId, 'verified')
    showVerifyModal.value = false
    await fetchOne(clientId)
    toast.success('Клиент верифицирован')
  } catch {
    toast.error('Ошибка при верификации клиента')
  } finally {
    actionLoading.value = false
  }
}

async function handleReject() {
  actionLoading.value = true
  try {
    await verify(clientId, 'rejected')
    showVerifyModal.value = false
    await fetchOne(clientId)
    toast.success('Верификация отклонена')
  } catch {
    toast.error('Ошибка при отклонении верификации')
  } finally {
    actionLoading.value = false
  }
}

async function handleResubmit() {
  actionLoading.value = true
  try {
    await verify(clientId, 'pending')
    await fetchOne(clientId)
    toast.success('Статус верификации обновлён')
  } catch {
    toast.error('Ошибка при обновлении статуса')
  } finally {
    actionLoading.value = false
  }
}

async function handleBlacklist() {
  if (!blacklistReason.value.trim()) return
  actionLoading.value = true
  try {
    await blacklist(clientId, blacklistReason.value)
    showBlacklistModal.value = false
    blacklistReason.value = ''
    await fetchOne(clientId)
    toast.success('Клиент добавлен в чёрный список')
  } catch {
    toast.error('Ошибка при добавлении в чёрный список')
  } finally {
    actionLoading.value = false
  }
}

async function handleUnblacklist() {
  actionLoading.value = true
  try {
    await unblacklist(clientId)
    showUnblacklistModal.value = false
    await fetchOne(clientId)
    toast.success('Клиент удалён из чёрного списка')
  } catch {
    toast.error('Ошибка при удалении из чёрного списка')
  } finally {
    actionLoading.value = false
  }
}

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
