import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { AdditionalService, RentalService } from '@/types'

export function useAdditionalServices() {
  const services = ref<AdditionalService[]>([])
  const rentalServices = ref<RentalService[]>([])
  const loading = ref(false)

  const auth = useAuthStore()

  async function fetchServices() {
    loading.value = true
    try {
      const { data } = await api.get('/additional-services/', {
        params: { organization_id: auth.organizationId, is_active: true },
      })
      services.value = data.items ?? data.additional_services ?? (Array.isArray(data) ? data : [])
    } finally {
      loading.value = false
    }
  }

  async function fetchRentalServices(rentalId: string) {
    const { data } = await api.get('/rental-services/', {
      params: { rental_id: rentalId },
    })
    rentalServices.value = data.rental_services ?? data.items ?? (Array.isArray(data) ? data : [])
    return rentalServices.value
  }

  async function addRentalService(rentalId: string, serviceId: string, quantity: number, price: string) {
    const { data } = await api.post('/rental-services/', {
      rental_id: rentalId,
      service_id: serviceId,
      quantity,
      price,
    })
    return data
  }

  async function removeRentalService(rentalServiceId: string) {
    await api.delete(`/rental-services/${rentalServiceId}`)
  }

  return { services, rentalServices, loading, fetchServices, fetchRentalServices, addRentalService, removeRentalService }
}
