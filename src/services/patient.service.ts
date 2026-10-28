import { apiClient } from "@/lib/api-client"
import type { PatientMeResponse, PatientProfile } from "@/types"

export type PatientProfileInput = Partial<Omit<PatientProfile, "id" | "userAccountId" | "createdAt" | "updatedAt">> & {
  phoneNumber?: string | null
}

export const patientService = {
  async getMe(): Promise<PatientMeResponse> {
    const { data } = await apiClient.get<PatientMeResponse>("/me")
    return data
  },

  async createOrReplaceProfile(input: PatientProfileInput): Promise<PatientProfile> {
    const { data } = await apiClient.put<PatientProfile>("/me/profile", input)
    return data
  },

  async updateProfile(input: PatientProfileInput): Promise<PatientProfile> {
    const { data } = await apiClient.patch<PatientProfile>("/me/profile", input)
    return data
  },
}
