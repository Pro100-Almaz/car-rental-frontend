import { ref, computed } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { VehicleCategory } from '@/types'

export function useVehicleCategories() {
  const categories = ref<VehicleCategory[]>([])
  const loading = ref(false)

  const auth = useAuthStore()

  const activeCategories = computed(() =>
    categories.value.filter((c) => c.is_active),
  )

  async function fetchCategories() {
    loading.value = true
    try {
      const { data } = await api.get('/vehicle-categories/', {
        params: { organization_id: auth.organizationId },
      })
      categories.value = data.categories ?? data.items ?? (Array.isArray(data) ? data : [])
    } finally {
      loading.value = false
    }
  }

  async function createCategory(name: string, sortOrder = 0) {
    const { data } = await api.post('/vehicle-categories/', {
      organization_id: auth.organizationId,
      name,
      sort_order: sortOrder,
    })
    await fetchCategories()
    return data
  }

  async function updateCategory(id: string, payload: Record<string, unknown>) {
    await api.patch(`/vehicle-categories/${id}`, payload)
    await fetchCategories()
  }

  return { categories, activeCategories, loading, fetchCategories, createCategory, updateCategory }
}
