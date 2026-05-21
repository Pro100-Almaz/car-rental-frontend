<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading">
      <div class="mb-6 flex items-center gap-4">
        <div class="h-9 w-9 rounded-lg skeleton-shimmer" />
        <div class="h-7 w-56 rounded-lg skeleton-shimmer" />
        <div class="h-6 w-24 rounded-full skeleton-shimmer" />
      </div>
      <div class="mb-4 flex gap-2">
        <div v-for="i in 3" :key="i" class="h-9 w-32 rounded-lg skeleton-shimmer" />
      </div>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="h-64 rounded-2xl skeleton-shimmer" />
        <div class="h-64 rounded-2xl skeleton-shimmer" />
      </div>
      <div class="mt-5 h-72 rounded-2xl skeleton-shimmer" />
    </div>

    <template v-else-if="rental">
      <!-- Page header -->
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <router-link
            to="/rentals"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft class="h-4 w-4" />
          </router-link>
          <div>
            <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
              Аренда #{{ rental.id.slice(0, 8).toUpperCase() }}
            </h1>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Создана {{ formatDateTime(rental.created_at) }}
            </p>
          </div>
          <span
            :class="[
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
              statusStyle(rental.status),
            ]"
          >
            <span :class="['h-1.5 w-1.5 rounded-full', statusDot(rental.status)]" />
            {{ statusLabel(rental.status) }}
          </span>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- pending -->
          <template v-if="rental.status === 'pending'">
            <button
              @click="handleConfirm"
              :disabled="actionLoading"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
            >
              <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
              <CheckCircle2 v-else class="h-4 w-4" />
              Подтвердить
            </button>
            <button
              @click="showCancelModal = true"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <X class="h-4 w-4" />
              Отменить
            </button>
          </template>

          <!-- confirmed -->
          <template v-else-if="rental.status === 'confirmed'">
            <button
              @click="showCheckinModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CarFront class="h-4 w-4" />
              Выдать авто
            </button>
            <button
              @click="showExtendModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              <Clock class="h-4 w-4" />
              Продлить
            </button>
            <button
              @click="showCancelModal = true"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <X class="h-4 w-4" />
              Отменить
            </button>
          </template>

          <!-- active -->
          <template v-else-if="rental.status === 'active'">
            <button
              @click="showCheckoutModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CarFront class="h-4 w-4" />
              Принять авто
            </button>
            <button
              @click="showExtendModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              <Clock class="h-4 w-4" />
              Продлить
            </button>
          </template>

          <!-- returning -->
          <template v-else-if="rental.status === 'returning'">
            <button
              @click="showCompleteModal = true"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CheckCircle2 class="h-4 w-4" />
              Завершить
            </button>
          </template>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Rental Info Card -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <Calendar class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Информация об аренде</h2>
          </div>

          <!-- Vehicle -->
          <div v-if="vehicle" class="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-theme-xs dark:bg-gray-700">
              <CarFront class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
                {{ vehicle.make }} {{ vehicle.model }} {{ vehicle.year }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ vehicle.license_plate }}
                <span v-if="vehicle.nickname" class="ml-1 text-gray-400">"{{ vehicle.nickname }}"</span>
              </p>
            </div>
            <router-link
              :to="`/fleet/${vehicle.id}`"
              class="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <Eye class="h-3.5 w-3.5" />
            </router-link>
          </div>
          <div v-else class="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <CarFront class="h-5 w-5 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Загрузка данных авто…</p>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Тип бронирования</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{{ rental.booking_type }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Начало</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDate(rental.scheduled_start) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Окончание</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDate(rental.scheduled_end) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Длительность</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ rentalDays }} сут.</span>
            </div>
            <div v-if="rental.actual_start" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Фактическая выдача</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDateTime(rental.actual_start) }}</span>
            </div>
            <div v-if="rental.actual_end" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Фактический возврат</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDateTime(rental.actual_end) }}</span>
            </div>
            <div class="border-t border-gray-100 pt-3 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Ставка аренды</span>
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ formatKZT(parseFloat(rental.base_rate)) }} / {{ rateTypeLabel(rental.rate_type) }}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Депозит</span>
              <div class="flex items-center gap-2">
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ formatKZT(parseFloat(rental.deposit_amount)) }}
                </span>
                <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', depositStatusStyle(rental.deposit_status)]">
                  {{ depositStatusLabel(rental.deposit_status) }}
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Предоплата</span>
              <div class="flex items-center gap-2">
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ formatKZT(parseFloat(rental.prepayment_amount)) }}
                </span>
                <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', prepaymentStyle(rental.prepayment_status)]">
                  {{ prepaymentLabel(rental.prepayment_status) }}
                </span>
              </div>
            </div>
            <div v-if="rental.notes" class="border-t border-gray-100 pt-3 dark:border-gray-800">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Заметки</p>
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ rental.notes }}</p>
            </div>
            <div v-if="rental.cancellation_reason" class="rounded-xl bg-error-50 p-3 dark:bg-error-500/10">
              <p class="mb-1 text-xs font-medium text-error-700 dark:text-error-400">Причина отмены</p>
              <p class="text-sm text-error-600 dark:text-error-400">{{ rental.cancellation_reason }}</p>
            </div>
          </div>
        </div>

        <!-- Client Info Card -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <Users class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Клиент</h2>
          </div>

          <div v-if="client">
            <!-- Client header -->
            <div class="mb-4 flex items-center gap-3">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                <span class="text-base font-semibold text-brand-600 dark:text-brand-400">
                  {{ client.first_name[0] }}{{ client.last_name[0] }}
                </span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {{ client.first_name }} {{ client.last_name }}
                  </p>
                  <span
                    v-if="client.is_blacklisted"
                    class="rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
                  >
                    Чёрный список
                  </span>
                  <span
                    v-else
                    :class="['rounded-full px-2 py-0.5 text-xs font-medium', trustLevelStyle(client.trust_level)]"
                  >
                    {{ trustLevelLabel(client.trust_level) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ client.phone }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Email</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ client.email || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Верификация</span>
                <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', verificationStyle(client.verification_status)]">
                  {{ verificationLabel(client.verification_status) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Рейтинг доверия</span>
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full bg-brand-500 transition-all"
                      :style="{ width: `${client.trust_score}%` }"
                    />
                  </div>
                  <span class="tabular-nums text-xs text-gray-500 dark:text-gray-400">{{ client.trust_score }}%</span>
                </div>
              </div>
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
              <div v-if="parseFloat(client.debt_balance) > 0" class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Долг</span>
                <span class="tabular-nums text-sm font-medium text-error-600 dark:text-error-400">
                  {{ formatKZT(parseFloat(client.debt_balance)) }}
                </span>
              </div>
            </div>

            <router-link
              :to="`/clients/${client.id}`"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Eye class="h-4 w-4" />
              Открыть клиента
            </router-link>
          </div>
          <div v-else class="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="h-12 w-12 rounded-full skeleton-shimmer" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-32 rounded skeleton-shimmer" />
              <div class="h-3 w-24 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>

      <!-- Price Breakdown Card -->
      <div class="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
            <CreditCard class="h-4 w-4 text-brand-500" />
          </div>
          <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Расчёт стоимости</h2>
        </div>

        <div class="space-y-2">
          <!-- Base rate -->
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">Базовая аренда</span>
            <div class="flex items-center gap-6">
              <span class="tabular-nums text-xs text-gray-400 dark:text-gray-500">
                {{ rentalDays }} сут. × {{ formatKZT(parseFloat(rental.base_rate)) }}/сут.
              </span>
              <span class="tabular-nums w-28 text-right text-sm font-medium text-gray-800 dark:text-white/90">
                {{ formatKZT(rentalDays * parseFloat(rental.base_rate)) }}
              </span>
            </div>
          </div>

          <!-- Additional services -->
          <template v-if="rentalServices.length > 0">
            <div
              v-for="svc in rentalServices"
              :key="svc.id"
              class="flex items-center justify-between py-1"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Доп. услуга
                <span v-if="svc.quantity > 1" class="text-gray-400 dark:text-gray-500"> ×{{ svc.quantity }}</span>
              </span>
              <span class="tabular-nums w-28 text-right text-sm font-medium text-gray-800 dark:text-white/90">
                {{ formatKZT(parseFloat(svc.total_price)) }}
              </span>
            </div>
          </template>

          <div class="border-t border-gray-100 dark:border-gray-800" />

          <!-- Extra charges -->
          <div v-if="parseFloat(rental.late_fee) > 0" class="flex items-center justify-between py-1">
            <span class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <AlertTriangle class="h-3.5 w-3.5 text-warning-500" />
              Штраф за опоздание
            </span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-warning-600 dark:text-warning-400">
              {{ formatKZT(parseFloat(rental.late_fee)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.mileage_surcharge) > 0" class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">Доп. пробег</span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-gray-800 dark:text-white/90">
              {{ formatKZT(parseFloat(rental.mileage_surcharge)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.fuel_charge) > 0" class="flex items-center justify-between py-1">
            <span class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Fuel class="h-3.5 w-3.5 text-orange-500" />
              Топливо
            </span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-gray-800 dark:text-white/90">
              {{ formatKZT(parseFloat(rental.fuel_charge)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.wash_fee) > 0" class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">Мойка</span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-gray-800 dark:text-white/90">
              {{ formatKZT(parseFloat(rental.wash_fee)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.damage_charge) > 0" class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">Повреждения</span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-error-600 dark:text-error-400">
              {{ formatKZT(parseFloat(rental.damage_charge)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.fine_charge) > 0" class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">Штрафы</span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-error-600 dark:text-error-400">
              {{ formatKZT(parseFloat(rental.fine_charge)) }}
            </span>
          </div>
          <div v-if="parseFloat(rental.discount_amount) > 0" class="flex items-center justify-between py-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Скидка
              <span v-if="rental.discount_code" class="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                {{ rental.discount_code }}
              </span>
            </span>
            <span class="tabular-nums w-28 text-right text-sm font-medium text-success-600 dark:text-success-400">
              −{{ formatKZT(parseFloat(rental.discount_amount)) }}
            </span>
          </div>

          <!-- Total -->
          <div class="border-t-2 border-gray-200 pt-3 dark:border-gray-700" />
          <div class="flex items-center justify-between py-1">
            <span class="text-base font-bold uppercase tracking-wide text-gray-800 dark:text-white/90">ИТОГО</span>
            <span class="tabular-nums w-28 text-right text-xl font-bold text-gray-900 dark:text-white">
              {{ formatKZT(parseFloat(rental.actual_total ?? rental.estimated_total)) }}
            </span>
          </div>

          <!-- Payment summary -->
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2 dark:bg-success-500/10">
              <CheckCircle2 class="h-4 w-4 text-success-500" />
              <span class="text-xs text-success-700 dark:text-success-400">Оплачено</span>
              <span class="tabular-nums text-sm font-semibold text-success-700 dark:text-success-400">
                {{ formatKZT(parseFloat(rental.prepayment_amount)) }}
              </span>
            </div>
            <div v-if="remainingAmount > 0" class="flex items-center gap-2 rounded-xl bg-error-50 px-3 py-2 dark:bg-error-500/10">
              <AlertTriangle class="h-4 w-4 text-error-500" />
              <span class="text-xs text-error-700 dark:text-error-400">К оплате</span>
              <span class="tabular-nums text-sm font-semibold text-error-700 dark:text-error-400">
                {{ formatKZT(remainingAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkin/Checkout Data -->
      <div v-if="rental.checkin_data || rental.checkout_data" class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Checkin data -->
        <div v-if="rental.checkin_data" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10">
              <CarFront class="h-4 w-4 text-success-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Выдача</h2>
            <span v-if="rental.actual_start" class="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {{ formatDateTime(rental.actual_start) }}
            </span>
          </div>
          <div class="space-y-3">
            <div v-if="rental.checkin_data.mileage !== undefined" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Пробег</span>
              <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                {{ rental.checkin_data.mileage }} км
              </span>
            </div>
            <div v-if="rental.checkin_data.fuel_level !== undefined" class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Fuel class="h-3.5 w-3.5" />
                Уровень топлива
              </span>
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-orange-500 transition-all"
                    :style="{ width: `${rental.checkin_data.fuel_level}%` }"
                  />
                </div>
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ rental.checkin_data.fuel_level }}%
                </span>
              </div>
            </div>
            <div v-if="rental.checkin_data.exterior_condition" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Кузов</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ conditionLabel(rental.checkin_data.exterior_condition as string) }}
              </span>
            </div>
            <div v-if="rental.checkin_data.interior_condition" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Салон</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ interiorConditionLabel(rental.checkin_data.interior_condition as string) }}
              </span>
            </div>
            <div v-if="rental.checkin_data.notes" class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">Заметки</p>
              <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">{{ rental.checkin_data.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Checkout data -->
        <div v-if="rental.checkout_data" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <CarFront class="h-4 w-4 text-orange-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Возврат</h2>
            <span v-if="rental.actual_end" class="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {{ formatDateTime(rental.actual_end) }}
            </span>
          </div>
          <div class="space-y-3">
            <div v-if="rental.checkout_data.mileage !== undefined" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Пробег</span>
              <div class="flex items-center gap-2">
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ rental.checkout_data.mileage }} км
                </span>
                <span v-if="mileageDriven !== null" class="tabular-nums text-xs text-gray-400 dark:text-gray-500">
                  (+{{ mileageDriven }} км)
                </span>
              </div>
            </div>
            <div v-if="rental.checkout_data.fuel_level !== undefined" class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Fuel class="h-3.5 w-3.5" />
                Уровень топлива
              </span>
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-orange-500 transition-all"
                    :style="{ width: `${rental.checkout_data.fuel_level}%` }"
                  />
                </div>
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ rental.checkout_data.fuel_level }}%
                </span>
                <span v-if="fuelUsed !== null" class="tabular-nums text-xs text-error-500">
                  (−{{ fuelUsed }}%)
                </span>
              </div>
            </div>
            <div v-if="rental.checkout_data.exterior_condition" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Кузов</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ conditionLabel(rental.checkout_data.exterior_condition as string) }}
              </span>
            </div>
            <div v-if="rental.checkout_data.interior_condition" class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Салон</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ interiorConditionLabel(rental.checkout_data.interior_condition as string) }}
              </span>
            </div>
            <div v-if="rental.checkout_data.notes" class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">Заметки</p>
              <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">{{ rental.checkout_data.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty state / error -->
    <div v-else-if="!loading" class="flex flex-col items-center gap-4 py-20">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <AlertTriangle class="h-8 w-8 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Аренда не найдена</p>
      <router-link
        to="/rentals"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        <ArrowLeft class="h-4 w-4" />
        К списку аренд
      </router-link>
    </div>

    <!-- ─────────────────────────────────────────────────────── -->
    <!-- MODAL: Checkin (Выдать авто)                           -->
    <!-- ─────────────────────────────────────────────────────── -->
    <transition name="modal">
      <div
        v-if="showCheckinModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showCheckinModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Выдача автомобиля</h3>
              <button
                @click="showCheckinModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Пробег (км)</label>
                <input
                  v-model.number="checkinForm.mileage"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Уровень топлива: {{ checkinForm.fuel_level }}%
                </label>
                <input
                  v-model.number="checkinForm.fuel_level"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full accent-brand-500"
                />
                <div class="mt-1 flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Состояние кузова</label>
                <div class="relative">
                  <select
                    v-model="checkinForm.exterior_condition"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="good">Хорошее</option>
                    <option value="minor_damage">Незначительные повреждения</option>
                    <option value="damage">Повреждения</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Состояние салона</label>
                <div class="relative">
                  <select
                    v-model="checkinForm.interior_condition"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="clean">Чистый</option>
                    <option value="dirty">Грязный</option>
                    <option value="damage">Повреждения</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Заметки</label>
                <textarea
                  v-model="checkinForm.notes"
                  rows="3"
                  placeholder="Дополнительные комментарии…"
                  class="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showCheckinModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleCheckin"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Выдать авто
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ─────────────────────────────────────────────────────── -->
    <!-- MODAL: Checkout (Принять авто)                         -->
    <!-- ─────────────────────────────────────────────────────── -->
    <transition name="modal">
      <div
        v-if="showCheckoutModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showCheckoutModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Приём автомобиля</h3>
              <button
                @click="showCheckoutModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Diff from checkin -->
            <div
              v-if="rental && rental.checkin_data"
              class="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50"
            >
              <p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">При выдаче</p>
              <div class="flex items-center gap-6 text-sm">
                <span class="text-gray-600 dark:text-gray-400">
                  Пробег: <span class="tabular-nums font-medium text-gray-800 dark:text-white/90">{{ rental.checkin_data.mileage }} км</span>
                </span>
                <span class="text-gray-600 dark:text-gray-400">
                  Топливо: <span class="tabular-nums font-medium text-gray-800 dark:text-white/90">{{ rental.checkin_data.fuel_level }}%</span>
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Пробег (км)
                  <span
                    v-if="rental && rental.checkin_data && checkoutForm.mileage"
                    class="ml-2 tabular-nums text-xs font-normal text-brand-500"
                  >
                    +{{ checkoutForm.mileage - (rental.checkin_data.mileage as number) }} км пройдено
                  </span>
                </label>
                <input
                  v-model.number="checkoutForm.mileage"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Уровень топлива: {{ checkoutForm.fuel_level }}%
                  <span
                    v-if="rental && rental.checkin_data"
                    class="ml-2 tabular-nums text-xs font-normal"
                    :class="(rental.checkin_data.fuel_level as number) - checkoutForm.fuel_level > 0 ? 'text-error-500' : 'text-success-500'"
                  >
                    {{ (rental.checkin_data.fuel_level as number) - checkoutForm.fuel_level > 0
                      ? `−${(rental.checkin_data.fuel_level as number) - checkoutForm.fuel_level}% использовано`
                      : `+${checkoutForm.fuel_level - (rental.checkin_data.fuel_level as number)}% добавлено`
                    }}
                  </span>
                </label>
                <input
                  v-model.number="checkoutForm.fuel_level"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full accent-brand-500"
                />
                <div class="mt-1 flex justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Состояние кузова</label>
                <div class="relative">
                  <select
                    v-model="checkoutForm.exterior_condition"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="good">Хорошее</option>
                    <option value="minor_damage">Незначительные повреждения</option>
                    <option value="damage">Повреждения</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Состояние салона</label>
                <div class="relative">
                  <select
                    v-model="checkoutForm.interior_condition"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="clean">Чистый</option>
                    <option value="dirty">Грязный</option>
                    <option value="damage">Повреждения</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Заметки</label>
                <textarea
                  v-model="checkoutForm.notes"
                  rows="3"
                  placeholder="Дополнительные комментарии…"
                  class="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showCheckoutModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleCheckout"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Принять авто
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ─────────────────────────────────────────────────────── -->
    <!-- MODAL: Complete (Завершить)                            -->
    <!-- ─────────────────────────────────────────────────────── -->
    <transition name="modal">
      <div
        v-if="showCompleteModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showCompleteModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Завершение аренды</h3>
              <button
                @click="showCompleteModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Итоговая сумма (₸)</label>
                  <input
                    v-model="completeForm.actual_total"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Штраф за опоздание (₸)</label>
                  <input
                    v-model="completeForm.late_fee"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Доп. пробег (₸)</label>
                  <input
                    v-model="completeForm.mileage_surcharge"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Топливо (₸)</label>
                  <input
                    v-model="completeForm.fuel_charge"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Мойка (₸)</label>
                  <input
                    v-model="completeForm.wash_fee"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Повреждения (₸)</label>
                  <input
                    v-model="completeForm.damage_charge"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Штрафы (₸)</label>
                  <input
                    v-model="completeForm.fine_charge"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Возврат депозита (₸)</label>
                  <input
                    v-model="completeForm.deposit_refund_amount"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showCompleteModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleComplete"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Завершить аренду
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ─────────────────────────────────────────────────────── -->
    <!-- MODAL: Cancel (Отменить)                               -->
    <!-- ─────────────────────────────────────────────────────── -->
    <transition name="modal">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showCancelModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
                <AlertTriangle class="h-5 w-5 text-error-500" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Отменить аренду</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Это действие нельзя отменить</p>
              </div>
              <button
                @click="showCancelModal = false"
                class="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Причина отмены
              </label>
              <textarea
                v-model="cancelReason"
                rows="3"
                placeholder="Укажите причину отмены…"
                class="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-error-500 focus:ring-4 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-error-500"
              />
            </div>

            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showCancelModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Назад
              </button>
              <button
                @click="handleCancel"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600 active:bg-error-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Отменить аренду
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ─────────────────────────────────────────────────────── -->
    <!-- MODAL: Extend (Продлить)                               -->
    <!-- ─────────────────────────────────────────────────────── -->
    <transition name="modal">
      <div
        v-if="showExtendModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showExtendModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Продление аренды</h3>
              <button
                @click="showExtendModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Новая дата окончания
                </label>
                <input
                  v-model="extendForm.new_end"
                  type="date"
                  :min="rental ? rental.scheduled_end.slice(0, 10) : undefined"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Новая оценочная сумма (₸)
                </label>
                <input
                  v-model="extendForm.new_total"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showExtendModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleExtend"
                :disabled="actionLoading || !extendForm.new_end"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Продлить
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, Calendar, CarFront, Users, CreditCard, AlertTriangle,
  X, Loader2, CheckCircle2, Clock, Fuel, Eye, ChevronDown,
} from 'lucide-vue-next'
import { useRentals } from '@/composables/useRentals'
import { useVehicles } from '@/composables/useVehicles'
import { useClients } from '@/composables/useClients'
import { useAdditionalServices } from '@/composables/useAdditionalServices'
import { useToast } from '@/composables/useToast'
import { formatKZT } from '@/utils/currency'
import { formatDate, formatDateTime } from '@/utils/date'
import {
  rentalStatusLabel as statusLabel, rentalStatusDot as statusDot, rentalStatusStyle as statusStyle,
  depositStatusLabel, depositStatusStyle, prepaymentLabel, prepaymentStyle,
  trustLevelLabel, trustLevelStyle, verificationLabel, verificationStyle,
} from '@/utils/status'
import type { RentalStatus, DepositStatus, PrepaymentStatus } from '@/types'

const route = useRoute()
const rentalId = route.params.id as string

const { rental, loading, fetchOne: fetchRental, confirm, checkin, checkout, extend, cancel, complete } = useRentals()
const { vehicle, fetchOne: fetchVehicle } = useVehicles()
const { client, fetchOne: fetchClient } = useClients()
const { rentalServices, fetchRentalServices } = useAdditionalServices()
const toast = useToast()

const actionLoading = ref(false)

// Modal visibility
const showCheckinModal = ref(false)
const showCheckoutModal = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)
const showExtendModal = ref(false)

