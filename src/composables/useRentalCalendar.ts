import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { RentalCalendarResponse } from '@/types'

export function useRentalCalendar() {
  const calendar = ref<RentalCalendarResponse | null>(null)
  const loading = ref(false)

  const auth = useAuthStore()

  const now = new Date()
  const currentMonth = ref(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  )

  async function fetchCalendar() {
    loading.value = true
    try {
      const { data } = await api.get('/rentals/calendar', {
        params: { organization_id: auth.organizationId, month: currentMonth.value },
      })
      calendar.value = data
    } finally {
      loading.value = false
    }
  }

  function prevMonth() {
    const [y, m] = currentMonth.value.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    currentMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    fetchCalendar()
  }

  function nextMonth() {
    const [y, m] = currentMonth.value.split('-').map(Number)
    const d = new Date(y, m, 1)
    currentMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    fetchCalendar()
  }

  function goToToday() {
    const n = new Date()
    currentMonth.value = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
    fetchCalendar()
  }

  return { calendar, loading, currentMonth, fetchCalendar, prevMonth, nextMonth, goToToday }
}
