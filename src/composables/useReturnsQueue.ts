import { ref, computed } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { ReturnsQueueItem } from '@/types'

export function useReturnsQueue() {
  const items = ref<ReturnsQueueItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchQueue() {
    loading.value = true
    try {
      const { data } = await api.get('/rentals/returns-queue', {
        params: { organization_id: auth.organizationId },
      })
      items.value = data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? items.value.length
    } finally {
      loading.value = false
    }
  }

  const overdueItems = computed(() => items.value.filter((i) => i.is_overdue))

  const todayItems = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return items.value.filter((i) => {
      if (i.is_overdue) return false
      const end = new Date(i.scheduled_end)
      return end >= today && end < tomorrow
    })
  })

  const tomorrowItems = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)
    return items.value.filter((i) => {
      if (i.is_overdue) return false
      const end = new Date(i.scheduled_end)
      return end >= tomorrow && end < dayAfter
    })
  })

  return { items, total, loading, fetchQueue, overdueItems, todayItems, tomorrowItems }
}
