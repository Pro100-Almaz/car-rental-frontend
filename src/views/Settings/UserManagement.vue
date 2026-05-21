<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">Пользователи и роли</h1>
      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Добавить пользователя
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-5 py-3.5 text-left" v-for="col in 7" :key="col">
                <div class="h-3.5 w-20 rounded skeleton-shimmer" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100 last:border-0 dark:border-gray-800">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full skeleton-shimmer" />
                  <div class="h-4 w-28 rounded skeleton-shimmer" />
                </div>
              </td>
              <td class="px-5 py-3.5"><div class="h-4 w-36 rounded skeleton-shimmer" /></td>
              <td class="px-5 py-3.5"><div class="h-4 w-24 rounded skeleton-shimmer" /></td>
              <td class="px-5 py-3.5"><div class="h-5 w-20 rounded-full skeleton-shimmer" /></td>
              <td class="px-5 py-3.5"><div class="h-5 w-16 rounded-full skeleton-shimmer" /></td>
              <td class="px-5 py-3.5"><div class="h-4 w-28 rounded skeleton-shimmer" /></td>
              <td class="px-5 py-3.5"><div class="flex gap-2"><div class="h-8 w-8 rounded-lg skeleton-shimmer" /><div class="h-8 w-8 rounded-lg skeleton-shimmer" /></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty state -->
      <div
        v-if="users.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Users class="h-6 w-6 text-gray-400" />
        </div>
        <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Нет пользователей</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Добавьте первого пользователя</p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Имя</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Телефон</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Роль</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Статус</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Последний вход</th>
                <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
              >
                <!-- Name -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {{ initials(user) }}
                    </div>
                    <span class="font-medium text-gray-800 dark:text-white/90">
                      {{ user.first_name }} {{ user.last_name }}
                    </span>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-400">{{ user.email }}</td>

                <!-- Phone -->
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                  {{ user.phone ?? '—' }}
                </td>

                <!-- Role badge -->
                <td class="px-5 py-3.5">
                  <span :class="roleBadgeClass(user.role)" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {{ roleLabel(user.role) }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-1.5">
                    <span
                      :class="user.is_active ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-600'"
                      class="h-2 w-2 rounded-full"
                    />
                    <span :class="user.is_active ? 'text-success-600 dark:text-success-400' : 'text-gray-400'" class="text-xs">
                      {{ user.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </div>
                </td>

                <!-- Last login -->
                <td class="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                  {{ user.last_login_at ? formatDate(user.last_login_at) : '—' }}
                </td>

                <!-- Actions -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-1">
                    <button
                      @click="openRoleChange(user)"
                      title="Изменить роль"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <Shield class="h-4 w-4" />
                    </button>
                    <button
                      @click="handleToggleActive(user)"
                      :title="user.is_active ? 'Деактивировать' : 'Активировать'"
                      :class="user.is_active
                        ? 'text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                      class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                    >
                      <UserCheck v-if="!user.is_active" class="h-4 w-4" />
                      <UserX v-else class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <Teleport to="body">
      <div
        v-if="createModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @mousedown.self="closeCreateModal"
      >
        <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
          <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            Новый пользователь
          </h3>

          <form @submit.prevent="handleCreate">
            <div class="space-y-4">
              <!-- first_name + last_name row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Имя <span class="text-error-500">*</span>
                  </label>
                  <input
                    v-model="createForm.first_name"
                    type="text"
                    required
                    placeholder="Имя"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Фамилия <span class="text-error-500">*</span>
                  </label>
                  <input
                    v-model="createForm.last_name"
                    type="text"
                    required
                    placeholder="Фамилия"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="createForm.email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Телефон
                </label>
                <input
                  v-model="createForm.phone"
                  type="text"
                  placeholder="+7 700 000 0000"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                />
              </div>

              <!-- Role -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Роль <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="createForm.role"
                    required
                    class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  >
                    <option value="" disabled>Выберите роль</option>
                    <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Пароль <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="createForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Минимум 8 символов"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Eye v-if="!showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="createError"
              class="mt-4 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
            >
              {{ createError }}
            </div>

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="closeCreateModal"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="createSaving"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Loader2 v-if="createSaving" class="h-4 w-4 animate-spin" />
                {{ createSaving ? 'Создание...' : 'Создать' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Role Change Modal -->
    <Teleport to="body">
      <div
        v-if="roleModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @mousedown.self="closeRoleModal"
      >
        <div class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
          <h3 class="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            Изменить роль
          </h3>
          <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {{ roleTargetUser?.first_name }} {{ roleTargetUser?.last_name }}
          </p>

          <form @submit.prevent="handleRoleChange">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Роль <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="selectedRole"
                  required
                  class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-brand-500"
                >
                  <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="roleError"
              class="mt-4 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
            >
              {{ roleError }}
            </div>

            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="closeRoleModal"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="roleSaving"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Loader2 v-if="roleSaving" class="h-4 w-4 animate-spin" />
                {{ roleSaving ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirm toggle active modal -->
    <Teleport to="body">
      <div
        v-if="confirmModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @mousedown.self="closeConfirmModal"
      >
        <div class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
          <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
            :class="confirmTarget?.is_active ? 'bg-error-50 dark:bg-error-500/10' : 'bg-success-50 dark:bg-success-500/10'"
          >
            <UserX v-if="confirmTarget?.is_active" class="h-5 w-5 text-error-500" />
            <UserCheck v-else class="h-5 w-5 text-success-500" />
          </div>
          <h3 class="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
            {{ confirmTarget?.is_active ? 'Деактивировать пользователя?' : 'Активировать пользователя?' }}
          </h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {{ confirmTarget?.first_name }} {{ confirmTarget?.last_name }}
            {{ confirmTarget?.is_active
              ? 'потеряет доступ к системе.'
              : 'получит доступ к системе.' }}
          </p>

          <!-- Error -->
          <div
            v-if="confirmError"
            class="mb-4 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            {{ confirmError }}
          </div>

          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeConfirmModal"
              class="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.05]"
            >
              Отмена
            </button>
            <button
              @click="confirmToggleActive"
              :disabled="confirmSaving"
              :class="confirmTarget?.is_active
                ? 'bg-error-500 hover:bg-error-600 active:bg-error-700'
                : 'bg-success-500 hover:bg-success-600 active:bg-success-700'"
              class="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Loader2 v-if="confirmSaving" class="h-4 w-4 animate-spin" />
              {{ confirmSaving ? 'Применение...' : confirmTarget?.is_active ? 'Деактивировать' : 'Активировать' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Plus,
  Shield,
  UserCheck,
  UserX,
  Users,
  Eye,
  EyeOff,
  ChevronDown,
  Loader2,
} from 'lucide-vue-next'
import { useUsers } from '@/composables/useUsers'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { UserProfile, UserRole } from '@/types'

const { users, loading, fetchAll, create, setRole, activate, deactivate } = useUsers()
const auth = useAuthStore()
const toast = useToast()

onMounted(() => fetchAll({ organization_id: auth.organizationId }))

// ── helpers ──────────────────────────────────────────────────────────────────

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'super_admin',        label: 'Супер-админ' },
  { value: 'admin',              label: 'Админ' },
  { value: 'booking_manager',    label: 'Менеджер' },
  { value: 'financial_manager',  label: 'Финансист' },
  { value: 'investor',           label: 'Инвестор' },
  { value: 'technician',         label: 'Техник' },
]

function roleLabel(role: UserRole): string {
  return roleOptions.find((r) => r.value === role)?.label ?? role
}

function roleBadgeClass(role: UserRole): string {
  const map: Record<UserRole, string> = {
    super_admin:       'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400',
    admin:             'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
    booking_manager:   'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
    financial_manager: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
    investor:          'bg-theme-purple-500/10 text-theme-purple-500',
    technician:        'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  }
  return map[role] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

function initials(user: UserProfile): string {
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Create modal ─────────────────────────────────────────────────────────────

const createModalOpen = ref(false)
const createSaving = ref(false)
const createError = ref('')
const showPassword = ref(false)

const createForm = ref<{
  first_name: string
  last_name: string
  email: string
  phone: string
  role: UserRole | ''
  password: string
}>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
})

function openCreate() {
  createForm.value = { first_name: '', last_name: '', email: '', phone: '', role: '', password: '' }
  createError.value = ''
  showPassword.value = false
  createModalOpen.value = true
}

function closeCreateModal() {
  createModalOpen.value = false
}

async function handleCreate() {
  createError.value = ''
  createSaving.value = true
  try {
    const payload: Record<string, unknown> = {
      organization_id: auth.organizationId,
      first_name: createForm.value.first_name.trim(),
      last_name: createForm.value.last_name.trim(),
      email: createForm.value.email.trim(),
      role: createForm.value.role,
      password: createForm.value.password,
    }
    if (createForm.value.phone.trim()) {
      payload.phone = createForm.value.phone.trim()
    }
    await create(payload)
    closeCreateModal()
    await fetchAll({ organization_id: auth.organizationId })
    toast.success('Пользователь создан')
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    createError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка. Попробуйте снова.'
    toast.error('Ошибка при создании пользователя')
  } finally {
    createSaving.value = false
  }
}

// ── Role change modal ─────────────────────────────────────────────────────────

const roleModalOpen = ref(false)
const roleSaving = ref(false)
const roleError = ref('')
const roleTargetUser = ref<UserProfile | null>(null)
const selectedRole = ref<UserRole>('booking_manager')

function openRoleChange(user: UserProfile) {
  roleTargetUser.value = user
  selectedRole.value = user.role
  roleError.value = ''
  roleModalOpen.value = true
}

function closeRoleModal() {
  roleModalOpen.value = false
  roleTargetUser.value = null
}

async function handleRoleChange() {
  if (!roleTargetUser.value) return
  roleError.value = ''
  roleSaving.value = true
  try {
    await setRole(roleTargetUser.value.id, selectedRole.value)
    closeRoleModal()
    await fetchAll({ organization_id: auth.organizationId })
    toast.success('Роль обновлена')
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    roleError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка. Попробуйте снова.'
    toast.error('Ошибка при обновлении роли')
  } finally {
    roleSaving.value = false
  }
}

// ── Activate / Deactivate ────────────────────────────────────────────────────

const confirmModalOpen = ref(false)
const confirmSaving = ref(false)
const confirmError = ref('')
const confirmTarget = ref<UserProfile | null>(null)

function handleToggleActive(user: UserProfile) {
  confirmTarget.value = user
  confirmError.value = ''
  confirmModalOpen.value = true
}

function closeConfirmModal() {
  confirmModalOpen.value = false
  confirmTarget.value = null
}

async function confirmToggleActive() {
  if (!confirmTarget.value) return
  confirmError.value = ''
  confirmSaving.value = true
  try {
    if (confirmTarget.value.is_active) {
      await deactivate(confirmTarget.value.id)
      toast.success('Пользователь деактивирован')
    } else {
      await activate(confirmTarget.value.id)
      toast.success('Пользователь активирован')
    }
    closeConfirmModal()
    await fetchAll({ organization_id: auth.organizationId })
  } catch (err: unknown) {
    const e = err as { response?: { data?: { detail?: string; message?: string } } }
    confirmError.value =
      e?.response?.data?.detail ??
      e?.response?.data?.message ??
      'Произошла ошибка. Попробуйте снова.'
    toast.error('Ошибка при изменении статуса пользователя')
  } finally {
    confirmSaving.value = false
  }
}
</script>
