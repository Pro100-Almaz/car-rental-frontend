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

  const initialized = ref(false)

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
      const res = await api.post('/account/login/', {
        email,
        password
      })

      localStorage.setItem('access_token', res.data.access_token)

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
      await api.post('/account/logout/')
    } finally {
      localStorage.removeItem('access_token')
      user.value = null
      _loginEmail.value = null
    }
  }

  async function fetchProfile() {
    try {
      const { data } = await api.get('/users/', { params: { limit: 100 }})
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

  async function initialize(){
    if (initialized.value) {
      return !!user.value
    }

    const token = localStorage.getItem('access_token')

    if (!token) {
      user.value = null
      initialized.value = true
      return false
    }

    loading.value = true
    error.value = null

    try{
      const {data} = await api.get('/users/current/')
      user.value = data
      return true
    }catch(err){
      localStorage.removeItem('access_token')
      user.value = null
      return false
    }finally{
      loading.value = false
      initialized.value = true
    }
  }


  async function checkSession(): Promise<boolean> {
    if (!initialized.value) {
      return await initialize()
    }

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
    initialize,
    fullName,
    userRole,
    hasRole,
    login,
    logout,
    fetchProfile,
    checkSession,
  }
})
