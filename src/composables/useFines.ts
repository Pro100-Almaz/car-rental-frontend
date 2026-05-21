import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Fine, ListResponse } from '@/types'

export function useFines() {
  const fines = ref<Fine[]>([])
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<ListResponse<Fine>>('/fines/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      fines.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/fines/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  return { fines, total, loading, fetchAll, create }
}
