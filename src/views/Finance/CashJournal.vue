<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Касса</h1>
      <div class="flex items-center gap-2">
        <button
          @click="openCreateModal('income')"
          class="inline-flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-2.5 text-sm font-medium text-success-700 shadow-theme-xs transition-colors hover:bg-success-100 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400"
        >
          <ArrowDownLeft class="h-4 w-4" />
          + Приход
        </button>
        <button
          @click="openCreateModal('expense')"
          class="inline-flex items-center gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-2.5 text-sm font-medium text-error-700 shadow-theme-xs transition-colors hover:bg-error-100 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
        >
          <ArrowUpRight class="h-4 w-4" />
          + Расход
        </button>
        <button
          @click="handleExport"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download class="h-4 w-4" />
          Экспорт
        </button>
      </div>
    </div>

    <!-- Balance summary cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Текущий баланс</p>
        <template v-if="loading">
          <div class="h-8 w-32 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-gray-800 dark:text-white/90">
          {{ formatKZT(currentBalance) }}
        </p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Приход (период)</p>
        <template v-if="loading">
          <div class="h-8 w-32 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-success-600 dark:text-success-400">
          +{{ formatKZT(periodIncome) }}
        </p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Расход (период)</p>
        <template v-if="loading">
          <div class="h-8 w-32 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-error-600 dark:text-error-400">
          -{{ formatKZT(periodExpense) }}
        </p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Операций</p>
        <template v-if="loading">
          <div class="h-8 w-16 rounded skeleton-shimmer" />
        </template>
        <p v-else class="tabular-nums text-2xl font-bold tracking-tight text-gray-800 dark:text-white/90">
          {{ total }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Date from -->
      <input
        v-model="filters.date_from"
        type="date"
        @change="onFilterChange"
        class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      />
      <span class="text-sm text-gray-400">—</span>
      <input
        v-model="filters.date_to"
        type="date"
        @change="onFilterChange"
        class="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      />

      <!-- Operation type -->
      <div class="relative">
        <select
          v-model="filters.operation_type"
          @change="onFilterChange"
          class="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все операции</option>
          <option value="income">Приход</option>
          <option value="expense">Расход</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Vehicle -->
      <div class="relative">
        <select
          v-model="filters.vehicle_id"
          @change="onFilterChange"
          class="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все авто</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">
            {{ v.make }} {{ v.model }} {{ v.license_plate }}
          </option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Expense category -->
      <div class="relative">
        <select
          v-model="filters.expense_category_id"
          @change="onFilterChange"
          class="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все категории</option>
          <optgroup label="Прямые">
            <option v-for="c in directExpenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </optgroup>
          <optgroup label="Накладные">
            <option v-for="c in overheadExpenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </optgroup>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <!-- Payment method -->
      <div class="relative">
        <select
          v-model="filters.payment_method"
          @change="onFilterChange"
          class="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="">Все способы</option>
          <option value="cash">Наличные</option>
          <option value="kaspi">Kaspi</option>
          <option value="card">Карта</option>
          <option value="wallet">Кошелёк</option>
          <option value="bank_transfer">Перевод</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
        <div class="flex gap-6">
          <div class="h-4 w-16 rounded skeleton-shimmer" />
          <div class="h-4 w-14 rounded skeleton-shimmer" />
          <div class="h-4 w-48 rounded skeleton-shimmer flex-1" />
          <div class="h-4 w-20 rounded skeleton-shimmer" />
          <div class="h-4 w-16 rounded skeleton-shimmer" />
          <div class="h-4 w-20 rounded skeleton-shimmer" />
          <div class="h-4 w-14 rounded skeleton-shimmer" />
          <div class="h-4 w-16 rounded skeleton-shimmer" />
        </div>
      </div>
      <div
        v-for="i in 8"
        :key="i"
        class="flex items-center gap-4 border-b border-gray-50 px-5 py-3.5 last:border-0 dark:border-gray-800/50"
      >
        <div class="h-4 w-20 rounded skeleton-shimmer" />
        <div class="h-6 w-16 rounded-full skeleton-shimmer" />
        <div class="h-4 w-48 rounded skeleton-shimmer flex-1" />
        <div class="h-4 w-24 rounded skeleton-shimmer" />
        <div class="h-5 w-20 rounded-full skeleton-shimmer" />
        <div class="h-4 w-24 rounded skeleton-shimmer text-right" />
        <div class="h-5 w-16 rounded-full skeleton-shimmer" />
      </div>
    </div>

    <!-- Journal table -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Дата</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Тип</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Описание</th>
              <th class="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 lg:table-cell">Авто</th>
              <th class="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 md:table-cell">Категория</th>
              <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Способ</th>
              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Сумма</th>
              <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
              <th class="w-10 px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            <!-- Empty state -->
            <tr v-if="entries.length === 0">
              <td colspan="9" class="px-5 py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Wallet class="h-7 w-7 text-gray-400" />
                  </div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Нет операций</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">Добавьте приход или расход</p>
                </div>
              </td>
            </tr>

            <tr
              v-for="entry in entries"
              :key="entry.id"
              class="group border-b border-gray-50 last:border-0 transition-colors duration-100 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-white/[0.02]"
            >
              <!-- Дата -->
              <td class="px-5 py-3">
                <p class="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ formatDate(entry.date) }}</p>
              </td>

              <!-- Тип -->
              <td class="px-5 py-3">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    entry.operation_type === 'income'
                      ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                      : 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
                  ]"
                >
                  <component :is="entry.operation_type === 'income' ? ArrowDownLeft : ArrowUpRight" class="h-3 w-3" />
                  {{ entry.operation_type === 'income' ? 'Приход' : 'Расход' }}
                </span>
              </td>

              <!-- Описание -->
              <td class="px-5 py-3">
                <p class="max-w-xs truncate text-sm text-gray-800 dark:text-white/90">
                  {{ entry.description || '—' }}
                </p>
              </td>

              <!-- Авто -->
              <td class="hidden px-5 py-3 lg:table-cell">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ vehicleName(entry.vehicle_id) }}</span>
              </td>

              <!-- Категория -->
              <td class="hidden px-5 py-3 md:table-cell">
                <span
                  v-if="categoryName(entry.expense_category_id) !== '—'"
                  class="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {{ categoryName(entry.expense_category_id) }}
                </span>
                <span v-else class="text-sm text-gray-400">—</span>
              </td>

              <!-- Способ оплаты -->
              <td class="px-5 py-3">
                <span :class="paymentMethodClass(entry.payment_method)">
                  {{ paymentMethodLabel(entry.payment_method) }}
                </span>
              </td>

              <!-- Сумма -->
              <td class="px-5 py-3 text-right">
                <span
                  :class="[
                    'tabular-nums text-sm font-semibold',
                    entry.operation_type === 'income'
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-error-600 dark:text-error-400',
                  ]"
                >
                  {{ entry.operation_type === 'income' ? '+' : '-' }}{{ formatKZT(parseFloat(entry.amount)) }}
                </span>
              </td>

              <!-- Статус подтверждения -->
              <td class="px-5 py-3 text-center">
                <span
                  v-if="entry.confirmed_at"
                  class="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"
                >
                  <Check class="h-3 w-3" />
                  OK
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                >
                  <Clock class="h-3 w-3" />
                  Ожидает
                </span>
              </td>

              <!-- Row actions -->
              <td class="px-3 py-3">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    v-if="!entry.confirmed_at"
                    @click="handleConfirm(entry.id)"
                    title="Подтвердить"
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/10 dark:hover:text-success-400"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </button>
                  <button
                    @click="openEditModal(entry)"
                    title="Редактировать"
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    @click="openDeleteModal(entry)"
                    title="Удалить"
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10 dark:hover:text-error-400"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create / Edit modal -->
  <Teleport to="body">
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click.self="closeFormModal"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ editingEntry ? 'Редактировать операцию' : (formData.operation_type === 'income' ? '+ Приход' : '+ Расход') }}
          </h2>
          <button
            @click="closeFormModal"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <!-- Date -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Дата</label>
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <!-- Operation type toggle -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип операции</label>
            <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                :disabled="!!lockedType"
                @click="formData.operation_type = 'income'"
                :class="[
                  'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                  formData.operation_type === 'income'
                    ? 'bg-success-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                ]"
              >
                <ArrowDownLeft class="mr-1 inline h-3.5 w-3.5" />
                Приход
              </button>
              <button
                type="button"
                :disabled="!!lockedType"
                @click="formData.operation_type = 'expense'"
                :class="[
                  'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                  formData.operation_type === 'expense'
                    ? 'bg-error-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                ]"
              >
                <ArrowUpRight class="mr-1 inline h-3.5 w-3.5" />
                Расход
              </button>
            </div>
          </div>

          <!-- Vehicle -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Автомобиль (необязательно)</label>
            <div class="relative">
              <select
                v-model="formData.vehicle_id"
                class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Не выбрано</option>
                <option v-for="v in vehicles" :key="v.id" :value="v.id">
                  {{ v.make }} {{ v.model }} {{ v.license_plate }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <!-- Category (only for expenses) -->
          <div v-if="formData.operation_type === 'expense'">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Категория расхода</label>
            <div class="relative">
              <select
                v-model="formData.expense_category_id"
                class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Не выбрано</option>
                <optgroup label="Прямые">
                  <option v-for="c in activeDirectCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </optgroup>
                <optgroup label="Накладные">
                  <option v-for="c in activeOverheadCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </optgroup>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <!-- Payment method -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Способ оплаты</label>
            <div class="relative">
              <select
                v-model="formData.payment_method"
                required
                class="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="cash">Наличные</option>
                <option value="kaspi">Kaspi</option>
                <option value="card">Карта</option>
                <option value="wallet">Кошелёк</option>
                <option value="bank_transfer">Перевод</option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Сумма (₸)</label>
            <input
              v-model.number="formData.amount"
              type="number"
              min="0"
              step="1"
              required
              placeholder="0"
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (необязательно)</label>
            <textarea
              v-model="formData.description"
              rows="2"
              placeholder="Комментарий к операции..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <!-- Receipt URL -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ссылка на чек (необязательно)</label>
            <input
              v-model="formData.receipt_url"
              type="url"
              placeholder="https://..."
              class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <!-- Form error -->
          <p v-if="formError" class="text-sm text-error-600 dark:text-error-400">{{ formError }}</p>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              @click="closeFormModal"
              class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="formSubmitting"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              <Loader2 v-if="formSubmitting" class="h-4 w-4 animate-spin" />
              {{ editingEntry ? 'Сохранить' : 'Добавить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Delete confirmation modal -->
  <Teleport to="body">
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click.self="closeDeleteModal"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
          <Trash2 class="h-6 w-6 text-error-600 dark:text-error-400" />
        </div>
        <h2 class="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">Удалить операцию?</h2>
        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
          {{ deletingEntry?.description || 'Без описания' }}
        </p>
        <p class="mb-5 text-sm font-medium" :class="deletingEntry?.operation_type === 'income' ? 'text-success-600' : 'text-error-600'">
          {{ deletingEntry?.operation_type === 'income' ? '+' : '-' }}{{ formatKZT(parseFloat(deletingEntry?.amount ?? '0')) }}
        </p>
        <p v-if="deleteError" class="mb-3 text-sm text-error-600">{{ deleteError }}</p>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Отмена
          </button>
          <button
            @click="handleDelete"
            :disabled="deleteSubmitting"
            class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-error-600 disabled:opacity-60"
          >
            <Loader2 v-if="deleteSubmitting" class="h-4 w-4 animate-spin" />
            Удалить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ArrowDownLeft, ArrowUpRight, ChevronDown, Wallet, Check, Clock,
  CheckCircle, Pencil, Trash2, X, Download, Loader2,
} from 'lucide-vue-next'
import { useCashJournal } from '@/composables/useCashJournal'
import { useToast } from '@/composables/useToast'
import { useExpenseCategories } from '@/composables/useExpenseCategories'
import { useVehicles } from '@/composables/useVehicles'
import { useAuthStore } from '@/stores/auth'
import { formatKZT } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import type { CashJournalEntry, OperationType, PaymentMethod } from '@/types'

// Composables
const { entries, balance, total, loading, fetchEntries, fetchBalance, create, update, remove, confirm, exportToExcel } = useCashJournal()
const { activeCategories: activeExpenseCategories, fetchCategories: fetchExpenseCategories } = useExpenseCategories()
const { vehicles, fetchAll: fetchVehicles } = useVehicles()
const auth = useAuthStore()
const toast = useToast()

// ─── Filters ────────────────────────────────────────────────────────────────

function currentMonthStart(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function currentMonthEnd(): string {
  const d = new Date()
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`
}

const filters = ref({
  date_from: currentMonthStart(),
  date_to: currentMonthEnd(),
  operation_type: '' as OperationType | '',
  vehicle_id: '',
  expense_category_id: '',
  payment_method: '' as PaymentMethod | '',
})

function activeFilters(): Record<string, unknown> {
  const f: Record<string, unknown> = {}
  if (filters.value.date_from) f.date_from = filters.value.date_from
  if (filters.value.date_to) f.date_to = filters.value.date_to
  if (filters.value.operation_type) f.operation_type = filters.value.operation_type
  if (filters.value.vehicle_id) f.vehicle_id = filters.value.vehicle_id
  if (filters.value.expense_category_id) f.expense_category_id = filters.value.expense_category_id
  if (filters.value.payment_method) f.payment_method = filters.value.payment_method
  return f
}

function dateFilters(): Record<string, unknown> {
  const f: Record<string, unknown> = {}
  if (filters.value.date_from) f.date_from = filters.value.date_from
  if (filters.value.date_to) f.date_to = filters.value.date_to
  return f
}

async function onFilterChange() {
  await Promise.all([
    fetchEntries(activeFilters()),
    fetchBalance(dateFilters()),
  ])
}

// ─── Balance computed ────────────────────────────────────────────────────────

const currentBalance = computed(() => parseFloat(balance.value?.balance ?? '0') || 0)
const periodIncome = computed(() => parseFloat(balance.value?.total_income ?? '0') || 0)
const periodExpense = computed(() => parseFloat(balance.value?.total_expense ?? '0') || 0)

// ─── Category & vehicle helpers ──────────────────────────────────────────────

const directExpenseCategories = computed(() =>
  activeExpenseCategories.value.filter((c) => c.type_ === 'direct'),
)
const overheadExpenseCategories = computed(() =>
  activeExpenseCategories.value.filter((c) => c.type_ === 'overhead'),
)
const activeDirectCategories = computed(() =>
  activeExpenseCategories.value.filter((c) => c.type_ === 'direct'),
)
const activeOverheadCategories = computed(() =>
  activeExpenseCategories.value.filter((c) => c.type_ === 'overhead'),
)

function vehicleName(vehicleId: string | null): string {
  if (!vehicleId) return '—'
  const v = vehicles.value.find((x) => x.id === vehicleId)
  return v ? `${v.make} ${v.model} ${v.license_plate}` : '—'
}

function categoryName(categoryId: string | null): string {
  if (!categoryId) return '—'
  const c = activeExpenseCategories.value.find((x) => x.id === categoryId)
  return c?.name ?? '—'
}

// ─── Badge helpers ───────────────────────────────────────────────────────────

function paymentMethodLabel(m: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    cash: 'Наличные',
    kaspi: 'Kaspi',
    card: 'Карта',
    wallet: 'Кошелёк',
    bank_transfer: 'Перевод',
  }
  return map[m] ?? m
}

function paymentMethodClass(m: PaymentMethod): string {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  const variants: Record<PaymentMethod, string> = {
    cash: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    kaspi: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    card: 'bg-blue-light-50 text-blue-light-700 dark:bg-blue-400/10 dark:text-blue-400',
    wallet: 'bg-theme-purple-500/10 text-theme-purple-500',
    bank_transfer: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
  }
  return `${base} ${variants[m] ?? variants.cash}`
}

// ─── Export ──────────────────────────────────────────────────────────────────

async function handleExport() {
  await exportToExcel(activeFilters())
}

// ─── Confirm ─────────────────────────────────────────────────────────────────

async function handleConfirm(entryId: string) {
  try {
    await confirm(entryId)
    await Promise.all([fetchEntries(activeFilters()), fetchBalance(dateFilters())])
    toast.success('Запись подтверждена')
  } catch {
    toast.error('Ошибка при подтверждении записи')
  }
}

// ─── Form modal ──────────────────────────────────────────────────────────────

const showFormModal = ref(false)
const editingEntry = ref<CashJournalEntry | null>(null)
const lockedType = ref<OperationType | null>(null)
const formSubmitting = ref(false)
const formError = ref('')

interface FormData {
  date: string
  operation_type: OperationType
  vehicle_id: string
  expense_category_id: string
  payment_method: PaymentMethod
  amount: number | ''
  description: string
  receipt_url: string
}

function todayDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function defaultForm(type: OperationType = 'income'): FormData {
  return {
    date: todayDate(),
    operation_type: type,
    vehicle_id: '',
    expense_category_id: '',
    payment_method: 'cash',
    amount: '',
    description: '',
    receipt_url: '',
  }
}

const formData = ref<FormData>(defaultForm())

function openCreateModal(type: OperationType) {
  editingEntry.value = null
  lockedType.value = type
  formData.value = defaultForm(type)
  formError.value = ''
  showFormModal.value = true
}

function openEditModal(entry: CashJournalEntry) {
  editingEntry.value = entry
  lockedType.value = null
  formData.value = {
    date: entry.date,
    operation_type: entry.operation_type,
    vehicle_id: entry.vehicle_id ?? '',
    expense_category_id: entry.expense_category_id ?? '',
    payment_method: entry.payment_method,
    amount: parseFloat(entry.amount),
    description: entry.description ?? '',
    receipt_url: entry.receipt_url ?? '',
  }
  formError.value = ''
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingEntry.value = null
  lockedType.value = null
  formError.value = ''
}

async function handleFormSubmit() {
  formError.value = ''
  formSubmitting.value = true
  try {
    const payload: Record<string, unknown> = {
      date: formData.value.date,
      operation_type: formData.value.operation_type,
      payment_method: formData.value.payment_method,
      amount: String(formData.value.amount),
      description: formData.value.description || null,
      receipt_url: formData.value.receipt_url || null,
      vehicle_id: formData.value.vehicle_id || null,
      expense_category_id: formData.value.operation_type === 'expense' && formData.value.expense_category_id
        ? formData.value.expense_category_id
        : null,
    }
    if (editingEntry.value) {
      await update(editingEntry.value.id, payload)
      toast.success('Запись обновлена')
    } else {
      payload.created_by = auth.user?.id
      await create(payload)
      toast.success('Запись создана')
    }
    closeFormModal()
    await Promise.all([fetchEntries(activeFilters()), fetchBalance(dateFilters())])
  } catch (err: unknown) {
    formError.value = (err as { message?: string })?.message ?? 'Ошибка при сохранении'
    toast.error('Ошибка при сохранении записи')
  } finally {
    formSubmitting.value = false
  }
}

// ─── Delete modal ─────────────────────────────────────────────────────────────

const showDeleteModal = ref(false)
const deletingEntry = ref<CashJournalEntry | null>(null)
const deleteSubmitting = ref(false)
const deleteError = ref('')

function openDeleteModal(entry: CashJournalEntry) {
  deletingEntry.value = entry
  deleteError.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deletingEntry.value = null
  deleteError.value = ''
}

async function handleDelete() {
  if (!deletingEntry.value) return
  deleteError.value = ''
  deleteSubmitting.value = true
  try {
    await remove(deletingEntry.value.id)
    closeDeleteModal()
    await Promise.all([fetchEntries(activeFilters()), fetchBalance(dateFilters())])
    toast.success('Запись удалена')
  } catch (err: unknown) {
    deleteError.value = (err as { message?: string })?.message ?? 'Ошибка при удалении'
    toast.error('Ошибка при удалении записи')
  } finally {
    deleteSubmitting.value = false
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([
    fetchEntries(activeFilters()),
    fetchBalance(dateFilters()),
    fetchExpenseCategories(),
    fetchVehicles(),
  ])
})
</script>