// Checkin form
const checkinForm = reactive({
  mileage: 0,
  fuel_level: 50,
  exterior_condition: 'good',
  interior_condition: 'clean',
  notes: '',
})

// Checkout form
const checkoutForm = reactive({
  mileage: 0,
  fuel_level: 50,
  exterior_condition: 'good',
  interior_condition: 'clean',
  notes: '',
})

// Complete form
const completeForm = reactive({
  actual_total: '',
  late_fee: '0',
  mileage_surcharge: '0',
  fuel_charge: '0',
  wash_fee: '0',
  damage_charge: '0',
  fine_charge: '0',
  deposit_refund_amount: '0',
})

// Cancel
const cancelReason = ref('')

// Extend form
const extendForm = reactive({
  new_end: '',
  new_total: '',
})

// Computed
const rentalDays = computed(() => {
  if (!rental.value) return 1
  const start = new Date(rental.value.scheduled_start)
  const end = new Date(rental.value.scheduled_end)
  const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000)
  return diff > 0 ? diff : 1
})

const remainingAmount = computed(() => {
  if (!rental.value) return 0
  const total = parseFloat(rental.value.actual_total ?? rental.value.estimated_total)
  const paid = parseFloat(rental.value.prepayment_amount)
  return Math.max(0, total - paid)
})

