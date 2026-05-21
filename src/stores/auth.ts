import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/client'
import type { UserProfile, UserRole } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const _loginEmail = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const organizationId = computed(() => user.value?.organization_id || '')
  const fullName = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
  )
  const userRole = computed(() => user.value?.role)

  function hasRole(...roles: UserRole[]): boolean {
    return !!user.value && roles.includes(user.value.role)
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await api.post('/account/login/', { email, password })
      _loginEmail.value = email
      await fetchProfile()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Ошибка входа'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.delete('/account/logout/')
    } finally {
      user.value = null
      _loginEmail.value = null
    }
  }

  async function fetchProfile() {
    try {
      const { data } = await api.get('/users/', { params: { limit: 100 } })
      const users: UserProfile[] = data.users || data.items || []

      if (_loginEmail.value) {
        user.value = users.find((u) => u.email === _loginEmail.value) || users[0] || null
      } else {
        user.value = users[0] || null
      }
    } catch {
      user.value = null
    }
  }

  async function checkSession(): Promise<boolean> {
    try {
      await fetchProfile()
      return !!user.value
    } catch {
      return false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    organizationId,
    fullName,
    userRole,
    hasRole,
    login,
    logout,
    fetchProfile,
    checkSession,
  }
})
