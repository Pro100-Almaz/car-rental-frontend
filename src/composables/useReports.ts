import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { CompanyPnl, CashFlow, VehiclesComparison, ReportType } from '@/types'

export function useReports() {
  const pnl = ref<CompanyPnl | null>(null)
  const cashFlow = ref<CashFlow | null>(null)
  const vehiclesComparison = ref<VehiclesComparison | null>(null)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchPnl(params: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<CompanyPnl>('/reports/pnl', {
        params: { organization_id: auth.organizationId, ...params },
      })
      pnl.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchCashFlow(params: { from: string; to: string }) {
    loading.value = true
    try {
      const { data } = await api.get<CashFlow>('/reports/cash-flow', {
        params: { organization_id: auth.organizationId, ...params },
      })
      cashFlow.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchVehiclesComparison(params: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<VehiclesComparison>('/reports/vehicles-comparison', {
        params: { organization_id: auth.organizationId, ...params },
      })
      vehiclesComparison.value = data
    } finally {
      loading.value = false
    }
  }

  async function exportReport(type: ReportType, params: Record<string, unknown> = {}) {
    const { data } = await api.get('/reports/export', {
      params: { organization_id: auth.organizationId, type, ...params },
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(data as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${type}-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return {
    pnl, cashFlow, vehiclesComparison, loading,
    fetchPnl, fetchCashFlow, fetchVehiclesComparison, exportReport,
  }
}
