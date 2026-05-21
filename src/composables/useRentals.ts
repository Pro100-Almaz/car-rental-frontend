import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Rental } from '@/types'

export function useRentals() {
  const rentals = ref<Rental[]>([])
  const rental = ref<Rental | null>(null)
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/rentals/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      rentals.value = data.rentals ?? data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? rentals.value.length
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    try {
      const { data } = await api.get<Rental>(`/rentals/${id}`)
      rental.value = data
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/rentals/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  async function confirm(id: string) {
    await api.post(`/rentals/${id}/transition`, { status: 'confirmed' })
  }

  async function checkin(id: string, checkinData: Record<string, unknown>) {
    await api.post(`/rentals/${id}/checkin`, { checkin_data: checkinData })
  }

  async function checkout(id: string, checkoutData: Record<string, unknown>) {
    await api.post(`/rentals/${id}/checkout`, { checkout_data: checkoutData })
  }

  async function extend(id: string, newEnd: string, newTotal: string) {
    await api.post(`/rentals/${id}/extend`, {
      new_scheduled_end: newEnd,
      new_estimated_total: newTotal,
    })
  }

  async function cancel(id: string, reason?: string) {
    await api.post(`/rentals/${id}/cancel`, { reason })
  }

  async function complete(id: string, charges: Record<string, unknown>) {
    await api.post(`/rentals/${id}/complete`, charges)
  }

  return {
    rentals, rental, total, loading,
    fetchAll, fetchOne, create, confirm, checkin, checkout, extend, cancel, complete,
  }
}
