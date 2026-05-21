import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { ServiceTask, ListResponse } from '@/types'

export function useTasks() {
  const tasks = ref<ServiceTask[]>([])
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<ListResponse<ServiceTask>>('/tasks/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      tasks.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/tasks/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  return { tasks, total, loading, fetchAll, create }
}
