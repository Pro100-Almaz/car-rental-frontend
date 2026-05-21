import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Organization, OrganizationSettings } from '@/types'

export function useOrganizationProfile() {
  const organization = ref<Organization | null>(null)
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchOrganization() {
    loading.value = true
    try {
      const { data } = await api.get<Organization>(`/organizations/${auth.organizationId}`)
      organization.value = data
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: { name?: string; settings?: Partial<OrganizationSettings> }) {
    await api.patch(`/organizations/${auth.organizationId}`, payload)
    await fetchOrganization()
  }

  async function updateSettings(settings: Partial<OrganizationSettings>) {
    await updateProfile({ settings })
  }

  return { organization, loading, fetchOrganization, updateProfile, updateSettings }
}
