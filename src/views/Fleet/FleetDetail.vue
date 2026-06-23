<template>
  <div>
    <div v-if="loading">
      <div class="mb-6 flex items-center gap-4">
        <div class="h-9 w-9 rounded-lg skeleton-shimmer" />
        <div class="space-y-2">
          <div class="h-6 w-48 rounded-lg skeleton-shimmer" />
          <div class="h-4 w-64 rounded skeleton-shimmer" />
        </div>
        <div class="h-6 w-24 rounded-full skeleton-shimmer" />
      </div>
      <div class="mb-4 flex gap-2">
        <div v-for="i in 4" :key="i" class="h-9 w-28 rounded-lg skeleton-shimmer" />
      </div>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="h-72 rounded-2xl skeleton-shimmer" />
        <div class="h-72 rounded-2xl skeleton-shimmer" />
      </div>
      <div class="mt-5 h-48 rounded-2xl skeleton-shimmer" />
    </div>

    <template v-else-if="vehicle">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <router-link
            to="/fleet"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft class="h-4 w-4" />
          </router-link>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
                {{ vehicle.nickname || `${vehicle.make} ${vehicle.model}` }}
              </h1>
              <span
                :class="[
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                  statusStyle,
                ]"
              >
                {{ statusLabel }}
              </span>
            </div>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {{ vehicle.make }} {{ vehicle.model }} {{ vehicle.year }} · {{ vehicle.license_plate }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <template v-if="vehicle.status === 'available'">
            <router-link
              :to="`/rentals/create?vehicle=${vehicle.id}`"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <Plus class="h-4 w-4" />
              Новая бронь
            </router-link>
            <button
              @click="openStatusModal('in_service')"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              <Wrench class="h-4 w-4" />
              На ТО
            </button>
            <button
              @click="openStatusModal('in_wash')"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              <Droplets class="h-4 w-4" />
              На мойку
            </button>
            <button
              @click="openStatusModal('decommissioned')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <Ban class="h-4 w-4" />
              Списать
            </button>
            <button
              @click="openStatusModal('sold')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <TagIcon class="h-4 w-4" />
              Продать
            </button>
          </template>

          <template v-else-if="vehicle.status === 'reserved'">
            <button
              @click="openStatusModal('available')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <X class="h-4 w-4" />
              Отменить бронь
            </button>
          </template>

          <template v-else-if="vehicle.status === 'rented'">
            <router-link
              v-if="activeRentalId"
              :to="`/rentals/${activeRentalId}`"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600"
            >
              <CarFront class="h-4 w-4" />
              Текущая аренда
            </router-link>
          </template>

          <template v-else-if="vehicle.status === 'returning'">
            <button
              @click="openStatusModal('available')"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CheckCircle2 class="h-4 w-4" />
              Принять
            </button>
            <button
              @click="openStatusModal('in_service')"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              <Wrench class="h-4 w-4" />
              На ТО
            </button>
            <button
              @click="openStatusModal('in_wash')"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              <Droplets class="h-4 w-4" />
              На мойку
            </button>
          </template>

          <template v-else-if="vehicle.status === 'in_service'">
            <button
              @click="openStatusModal('available')"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CheckCircle2 class="h-4 w-4" />
              Готова
            </button>
            <button
              @click="openStatusModal('decommissioned')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <Ban class="h-4 w-4" />
              Списать
            </button>
            <button
              @click="openStatusModal('sold')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <TagIcon class="h-4 w-4" />
              Продать
            </button>
          </template>

          <template v-else-if="vehicle.status === 'in_wash'">
            <button
              @click="openStatusModal('available')"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
            >
              <CheckCircle2 class="h-4 w-4" />
              Готова
            </button>
          </template>

          <template v-else-if="vehicle.status === 'decommissioned'">
            <button
              @click="openStatusModal('sold')"
              class="inline-flex items-center gap-2 rounded-lg border border-error-300 bg-white px-4 py-2.5 text-sm font-medium text-error-600 transition-colors hover:bg-error-50 dark:border-error-700 dark:bg-transparent dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <TagIcon class="h-4 w-4" />
              Продать
            </button>
          </template>

          <button
            @click="openEditModal"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            <Pencil class="h-4 w-4" />
            Редактировать
          </button>
        </div>
      </div>

      <div class="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'overview'">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <Settings2 class="h-4 w-4 text-brand-500" />
              </div>
              <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Характеристики</h2>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Категория</span>
                <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ vehicle.category }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Топливо</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ vehicle.fuel_type }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Трансмиссия</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ vehicle.transmission }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Цвет</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ vehicle.color }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">VIN</span>
                <span class="font-mono text-sm text-gray-800 dark:text-white/90">{{ vehicle.vin || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Год</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">{{ vehicle.year }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <Gauge class="h-4 w-4 text-brand-500" />
              </div>
              <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Пробег и GPS</h2>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Пробег</span>
                <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ formatNumber(vehicle.current_mileage) }} км
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">GPS устройство</span>
                <span class="text-sm font-medium text-gray-800 dark:text-white/90">
                  {{ vehicle.gps_device_id || 'Не подключён' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Уровень топлива</span>
                <div v-if="vehicle.current_fuel_level !== null" class="flex items-center gap-2">
                  <div class="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      :class="[
                        'h-full rounded-full',
                        vehicle.current_fuel_level > 50
                          ? 'bg-success-500'
                          : vehicle.current_fuel_level > 20
                            ? 'bg-warning-500'
                            : 'bg-error-500',
                      ]"
                      :style="{ width: `${vehicle.current_fuel_level}%` }"
                    />
                  </div>
                  <span class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ vehicle.current_fuel_level }}%
                  </span>
                </div>
                <span v-else class="text-sm text-gray-400 dark:text-gray-500">Нет данных</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Координаты</span>
                <span
                  v-if="vehicle.current_latitude && vehicle.current_longitude"
                  class="tabular-nums text-sm font-medium text-gray-800 dark:text-white/90"
                >
                  {{ vehicle.current_latitude }}, {{ vehicle.current_longitude }}
                </span>
                <span v-else class="text-sm text-gray-400 dark:text-gray-500">Нет данных</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <CreditCard class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Покупка и документы</h2>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Стоимость покупки</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
                {{ vehicle.purchase_price ? formatKZT(parseFloat(vehicle.purchase_price)) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Дата покупки</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
                {{ vehicle.purchase_date ? formatDate(vehicle.purchase_date) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Страховка до</p>
              <p :class="['text-sm font-semibold', expiryClass(vehicle.insurance_expiry)]">
                {{ vehicle.insurance_expiry ? formatDate(vehicle.insurance_expiry) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Тех. осмотр до</p>
              <p :class="['text-sm font-semibold', expiryClass(vehicle.inspection_expiry)]">
                {{ vehicle.inspection_expiry ? formatDate(vehicle.inspection_expiry) : '—' }}
              </p>
            </div>
          </div>
        </div>


        <div class="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <CreditCard class="h-4 w-4 text-brand-500" />
            </div>
              <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Стоимость аренды</h2>

              <button
                @click="openEditPriceModal"
                class="ml-auto inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                <Pencil class="h-4 w-4" />
                Редактировать
              </button>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Цена дневного тарифа</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-white/90">
                {{ fetchedDailyRate ? formatKZT(parseFloat(String(fetchedDailyRate))) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Действителен с</p>
              <p :class="['text-sm font-semibold', expiryClass(vehicle.insurance_expiry)]">
                {{ valid_from ? formatDate(valid_from) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Действителен до</p>
              <p :class="['text-sm font-semibold', expiryClass(vehicle.inspection_expiry)]">
                {{ valid_to ? formatDate(valid_to) : '—' }}
              </p>
            </div>
          </div>
        </div>


        <div class="mt-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-2 border-b border-gray-100 p-5 dark:border-gray-800">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <Calendar class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">История аренд</h2>
            <span class="ml-auto tabular-nums rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {{ rentals.length }}
            </span>
          </div>

          <div v-if="rentalsLoading" class="space-y-3 p-5">
            <div v-for="i in 3" :key="i" class="h-12 rounded-xl skeleton-shimmer" />
          </div>

          <div
            v-else-if="rentals.length === 0"
            class="flex flex-col items-center gap-3 py-10"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Calendar class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет истории аренд</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800">
                  <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
                  <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Клиент</th>
                  <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Период</th>
                  <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Сумма</th>
                  <th class="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in rentals"
                  :key="r.id"
                  class="cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
                  @click="$router.push(`/rentals/${r.id}`)"
                >
                  <td class="px-5 py-3">
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
                  <td class="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ clientName(r.client_id) }}
                  </td>
                  <td class="px-5 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {{ formatDate(r.scheduled_start) }} — {{ formatDate(r.scheduled_end) }}
                  </td>
                  <td class="px-5 py-3 text-right tabular-nums text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ r.actual_total ? formatKZT(parseFloat(r.actual_total)) : formatKZT(parseFloat(r.estimated_total)) }}
                  </td>
                  <td class="px-5 py-3 text-right">
                    <div class="flex h-7 w-7 ml-auto items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                      <Eye class="h-3.5 w-3.5" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'financials'">
        <div class="mb-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex flex-wrap items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <TrendingUp class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Финансы</h2>
            <div class="ml-auto flex flex-wrap items-center gap-2">
              <input
                v-model="finDateFrom"
                type="date"
                class="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                @change="loadFinancials"
              />
              <span class="text-sm text-gray-400">—</span>
              <input
                v-model="finDateTo"
                type="date"
                class="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                @change="loadFinancials"
              />
            </div>
          </div>

          <div v-if="financialsLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="i in 3" :key="i" class="h-24 rounded-xl skeleton-shimmer" />
          </div>

          <div v-else-if="financials">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-xl bg-success-50 p-4 dark:bg-success-500/10">
                <p class="mb-1 text-xs font-medium text-success-700 dark:text-success-400">Выручка</p>
                <p class="tabular-nums text-xl font-bold text-success-700 dark:text-success-400">
                  {{ formatKZT(parseFloat(financials.total_revenue)) }}
                </p>
              </div>
              <div class="rounded-xl bg-error-50 p-4 dark:bg-error-500/10">
                <p class="mb-1 text-xs font-medium text-error-700 dark:text-error-400">Расходы</p>
                <p class="tabular-nums text-xl font-bold text-error-700 dark:text-error-400">
                  {{ formatKZT(parseFloat(financials.total_expenses)) }}
                </p>
              </div>
              <div
                :class="[
                  'rounded-xl p-4',
                  parseFloat(financials.net_profit) >= 0
                    ? 'bg-success-50 dark:bg-success-500/10'
                    : 'bg-error-50 dark:bg-error-500/10',
                ]"
              >
                <p
                  :class="[
                    'mb-1 text-xs font-medium',
                    parseFloat(financials.net_profit) >= 0
                      ? 'text-success-700 dark:text-success-400'
                      : 'text-error-700 dark:text-error-400',
                  ]"
                >
                  Чистая прибыль
                </p>
                <p
                  :class="[
                    'tabular-nums text-xl font-bold',
                    parseFloat(financials.net_profit) >= 0
                      ? 'text-success-700 dark:text-success-400'
                      : 'text-error-700 dark:text-error-400',
                  ]"
                >
                  {{ formatKZT(parseFloat(financials.net_profit)) }}
                </p>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div class="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Загруженность</p>
                <div class="flex items-center gap-3">
                  <div class="flex-1 overflow-hidden rounded-full bg-gray-200 h-2 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full bg-brand-500 transition-all"
                      :style="{ width: `${Math.min(parseFloat(financials.utilization_percent), 100)}%` }"
                    />
                  </div>
                  <span class="tabular-nums text-sm font-semibold text-gray-800 dark:text-white/90">
                    {{ parseFloat(financials.utilization_percent).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Количество аренд</p>
                <p class="tabular-nums text-xl font-bold text-gray-800 dark:text-white/90">
                  {{ financials.total_rentals }}
                </p>
              </div>
              <div class="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Дней в аренде / Период</p>
                <p class="tabular-nums text-xl font-bold text-gray-800 dark:text-white/90">
                  {{ financials.days_rented }}
                  <span class="text-sm font-normal text-gray-400 dark:text-gray-500">/ {{ financials.days_in_period }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center gap-3 py-10">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <TrendingUp class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет данных за выбранный период</p>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'timeline'">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-5 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <Clock class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">История событий</h2>
          </div>

          <div v-if="timelineLoading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="flex gap-4">
              <div class="h-8 w-8 rounded-full skeleton-shimmer shrink-0" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-48 rounded skeleton-shimmer" />
                <div class="h-3 w-64 rounded skeleton-shimmer" />
              </div>
            </div>
          </div>

          <div v-else-if="timeline.length === 0" class="flex flex-col items-center gap-3 py-10">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Clock class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет событий</p>
          </div>

          <div v-else class="relative space-y-0">
            <div
              v-for="(event, idx) in timeline"
              :key="event.id"
              class="flex gap-4"
              :class="idx < timeline.length - 1 ? 'pb-5' : ''"
            >
              <div class="relative flex flex-col items-center">
                <div
                  :class="[
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    timelineIconBg(event.event_type),
                  ]"
                >
                  <component :is="timelineIcon(event.event_type)" class="h-4 w-4" :class="timelineIconColor(event.event_type)" />
                </div>
                <div
                  v-if="idx < timeline.length - 1"
                  class="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-700"
                />
              </div>
              <div
                class="flex-1 pb-1"
                :class="[
                  event.event_type === 'rental' && event.metadata?.rental_id
                    ? 'cursor-pointer'
                    : '',
                ]"
                @click="event.event_type === 'rental' && event.metadata?.rental_id
                  ? $router.push(`/rentals/${event.metadata.rental_id}`)
                  : undefined"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ event.title }}</p>
                  <span v-if="event.amount" :class="['tabular-nums text-xs font-semibold', timelineAmountColor(event.event_type)]">
                    {{ event.event_type === 'rental' ? '+' : '−' }}{{ formatKZT(parseFloat(event.amount)) }}
                  </span>
                </div>
                <p v-if="event.description" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ event.description }}
                </p>
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ formatDate(event.event_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'documents'">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <FileText class="h-4 w-4 text-brand-500" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800 dark:text-white/90">Документы</h2>
            <button
              @click="showDocModal = true"
              class="ml-auto inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600"
            >
              <Plus class="h-3.5 w-3.5" />
              Добавить документ
            </button>
          </div>

          <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Страховка до</p>
                <p :class="['mt-0.5 text-sm font-semibold', expiryClass(vehicle.insurance_expiry)]">
                  {{ vehicle.insurance_expiry ? formatDate(vehicle.insurance_expiry) : '—' }}
                </p>
              </div>
              <Shield class="h-5 w-5 text-gray-300 dark:text-gray-600" />
            </div>
            <div class="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Тех. осмотр до</p>
                <p :class="['mt-0.5 text-sm font-semibold', expiryClass(vehicle.inspection_expiry)]">
                  {{ vehicle.inspection_expiry ? formatDate(vehicle.inspection_expiry) : '—' }}
                </p>
              </div>
              <ClipboardCheck class="h-5 w-5 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          <div v-if="docsLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="h-28 rounded-xl skeleton-shimmer" />
          </div>

          <div
            v-else-if="documents.length === 0"
            class="flex flex-col items-center gap-3 py-10"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FileText class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Нет загруженных документов</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
            >
              <div class="mb-3 flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">{{ doc.name }}</p>
                  <span :class="['mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium', docTypeStyle(doc.document_type)]">
                    {{ docTypeLabel(doc.document_type) }}
                  </span>
                </div>
                <button
                  @click="handleDeleteDoc(doc.id)"
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
              <div v-if="doc.expiry_date" class="mb-3">
                <p class="text-xs text-gray-500 dark:text-gray-400">Действителен до</p>
                <p :class="['text-xs font-medium', expiryClass(doc.expiry_date)]">
                  {{ formatDate(doc.expiry_date) }}
                </p>
              </div>
              <a
                :href="doc.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-xs font-medium text-brand-500 hover:text-brand-600 hover:underline dark:text-brand-400"
              >
                <ExternalLink class="h-3.5 w-3.5" />
                Открыть
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="flex flex-col items-center gap-4 py-20">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <CarFront class="h-8 w-8 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Автомобиль не найден</p>
      <router-link
        to="/fleet"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        <ArrowLeft class="h-4 w-4" />
        К списку автопарка
      </router-link>
    </div>

    <transition name="modal">
      <div
        v-if="showStatusModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showStatusModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-50 dark:bg-warning-500/10">
                <AlertTriangle class="h-5 w-5 text-warning-500" />
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Подтвердите действие</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Изменить статус на «{{ pendingStatusLabel }}»?
                </p>
              </div>
              <button
                @click="showStatusModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="showStatusModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="confirmStatusChange"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Подтвердить
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showEditModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-2xl rounded-2xl bg-white shadow-theme-xl dark:bg-gray-900">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                  <Pencil class="h-4 w-4 text-brand-500" />
                </div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Редактировать автомобиль</h3>
              </div>
              <button
                @click="showEditModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="max-h-[68vh] overflow-y-auto px-6 py-5 space-y-6">

              <!-- Основная информация -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Основная информация</p>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Псевдоним</label>
                    <input
                      v-model="editForm.nickname"
                      type="text"
                      placeholder="Например: Синяя пятёрка"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Марка</label>
                    <input
                      v-model="editForm.make"
                      type="text"
                      placeholder="Toyota"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Модель</label>
                    <input
                      v-model="editForm.model"
                      type="text"
                      placeholder="Camry"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Год выпуска</label>
                    <input
                      v-model="editForm.year"
                      type="number"
                      placeholder="2022"
                      min="1900"
                      :max="new Date().getFullYear() + 1"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Гос. номер</label>
                    <input
                      v-model="editForm.license_plate"
                      type="text"
                      placeholder="123 ABC 01"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">VIN</label>
                    <input
                      v-model="editForm.vin"
                      type="text"
                      placeholder="JTDBE30K123456789"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Цвет</label>
                    <input
                      v-model="editForm.color"
                      type="text"
                      placeholder="Белый"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Характеристики -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Характеристики</p>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Категория</label>
                    <input
                      v-model="editForm.category"
                      type="text"
                      placeholder="Седан"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Пробег, км</label>
                    <input
                      v-model="editForm.current_mileage"
                      type="number"
                      placeholder="50000"
                      min="0"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип топлива</label>
                    <div class="relative">
                      <select
                        v-model="editForm.fuel_type"
                        class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                      >
                        <option value="">— Выбрать —</option>
                        <option value="petrol">Бензин</option>
                        <option value="diesel">Дизель</option>
                        <option value="gas">Газ</option>
                        <option value="electric">Электро</option>
                        <option value="hybrid">Гибрид</option>
                      </select>
                      <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Трансмиссия</label>
                    <div class="relative">
                      <select
                        v-model="editForm.transmission"
                        class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                      >
                        <option value="">— Выбрать —</option>
                        <option value="manual">Механика</option>
                        <option value="automatic">Автомат</option>
                      </select>
                      <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Покупка и документы -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Покупка и документы</p>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Стоимость покупки, ₸</label>
                    <input
                      v-model="editForm.purchase_price"
                      type="number"
                      placeholder="5000000"
                      min="0"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Дата покупки</label>
                    <input
                      v-model="editForm.purchase_date"
                      type="date"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Страховка до</label>
                    <input
                      v-model="editForm.insurance_expiry"
                      type="date"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Тех. осмотр до</label>
                    <input
                      v-model="editForm.inspection_expiry"
                      type="date"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Инвестор -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Инвестор</p>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Привязать инвестора</label>
                  <div class="relative">
                    <select
                      v-model="editForm.investor_id"
                      class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    >
                      <option value="">Без инвестора (собственный)</option>
                      <option v-for="inv in investors" :key="inv.id" :value="inv.id">{{ inv.full_name }}</option>
                    </select>
                    <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <!-- GPS и прочее -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">GPS и прочее</p>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">GPS устройство ID</label>
                    <input
                      v-model="editForm.gps_device_id"
                      type="text"
                      placeholder="GPS-001"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                @click="showEditModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleSaveEdit"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Сохранить
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showEditPriceModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showEditPriceModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-2xl rounded-2xl bg-white shadow-theme-xl dark:bg-gray-900">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                  <Pencil class="h-4 w-4 text-brand-500" />
                </div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Редактировать данные аренды</h3>
              </div>
              <button
                @click="showEditPriceModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="max-h-[68vh] overflow-y-auto px-6 py-5 space-y-6">

              <!-- Покупка и документы -->
              <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Детали арендной платы</p>
                <div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Цена дневного тарифа, ₸</label>
                    <input
                      v-model="editPriceForm.base_daily_rate"
                      type="number"
                      :placeholder="String(fetchedDailyRate)"
                      min="0"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Действителен с</label>
                    <input
                      v-model="editPriceForm.valid_from"
                      type="date"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Действителен до</label>
                    <input
                      v-model="editPriceForm.valid_to"
                      type="date"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                    />
                  </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                @click="showEditPriceModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleSavePriceEdit"
                :disabled="actionLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Сохранить
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="showDocModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="showDocModal = false"
      >
        <transition name="modal-panel">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Добавить документ</h3>
              <button
                @click="showDocModal = false"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип документа</label>
                <div class="relative">
                  <select
                    v-model="docForm.document_type"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="insurance">Страховка</option>
                    <option value="registration">Регистрация</option>
                    <option value="inspection">Тех. осмотр</option>
                    <option value="other">Другое</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Название</label>
                <input
                  v-model="docForm.name"
                  type="text"
                  placeholder="Название документа"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                <input
                  v-model="docForm.url"
                  type="url"
                  placeholder="https://"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Дата окончания</label>
                <input
                  v-model="docForm.expiry_date"
                  type="date"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>
            </div>
            <div class="mt-5 flex items-center justify-end gap-3">
              <button
                @click="showDocModal = false"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              >
                Отмена
              </button>
              <button
                @click="handleCreateDoc"
                :disabled="actionLoading || !docForm.name.trim() || !docForm.url.trim()"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60"
              >
                <Loader2 v-if="actionLoading" class="h-4 w-4 animate-spin" />
                Сохранить
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
  ArrowLeft, CarFront, Settings2, Gauge, CreditCard, Calendar,
  Plus, Wrench, Droplets, Ban, TagIcon, CheckCircle2, X, Loader2,
  AlertTriangle, TrendingUp, Clock, FileText, ExternalLink, Trash2,
  Eye, ChevronDown, Shield, ClipboardCheck, Pencil,
} from 'lucide-vue-next'
import { useVehicles } from '@/composables/useVehicles'
import { useRentals } from '@/composables/useRentals'
import { useClients } from '@/composables/useClients'
import { useInvestors } from '@/composables/useInvestors'
import { useToast } from '@/composables/useToast'
import { formatKZT, formatNumber } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  vehicleStatusLabel, vehicleStatusStyle,
  rentalStatusLabel, rentalStatusDot, rentalStatusStyle,
} from '@/utils/status'
import type { VehicleStatus, RentalStatus, TimelineEvent, Client } from '@/types'

const route = useRoute()
const id = route.params.id as string
const activeTab = ref('overview')

const {
  vehicle, loading, financials, timeline, documents,
  fetchOne, fetchFinancials, fetchTimeline, fetchDocuments,
  changeStatus, update, createDocument, deleteDocument,
  listRentalPrice, updateRentalPrice
} = useVehicles()

const { rentals, loading: rentalsLoading, fetchAll: fetchRentals } = useRentals()
const { clients, fetchAll: fetchClients } = useClients()
const { investors, fetchAll: fetchInvestors, bindVehicle } = useInvestors()

const clientMap = computed(() => {
  const map = new Map<string, Client>()
  for (const c of clients.value) map.set(c.id, c)
  return map
})

function clientName(id: string): string {
  const c = clientMap.value.get(id)
  return c ? `${c.first_name} ${c.last_name}` : id.slice(0, 8).toUpperCase()
}

const toast = useToast()

const financialsLoading = ref(false)
const timelineLoading = ref(false)
const docsLoading = ref(false)
const actionLoading = ref(false)

const showStatusModal = ref(false)
const pendingStatus = ref<VehicleStatus | null>(null)
const showDocModal = ref(false)
const showEditModal = ref(false)
const showEditPriceModal = ref(false)

interface EditForm {
  nickname: string
  make: string
  model: string
  year: string
  vin: string
  license_plate: string
  color: string
  category: string
  fuel_type: string
  transmission: string
  current_mileage: string
  purchase_price: string
  purchase_date: string
  insurance_expiry: string
  inspection_expiry: string
  gps_device_id: string
  branch_id: string
  investor_id: string
}

interface EditPriceForm {
  base_daily_rate: string
  valid_from: string
  valid_to: string
}

const editPriceForm = reactive<EditPriceForm>({
  base_daily_rate: '',
  valid_from: '',
  valid_to: ''
})

let editPriceFormSnapshot: EditPriceForm = { ...editPriceForm}


const editForm = reactive<EditForm>({
  nickname: '',
  make: '',
  model: '',
  year: '',
  vin: '',
  license_plate: '',
  color: '',
  category: '',
  fuel_type: '',
  transmission: '',
  current_mileage: '',
  purchase_price: '',
  purchase_date: '',
  insurance_expiry: '',
  inspection_expiry: '',
  gps_device_id: '',
  branch_id: '',
  investor_id: '',
})

let editFormSnapshot: EditForm = { ...editForm }

function openEditModal() {
  if (!vehicle.value) return
  const v = vehicle.value
  editForm.nickname = v.nickname ?? ''
  editForm.make = v.make ?? ''
  editForm.model = v.model ?? ''
  editForm.year = v.year != null ? String(v.year) : ''
  editForm.vin = v.vin ?? ''
  editForm.license_plate = v.license_plate ?? ''
  editForm.color = v.color ?? ''
  editForm.category = v.category ?? ''
  editForm.fuel_type = v.fuel_type ?? ''
  editForm.transmission = v.transmission ?? ''
  editForm.current_mileage = v.current_mileage != null ? String(v.current_mileage) : ''
  editForm.purchase_price = v.purchase_price != null ? String(parseFloat(v.purchase_price)) : ''
  editForm.purchase_date = v.purchase_date ?? ''
  editForm.insurance_expiry = v.insurance_expiry ?? ''
  editForm.inspection_expiry = v.inspection_expiry ?? ''
  editForm.gps_device_id = v.gps_device_id ?? ''
  editForm.branch_id = v.branch_id ?? ''
  editForm.investor_id = ''
  editFormSnapshot = { ...editForm }
  showEditModal.value = true
}

function openEditPriceModal() {
  const price = currentVehiclePricing.value

  if (!price) {
    toast.error('Цена для редактирования не найдена')
    return
  }

  editPriceForm.base_daily_rate = String(Number(price.base_daily_rate))
  editPriceForm.valid_from = price.valid_from
  editPriceForm.valid_to = price.valid_to

  editPriceFormSnapshot = { ...editPriceForm }
  showEditPriceModal.value = true
}


async function handleSavePriceEdit() {
  const price = currentVehiclePricing.value

  if (!price) {
    toast.error('Цена для редактирования не найдена')
    return
  }

  actionLoading.value = true

  try {
    const payload: Record<string, unknown> = {}

    if (editPriceForm.base_daily_rate !== editPriceFormSnapshot.base_daily_rate) {
      payload.base_daily_rate = String(editPriceForm.base_daily_rate)
    }

    if (editPriceForm.valid_from !== editPriceFormSnapshot.valid_from) {
      payload.valid_from = editPriceForm.valid_from
    }

    if (editPriceForm.valid_to !== editPriceFormSnapshot.valid_to) {
      payload.valid_to = editPriceForm.valid_to
    }

    if (Object.keys(payload).length > 0) {
      await updateRentalPrice(price.id, payload)
      await fetchVehiclePricing(id)
    }

    showEditPriceModal.value = false
    toast.success('Цена аренды обновлена')
  } catch {
    toast.error('Ошибка при обновлении цены аренды')
  } finally {
    actionLoading.value = false
  }
}

async function handleSaveEdit() {
  actionLoading.value = true
  try {
    const payload: Record<string, unknown> = {}

    if (editForm.nickname !== editFormSnapshot.nickname)
      payload.nickname = editForm.nickname.trim() || null
    if (editForm.make !== editFormSnapshot.make && editForm.make.trim())
      payload.make = editForm.make.trim()
    if (editForm.model !== editFormSnapshot.model && editForm.model.trim())
      payload.model = editForm.model.trim()
    if (editForm.year !== editFormSnapshot.year && editForm.year.trim())
      payload.year = Number(editForm.year)
    if (editForm.vin !== editFormSnapshot.vin)
      payload.vin = editForm.vin.trim() || null
    if (editForm.license_plate !== editFormSnapshot.license_plate && editForm.license_plate.trim())
      payload.license_plate = editForm.license_plate.trim()
    if (editForm.color !== editFormSnapshot.color && editForm.color.trim())
      payload.color = editForm.color.trim()
    if (editForm.category !== editFormSnapshot.category && editForm.category.trim())
      payload.category = editForm.category.trim()
    if (editForm.fuel_type !== editFormSnapshot.fuel_type && editForm.fuel_type)
      payload.fuel_type = editForm.fuel_type
    if (editForm.transmission !== editFormSnapshot.transmission && editForm.transmission)
      payload.transmission = editForm.transmission
    if (editForm.current_mileage !== editFormSnapshot.current_mileage && editForm.current_mileage.trim())
      payload.current_mileage = Number(editForm.current_mileage)
    if (editForm.purchase_price !== editFormSnapshot.purchase_price)
      payload.purchase_price = editForm.purchase_price.trim() ? Number(editForm.purchase_price) : null
    if (editForm.purchase_date !== editFormSnapshot.purchase_date)
      payload.purchase_date = editForm.purchase_date || null
    if (editForm.insurance_expiry !== editFormSnapshot.insurance_expiry)
      payload.insurance_expiry = editForm.insurance_expiry || null
    if (editForm.inspection_expiry !== editFormSnapshot.inspection_expiry)
      payload.inspection_expiry = editForm.inspection_expiry || null
    if (editForm.gps_device_id !== editFormSnapshot.gps_device_id)
      payload.gps_device_id = editForm.gps_device_id.trim() || null
    if (editForm.branch_id !== editFormSnapshot.branch_id)
      payload.branch_id = editForm.branch_id.trim() || null

    if (Object.keys(payload).length > 0) {
      await update(id, payload)
    }
    if (editForm.investor_id && editForm.investor_id !== editFormSnapshot.investor_id) {
      await bindVehicle(editForm.investor_id, id)
    }
    showEditModal.value = false
    await fetchOne(id)
    toast.success('Данные обновлены')
  } catch {
    toast.error('Ошибка при обновлении')
  } finally {
    actionLoading.value = false
  }
}

const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
const finDateFrom = ref(firstDay.toISOString().slice(0, 10))
const finDateTo = ref(lastDay.toISOString().slice(0, 10))

const docForm = reactive({
  document_type: 'insurance',
  name: '',
  url: '',
  expiry_date: '',
})

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'financials', label: 'Финансы' },
  { key: 'timeline', label: 'История' },
  { key: 'documents', label: 'Документы' },
]

const activeRentalId = computed(() => {
  if (!rentals.value.length) return null
  const active = rentals.value.find(
    (r) => r.status === 'active' || r.status === 'returning',
  )
  return active?.id ?? null
})

const statusLabel = computed(() => vehicle.value ? vehicleStatusLabel(vehicle.value.status) : '')
const statusStyle = computed(() => vehicle.value ? vehicleStatusStyle(vehicle.value.status) : '')
const pendingStatusLabel = computed(() => pendingStatus.value ? vehicleStatusLabel(pendingStatus.value) : '')

function expiryClass(dateStr: string | null): string {
  if (!dateStr) return 'text-gray-700 dark:text-gray-300'
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86400000
  if (diff < 0) return 'text-error-600 dark:text-error-400'
  if (diff <= 30) return 'text-warning-600 dark:text-warning-400'
  return 'text-gray-700 dark:text-gray-300'
}

function openStatusModal(status: VehicleStatus) {
  pendingStatus.value = status
  showStatusModal.value = true
}

async function confirmStatusChange() {
  if (!pendingStatus.value) return
  actionLoading.value = true
  try {
    await changeStatus(id, pendingStatus.value)
    showStatusModal.value = false
    await fetchOne(id)
    toast.success('Статус обновлён')
  } catch {
    toast.error('Ошибка при обновлении статуса')
  } finally {
    actionLoading.value = false
  }
}

async function loadFinancials() {
  financialsLoading.value = true
  try {
    await fetchFinancials(id, finDateFrom.value, finDateTo.value)
  } finally {
    financialsLoading.value = false
  }
}

async function handleCreateDoc() {
  if (!docForm.name.trim() || !docForm.url.trim()) return
  actionLoading.value = true
  try {
    await createDocument({
      vehicle_id: id,
      document_type: docForm.document_type,
      name: docForm.name,
      url: docForm.url,
      expiry_date: docForm.expiry_date || undefined,
    })
    showDocModal.value = false
    docForm.name = ''
    docForm.url = ''
    docForm.expiry_date = ''
    docForm.document_type = 'insurance'
    await loadDocs()
    toast.success('Документ добавлен')
  } catch {
    toast.error('Ошибка при добавлении документа')
  } finally {
    actionLoading.value = false
  }
}

async function handleDeleteDoc(docId: string) {
  try {
    await deleteDocument(docId)
    await loadDocs()
    toast.success('Документ удалён')
  } catch {
    toast.error('Ошибка при удалении документа')
  }
}

async function loadDocs() {
  docsLoading.value = true
  try {
    await fetchDocuments(id)
  } finally {
    docsLoading.value = false
  }
}
const fetchedDailyRate = ref(0)
const valid_from = ref('')
const valid_to = ref('')
const currentVehiclePricing = ref<VehiclePricing | null>(null)

interface VehiclePricing {
  id: string
  vehicle_id: string
  base_daily_rate: string
  name: string
  multiplier: string
  valid_from: string
  valid_to: string
  is_active: boolean
  created_at: string
}

interface ListVehiclePricingResponse {
  items: VehiclePricing[]
}

async function fetchVehiclePricing(vehicleId: string) {
  if (!vehicleId) {
    fetchedDailyRate.value = 0
    valid_from.value = ''
    valid_to.value = ''
    currentVehiclePricing.value = null
    return
  }

  try {
    const data = await listRentalPrice(vehicleId, true) as ListVehiclePricingResponse
    const prices = data.items ?? []

    if (prices.length === 0) {
      fetchedDailyRate.value = 0
      valid_from.value = '--'
      valid_to.value = '--'
      currentVehiclePricing.value = null
      toast.error('Для этого автомобиля цена не найдена')
      return
    }

    const mostRecentPrice = [...prices].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })[0]

    currentVehiclePricing.value = mostRecentPrice

    const baseDailyRate = Number(mostRecentPrice.base_daily_rate)
    const multiplier = Number(mostRecentPrice.multiplier)

    fetchedDailyRate.value = baseDailyRate * multiplier
    valid_from.value = mostRecentPrice.valid_from
    valid_to.value = mostRecentPrice.valid_to
  } catch {
    fetchedDailyRate.value = 0
    valid_from.value = '--'
    valid_to.value = '--'
    currentVehiclePricing.value = null
    toast.error('Не удалось загрузить цену автомобиля')
  }
}

onMounted(async () => {
  await fetchOne(id)
  await Promise.all([
  fetchVehiclePricing(id),
  fetchRentals({ vehicle_id: id }),
  fetchClients(),
  fetchInvestors(),
  loadFinancials(),
  (async () => {
    timelineLoading.value = true
    try {
      await fetchTimeline(id)
    } finally {
      timelineLoading.value = false
    }
  })(),
  loadDocs(),
])
})

function timelineIcon(type: TimelineEvent['event_type']) {
  const map = {
    rental: CarFront,
    expense: CreditCard,
    fine: AlertTriangle,
    service_task: Wrench,
  }
  return map[type] ?? FileText
}

function timelineIconBg(type: TimelineEvent['event_type']): string {
  const map: Record<TimelineEvent['event_type'], string> = {
    rental:       'bg-brand-50 dark:bg-brand-500/10',
    expense:      'bg-error-50 dark:bg-error-500/10',
    fine:         'bg-orange-50 dark:bg-orange-500/10',
    service_task: 'bg-gray-100 dark:bg-gray-800',
  }
  return map[type] ?? 'bg-gray-100'
}

function timelineIconColor(type: TimelineEvent['event_type']): string {
  const map: Record<TimelineEvent['event_type'], string> = {
    rental:       'text-brand-500',
    expense:      'text-error-500',
    fine:         'text-orange-500',
    service_task: 'text-gray-500 dark:text-gray-400',
  }
  return map[type] ?? 'text-gray-500'
}

function timelineAmountColor(type: TimelineEvent['event_type']): string {
  return type === 'rental'
    ? 'text-success-600 dark:text-success-400'
    : 'text-error-600 dark:text-error-400'
}

function docTypeLabel(type: string): string {
  const map: Record<string, string> = {
    insurance: 'Страховка',
    registration: 'Регистрация',
    inspection: 'Тех. осмотр',
    other: 'Другое',
  }
  return map[type] ?? type
}

function docTypeStyle(type: string): string {
  const map: Record<string, string> = {
    insurance:    'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
    registration: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    inspection:   'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    other:        'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
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