const mileageDriven = computed(() => {
  if (!rental.value?.checkin_data || !rental.value.checkout_data) return null
  const checkinMileage = rental.value.checkin_data.mileage as number | undefined
  const checkoutMileage = rental.value.checkout_data.mileage as number | undefined
  if (checkinMileage == null || checkoutMileage == null) return null
  return checkoutMileage - checkinMileage
})

const fuelUsed = computed(() => {
  if (!rental.value?.checkin_data || !rental.value.checkout_data) return null
  const checkinFuel = rental.value.checkin_data.fuel_level as number | undefined
  const checkoutFuel = rental.value.checkout_data.fuel_level as number | undefined
  if (checkinFuel == null || checkoutFuel == null) return null
  const diff = checkinFuel - checkoutFuel
  return diff > 0 ? diff : null
})

// Lifecycle
onMounted(async () => {
  await fetchRental(rentalId)
  if (rental.value) {
    await Promise.all([
      fetchVehicle(rental.value.vehicle_id),
      fetchClient(rental.value.client_id),
      fetchRentalServices(rentalId),
    ])
    // Pre-fill complete form
    completeForm.actual_total = rental.value.estimated_total
    completeForm.late_fee = rental.value.late_fee
    completeForm.mileage_surcharge = rental.value.mileage_surcharge
    completeForm.fuel_charge = rental.value.fuel_charge
    completeForm.wash_fee = rental.value.wash_fee
    completeForm.damage_charge = rental.value.damage_charge
    completeForm.fine_charge = rental.value.fine_charge
    completeForm.deposit_refund_amount = rental.value.deposit_refund_amount
    // Pre-fill extend form
    extendForm.new_end = rental.value.scheduled_end.slice(0, 10)
    extendForm.new_total = rental.value.estimated_total
    // Pre-fill checkout mileage/fuel from vehicle or checkin
    if (rental.value.checkin_data) {
      const cd = rental.value.checkin_data
      checkoutForm.mileage = (cd.mileage as number) ?? 0
      checkoutForm.fuel_level = (cd.fuel_level as number) ?? 50
    }
  }
})

