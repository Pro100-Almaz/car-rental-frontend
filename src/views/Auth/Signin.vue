<template>
  <FullScreenLayout>
    <div class="relative flex min-h-screen bg-white dark:bg-gray-950">
      <!-- Left panel: branding (desktop only) -->
      <div
        class="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 overflow-hidden"
        style="background: linear-gradient(145deg, #161950 0%, #252dae 50%, #465fff 100%)"
      >
        <!-- Decorative circles -->
        <div
          class="pointer-events-none absolute bottom-0 right-0 h-[480px] w-[480px] translate-x-1/3 translate-y-1/3"
        >
          <div class="absolute inset-0 rounded-full border border-white/10" />
          <div class="absolute inset-16 rounded-full border border-white/10" />
          <div class="absolute inset-32 rounded-full border border-white/10" />
        </div>

        <div class="relative z-10 flex flex-col items-center text-center max-w-xs">
          <div
            class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
          >
            <Car class="h-9 w-9 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-white mb-3">AutoFleet</h2>
          <p class="text-lg text-brand-200 mb-2">Система управления автопарком</p>
          <p class="text-sm text-white/50">Almaty, Kazakhstan</p>
        </div>
      </div>

      <!-- Right panel: form -->
      <div
        class="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12 dark:bg-gray-950"
      >
        <!-- Theme toggle top-right -->
        <div class="absolute top-4 right-4">
          <ThemeToggler />
        </div>

        <div class="w-full max-w-md">
          <!-- Mobile logo -->
          <div class="mb-8 flex items-center gap-2 lg:hidden">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Car class="h-5 w-5" />
            </div>
            <span class="text-xl font-bold text-gray-800 dark:text-white">AutoFleet</span>
          </div>

          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
              Войти в систему
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Введите email и пароль для входа в AutoFleet CRM
            </p>
          </div>

          <!-- Error banner -->
          <div
            v-if="authStore.error"
            class="mb-6 flex items-center gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
          >
            <AlertCircle class="h-4 w-4 shrink-0" />
            {{ authStore.error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <Mail
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  placeholder="admin@autofleet.kz"
                  required
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label
                for="password"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Пароль <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <Lock
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Введите пароль"
                  required
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-11 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-brand-500"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Loader2 v-if="authStore.loading" class="h-4 w-4 animate-spin" />
              {{ authStore.loading ? 'Входим...' : 'Войти' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Car, Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import ThemeToggler from '@/components/common/ThemeToggler.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch {
    console.error('Login failed')
    // error is already set in auth store
  }
}
</script>
