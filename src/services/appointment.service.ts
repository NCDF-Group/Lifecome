import { apiClient } from "@/lib/api-client"
import type { Appointment, Doctor } from "@/types"

export interface AvailabilitySlot {
  id: string
  providerId: string
  startsAt: string
  durationMinutes: number
  isBooked: boolean
  heldUntil: string | null
}

export interface OperatingClinic {
  id: string
  name: string
  city: string
  address: string
  postcode: string
  phone: string | null
  accessibilityDetails: string | null
  directions: string | null
  arrivalInstructions: string | null
  isActive: boolean
}

export interface ClinicalService {
  id: string
  code: string
  name: string
  description: string | null
  defaultDurationMinutes: number
  basePriceKobo: number
  isActive: boolean
}

export interface CreateAppointmentInput {
  providerId: string
  clinicalServiceId: string
  availabilitySlotId: string
  consultationMode: "video" | "audio" | "in_person"
  presentingConcern?: string
  fundingRoute?: "pay_per_visit" | "lifecome_benefits" | "workplace" | "membership"
  serviceCategory?: "gp" | "menopause" | "care" | "wellbeing"
  locationCity?: string
  clinicName?: string
  clinicAddress?: string
  arrivalInstructions?: string
  intake?: {
    reason?: string
    medicinesAndAllergies?: string
    accessibilitySupport?: string
    callbackNumber?: string
    patientLocation?: string
    understoodRemoteLimits?: boolean
  }
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    const { data } = await apiClient.get<Appointment[]>("/appointments")
    return data
  },

  async getAppointment(id: string): Promise<Appointment> {
    const { data } = await apiClient.get<Appointment>(`/appointments/${encodeURIComponent(id)}`)
    return data
  },

  async getProviders(filters: {
    search?: string
    specialty?: string
    city?: string
    consultationMode?: "video" | "audio" | "in_person"
  } = {}): Promise<Doctor[]> {
    const { data } = await apiClient.get<Doctor[]>("/providers", { params: filters })
    return data
  },

  async getProviderSpecialties(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>("/providers/specialties")
    return data
  },

  async getClinicalServices(): Promise<ClinicalService[]> {
    const { data } = await apiClient.get<ClinicalService[]>("/clinical-services")
    return data
  },

  async getClinics(): Promise<OperatingClinic[]> {
    const { data } = await apiClient.get<OperatingClinic[]>("/gp/clinics")
    return data
  },

  async getClinic(id: string): Promise<OperatingClinic> {
    const { data } = await apiClient.get<OperatingClinic>(`/gp/clinics/${encodeURIComponent(id)}`)
    return data
  },

  async getAvailability(providerId: string): Promise<AvailabilitySlot[]> {
    const { data } = await apiClient.get<AvailabilitySlot[]>(
      `/scheduling/providers/${encodeURIComponent(providerId)}/availability`
    )
    return data
  },

  async holdSlot(slotId: string): Promise<AvailabilitySlot> {
    const { data } = await apiClient.post<AvailabilitySlot>("/scheduling/slots/hold", { slotId })
    return data
  },

  async bookAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const { data } = await apiClient.post<Appointment>("/appointments", input, {
      headers: { "Idempotency-Key": crypto.randomUUID() },
    })
    return data
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    const { data } = await apiClient.post<Appointment>(`/appointments/${encodeURIComponent(id)}/cancel`)
    return data
  },

  async rescheduleAppointment(id: string, newAvailabilitySlotId: string): Promise<Appointment> {
    const { data } = await apiClient.post<Appointment>(
      `/appointments/${encodeURIComponent(id)}/reschedule`,
      { newAvailabilitySlotId },
      { headers: { "Idempotency-Key": crypto.randomUUID() } }
    )
    return data
  },

  async confirmAppointment(id: string): Promise<Appointment> {
    const { data } = await apiClient.post<Appointment>(`/appointments/${encodeURIComponent(id)}/confirm`)
    return data
  },
}
