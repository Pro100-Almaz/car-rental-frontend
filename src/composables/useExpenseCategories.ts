import { ref, computed } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { ExpenseCategory } from '@/types'

export function useExpenseCategories() {
  const categories = ref<ExpenseCategory[]>([])
  const loading = ref(false)

  const auth = useAuthStore()

  const directCategories = computed(() =>
    categories.value.filter((c) => c.type_ === 'direct'),
  )

  const overheadCategories = computed(() =>
    categories.value.filter((c) => c.type_ === 'overhead'),
  )

  const activeCategories = computed(() =>
    categories.value.filter((c) => c.is_active),
  )

  async function fetchCategories() {
    loading.value = true
    try {
      const { data } = await api.get('/expense-categories/', {
        params: { organization_id: auth.organizationId },
      })
      categories.value = data.expense_categories ?? data.items ?? (Array.isArray(data) ? data : [])
    } finally {
      loading.value = false
    }
  }

  async function createCategory(name: string, type_: 'direct' | 'overhead') {
    const { data } = await api.post('/expense-categories/', {
      organization_id: auth.organizationId,
      name,
      type_,
    })
    await fetchCategories()
    return data
  }

  async function updateCategory(id: string, payload: Record<string, unknown>) {
    await api.patch(`/expense-categories/${id}`, payload)
    await fetchCategories()
  }

  return {
    categories, loading, directCategories, overheadCategories, activeCategories,
    fetchCategories, createCategory, updateCategory,
  }
}
