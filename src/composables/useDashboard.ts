import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { DashboardKpis, DashboardAlerts, DashboardActiveRentals, DashboardRevenueChart } from '@/types'

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function useDashboard() {
  const kpis = ref<DashboardKpis | null>(null)
  const alerts = ref<DashboardAlerts | null>(null)
  const activeRentals = ref<DashboardActiveRentals | null>(null)
  const revenueChart = ref<DashboardRevenueChart | null>(null)
  const loading = ref(false)
  const period = ref(getCurrentMonth())
  const lastRefreshed = ref<Date | null>(null)

  const auth = useAuthStore()

  async function fetchKpis() {
    const { data } = await api.get<DashboardKpis>('/dashboard/kpis', {
      params: { organization_id: auth.organizationId, period: period.value },
    })
    kpis.value = data
  }

  async function fetchAlerts() {
    const { data } = await api.get<DashboardAlerts>('/dashboard/alerts', {
      params: { organization_id: auth.organizationId },
    })
    alerts.value = data
  }

  async function fetchActiveRentals(limit = 5) {
    const { data } = await api.get<DashboardActiveRentals>('/dashboard/active-rentals', {
      params: { organization_id: auth.organizationId, limit },
    })
    activeRentals.value = data
  }

  async function fetchRevenueChart() {
    const { data } = await api.get<DashboardRevenueChart>('/dashboard/revenue-chart', {
      params: { organization_id: auth.organizationId, period: period.value },
    })
    revenueChart.value = data
  }

  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([fetchKpis(), fetchAlerts(), fetchActiveRentals(), fetchRevenueChart()])
      lastRefreshed.value = new Date()
    } finally {
      loading.value = false
    }
  }

  let intervalId: ReturnType<typeof setInterval> | null = null

  function startAutoRefresh(intervalMs = 300_000) {
    stopAutoRefresh()
    intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAll()
      }
    }, intervalMs)
  }

  function stopAutoRefresh() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => startAutoRefresh())
  onUnmounted(() => stopAutoRefresh())

  return {
    kpis, alerts, activeRentals, revenueChart, loading, period, lastRefreshed,
    fetchAll, fetchKpis, fetchAlerts, fetchActiveRentals, fetchRevenueChart,
  }
}