// Action handlers
async function handleConfirm() {
  actionLoading.value = true
  try {
    await confirm(rentalId)
    await fetchRental(rentalId)
    toast.success('Аренда подтверждена')
  } catch {
    toast.error('Ошибка при подтверждении аренды')
  } finally {
    actionLoading.value = false
  }
}

async function handleCheckin() {
  actionLoading.value = true
  try {
    await checkin(rentalId, {
      mileage: checkinForm.mileage,
      fuel_level: checkinForm.fuel_level,
      exterior_condition: checkinForm.exterior_condition,
      interior_condition: checkinForm.interior_condition,
      notes: checkinForm.notes || undefined,
    })
    showCheckinModal.value = false
    await fetchRental(rentalId)
    toast.success('Выдача оформлена')
  } catch {
    toast.error('Ошибка при оформлении выдачи')
  } finally {
    actionLoading.value = false
  }
}

async function handleCheckout() {
  actionLoading.value = true
  try {
    await checkout(rentalId, {
      mileage: checkoutForm.mileage,
      fuel_level: checkoutForm.fuel_level,
      exterior_condition: checkoutForm.exterior_condition,
      interior_condition: checkoutForm.interior_condition,
      notes: checkoutForm.notes || undefined,
    })
    showCheckoutModal.value = false
    await fetchRental(rentalId)
    toast.success('Возврат оформлен')
  } catch {
    toast.error('Ошибка при оформлении возврата')
  } finally {
    actionLoading.value = false
  }
}

