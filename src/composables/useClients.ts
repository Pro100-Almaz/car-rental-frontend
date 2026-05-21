import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Client, Rental, PaymentTransaction } from '@/types'

export function useClients() {
  const clients = ref<Client[]>([])
  const client = ref<Client | null>(null)
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/clients/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      clients.value = data.clients ?? data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? clients.value.length
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    try {
      const { data } = await api.get<Client>(`/clients/${id}`)
      client.value = data
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/clients/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  async function update(id: string, payload: Record<string, unknown>) {
    await api.patch(`/clients/${id}`, payload)
  }

  async function verify(id: string, status: 'pending' | 'verified' | 'rejected') {
    await api.post(`/clients/${id}/verify`, { status })
  }

  async function blacklist(id: string, reason: string) {
    await api.post(`/clients/${id}/blacklist`, { reason })
  }

  async function unblacklist(id: string) {
    await api.delete(`/clients/${id}/blacklist`)
  }

  async function fetchClientRentals(clientId: string) {
    const { data } = await api.get(`/clients/${clientId}/rentals`, {
      params: { organization_id: auth.organizationId },
    })
    return (data.rentals ?? data.items ?? (Array.isArray(data) ? data : [])) as Rental[]
  }

  async function fetchClientPayments(clientId: string) {
    const { data } = await api.get(`/clients/${clientId}/payments`, {
      params: { organization_id: auth.organizationId },
    })
    return (data.transactions ?? data.items ?? (Array.isArray(data) ? data : [])) as PaymentTransaction[]
  }

  return {
    clients, client, total, loading,
    fetchAll, fetchOne, create, update, verify, blacklist, unblacklist,
    fetchClientRentals, fetchClientPayments,
  }
}
