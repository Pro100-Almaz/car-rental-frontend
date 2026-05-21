import { ref } from 'vue'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { Vehicle, VehicleFinancials, TimelineEvent, VehicleDocument, BulkStatusResult } from '@/types'

export function useVehicles() {
  const vehicles = ref<Vehicle[]>([])
  const vehicle = ref<Vehicle | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const financials = ref<VehicleFinancials | null>(null)
  const timeline = ref<TimelineEvent[]>([])
  const documents = ref<VehicleDocument[]>([])

  const auth = useAuthStore()

  async function fetchAll(filters: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/vehicles/', {
        params: { organization_id: auth.organizationId, ...filters },
      })
      vehicles.value = data.vehicles ?? data.items ?? (Array.isArray(data) ? data : [])
      total.value = data.total ?? vehicles.value.length
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    try {
      const { data } = await api.get<Vehicle>(`/vehicles/${id}`)
      vehicle.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchFinancials(id: string, dateFrom: string, dateTo: string) {
    const { data } = await api.get(`/vehicles/${id}/financials`, {
      params: { date_from: dateFrom, date_to: dateTo },
    })
    financials.value = data
  }

  async function fetchTimeline(id: string) {
    const { data } = await api.get(`/vehicles/${id}/timeline`)
    timeline.value = data.events ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  async function fetchDocuments(id: string) {
    const { data } = await api.get('/vehicle-documents/', {
      params: { vehicle_id: id },
    })
    documents.value = data.documents ?? data.items ?? (Array.isArray(data) ? data : [])
  }

  async function create(payload: Record<string, unknown>) {
    const { data } = await api.post('/vehicles/', {
      organization_id: auth.organizationId,
      ...payload,
    })
    return data
  }

  async function update(id: string, payload: Record<string, unknown>) {
    await api.patch(`/vehicles/${id}`, payload)
  }

  async function changeStatus(id: string, status: string) {
    await api.patch(`/vehicles/${id}/status`, { status })
  }

  async function bulkChangeStatus(vehicleIds: string[], status: string) {
    const { data } = await api.post<BulkStatusResult>('/vehicles/bulk-status', {
      vehicle_ids: vehicleIds,
      status,
    })
    return data
  }

  async function addPhoto(id: string, url: string) {
    const { data } = await api.post(`/vehicles/${id}/photos`, { url })
    return data
  }

  async function removePhoto(id: string, index: number) {
    const { data } = await api.delete(`/vehicles/${id}/photos/${index}`)
    return data
  }

  async function createDocument(payload: Record<string, unknown>) {
    const { data } = await api.post('/vehicle-documents/', payload)
    return data
  }

  async function deleteDocument(documentId: string) {
    await api.delete(`/vehicle-documents/${documentId}`)
  }

  return {
    vehicles, vehicle, total, loading, financials, timeline, documents,
    fetchAll, fetchOne, fetchFinancials, fetchTimeline, fetchDocuments,
    create, update, changeStatus, bulkChangeStatus,
    addPhoto, removePhoto, createDocument, deleteDocument,
  }
}
