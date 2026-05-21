import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Investor } from '@/types'

export function useInvestors() {
  const investors = ref<Investor[]>([])
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/investors/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      investors.value = data.investors ?? data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? investors.value.length
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/investors/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  async function update(id: string, payload: Record<string, unknown>) {
    await api.patch(`/investors/${id}`, payload)
  }

  async function bindVehicle(investorId: string, vehicleId: string) {
    await api.post(`/investors/${investorId}/vehicles`, { vehicle_id: vehicleId })
  }

  return { investors, total, loading, fetchAll, create, update, bindVehicle }
}
