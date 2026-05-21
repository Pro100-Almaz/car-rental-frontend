import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Investor, InvestorVehicle, InvestorPnl, InvestorPayout } from '@/types'

export function useInvestorDetail() {
  const investor = ref<Investor | null>(null)
  const vehicles = ref<InvestorVehicle[]>([])
  const pnl = ref<InvestorPnl | null>(null)
  const payouts = ref<InvestorPayout[]>([])
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchInvestor(id: string) {
    loading.value = true
    try {
      const { data } = await api.get<Investor>(`/investors/${id}`)
      investor.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchVehicles(investorId: string) {
    const { data } = await api.get(`/investors/${investorId}/vehicles`)
    vehicles.value = data.vehicle_investors ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  async function fetchPnl(investorId: string, params: Record<string, unknown> = {}) {
    const { data } = await api.get<InvestorPnl>(`/investors/${investorId}/pnl`, { params })
    pnl.value = data
  }

  async function fetchPayouts(investorId: string, filters: Record<string, unknown> = {}) {
    const { data } = await api.get(`/investors/${investorId}/payouts`, { params: filters })
    payouts.value = data.payouts ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  async function linkVehicle(investorId: string, payload: Record<string, unknown>) {
    const { data } = await api.post(`/investors/${investorId}/vehicles`, payload)
    await fetchVehicles(investorId)
    return data
  }

  async function unlinkVehicle(investorId: string, vehicleId: string) {
    await api.delete(`/investors/${investorId}/vehicles/${vehicleId}`)
    await fetchVehicles(investorId)
  }

  async function createPayout(investorId: string, payload: Record<string, unknown>) {
    const { data } = await api.post(`/investors/${investorId}/payouts`, {
      organization_id: auth.organizationId,
      ...payload,
    })
    await fetchPayouts(investorId)
    return data
  }

  async function updatePayoutStatus(payoutId: string, status: string) {
    await api.patch(`/investor-payouts/${payoutId}`, { status })
  }

  return {
    investor, vehicles, pnl, payouts, loading,
    fetchInvestor, fetchVehicles, fetchPnl, fetchPayouts,
    linkVehicle, unlinkVehicle, createPayout, updatePayoutStatus,
  }
}
