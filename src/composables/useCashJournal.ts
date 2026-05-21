import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { CashJournalEntry, CashJournalBalance } from '@/types'

export function useCashJournal() {
  const entries = ref<CashJournalEntry[]>([])
  const balance = ref<CashJournalBalance | null>(null)
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchEntries(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/cash-journal/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      entries.value = data.entries ?? data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? entries.value.length
    } finally {
      loading.value = false
    }
  }

  async function fetchBalance(filters: Record<string, unknown> = {}) {
    try {
      const { data } = await api.get<CashJournalBalance>('/cash-journal/balance', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      balance.value = data
    } catch {
      balance.value = null
    }
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/cash-journal/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  async function update(entryId: string, payload: Record<string, unknown>) {
    await api.patch(`/cash-journal/${entryId}`, payload)
  }

  async function remove(entryId: string) {
    await api.delete(`/cash-journal/${entryId}`)
  }

  async function confirm(entryId: string) {
    await api.post(`/cash-journal/${entryId}/confirm`)
  }

  async function exportToExcel(filters: Record<string, unknown> = {}) {
    const { data } = await api.get('/cash-journal/export', {
      params: { organization_id: auth.organizationId, ...filters },
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(data as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cash-journal-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return {
    entries, balance, total, loading,
    fetchEntries, fetchBalance, create, update, remove, confirm, exportToExcel,
  }
}