async function handleComplete() {
  actionLoading.value = true
  try {
    await complete(rentalId, {
      actual_total: completeForm.actual_total,
      late_fee: completeForm.late_fee,
      mileage_surcharge: completeForm.mileage_surcharge,
      fuel_charge: completeForm.fuel_charge,
      wash_fee: completeForm.wash_fee,
      damage_charge: completeForm.damage_charge,
      fine_charge: completeForm.fine_charge,
      deposit_refund_amount: completeForm.deposit_refund_amount,
    })
    showCompleteModal.value = false
    await fetchRental(rentalId)
    toast.success('Аренда завершена')
  } catch {
    toast.error('Ошибка при завершении аренды')
  } finally {
    actionLoading.value = false
  }
}

async function handleCancel() {
  actionLoading.value = true
  try {
    await cancel(rentalId, cancelReason.value || undefined)
    showCancelModal.value = false
    await fetchRental(rentalId)
    toast.success('Аренда отменена')
  } catch {
    toast.error('Ошибка при отмене аренды')
  } finally {
    actionLoading.value = false
  }
}

async function handleExtend() {
  if (!extendForm.new_end) return
  actionLoading.value = true
  try {
    await extend(rentalId, extendForm.new_end, extendForm.new_total)
    showExtendModal.value = false
    await fetchRental(rentalId)
    toast.success('Аренда продлена')
  } catch {
    toast.error('Ошибка при продлении аренды')
  } finally {
    actionLoading.value = false
  }
}

function rateTypeLabel(t: string): string {
  const map: Record<string, string> = { daily: 'сут.', hourly: 'час', weekly: 'нед.', monthly: 'мес.' }
  return map[t] ?? t
}

function conditionLabel(c: string): string {
  const map: Record<string, string> = {
    good: 'Хорошее', minor_damage: 'Незначительные повреждения', damage: 'Повреждения',
  }
  return map[c] ?? c
}

function interiorConditionLabel(c: string): string {
  const map: Record<string, string> = {
    clean: 'Чистый', dirty: 'Грязный', damage: 'Повреждения',
  }
  return map[c] ?? c
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

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translate(-50%, -48%) scale(0.97);
}
</style>
