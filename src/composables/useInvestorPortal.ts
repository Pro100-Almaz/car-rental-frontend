import { ref } from 'vue'
import api from '@/api/client'
import type { InvestorPnl, InvestorVehicle, InvestorPayout } from '@/types'

export function useInvestorPortal() {
  const dashboard = ref<InvestorPnl | null>(null)
  const vehicles = ref<InvestorVehicle[]>([])
  const payouts = ref<InvestorPayout[]>([])
  const loading = ref(false)

  async function fetchDashboard(params: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get<InvestorPnl>('/investor-portal/dashboard', { params })
      dashboard.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchVehicles() {
    const { data } = await api.get('/investor-portal/vehicles')
    vehicles.value = data.vehicle_investors ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  async function fetchPayouts() {
    const { data } = await api.get('/investor-portal/payouts')
    payouts.value = data.payouts ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  return { dashboard, vehicles, payouts, loading, fetchDashboard, fetchVehicles, fetchPayouts }
}
