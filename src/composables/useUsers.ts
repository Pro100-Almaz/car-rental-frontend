import { ref } from 'vue'
import api from '@/api/client'
import type { UserProfile, UsersListResponse } from '@/types'

export function useUsers() {
  const users = ref<UserProfile[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<UsersListResponse>('/users/', { params: filters })
      users.value = data.users
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/users/', payload)
    return data
  }

  async function setRole(userId: string, role: string) {
    await api.put(`/users/${userId}/role/`, { role })
  }

  async function activate(userId: string) {
    await api.put(`/users/${userId}/activation/`)
  }

  async function deactivate(userId: string) {
    await api.delete(`/users/${userId}/activation/`)
  }

  return { users, total, loading, fetchAll, create, setRole, activate, deactivate }
}
