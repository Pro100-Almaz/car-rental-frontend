<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
    >
      <!-- Avatar -->
      <div
        class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
      >
        {{ userInitials }}
      </div>
      <div class="hidden text-left lg:block">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ userName }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ userEmail }}</p>
      </div>
      <ChevronDown
        class="hidden h-4 w-4 text-gray-400 transition-transform duration-200 lg:block"
        :class="{ 'rotate-180': dropdownOpen }"
      />
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="dropdownOpen"
        class="absolute right-0 z-[9999] mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- User info -->
        <div class="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ userName }}</p>
          <p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{{ userEmail }}</p>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <router-link
            to="/profile"
            @click="closeDropdown"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <UserCircle class="h-4 w-4 text-gray-400" />
            Профиль
          </router-link>
          <router-link
            to="/settings/organization"
            @click="closeDropdown"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <Settings class="h-4 w-4 text-gray-400" />
            Настройки
          </router-link>
        </div>

        <!-- Logout -->
        <div class="border-t border-gray-100 pt-1 dark:border-gray-800">
          <button
            @click="handleLogout"
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error-600 transition-colors hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
          >
            <LogOut class="h-4 w-4" />
            Выйти
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, UserCircle, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userName = computed(() => {
  const user = authStore.user
  if (!user) return 'Пользователь'
  if (user.first_name || user.last_name) return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  return user.email ?? 'Пользователь'
})

const userEmail = computed(() => authStore.user?.email ?? '')

const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

async function handleLogout() {
  closeDropdown()
  await authStore.logout()
  router.push('/signin')
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
