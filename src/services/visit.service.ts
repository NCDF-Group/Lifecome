import { apiClient } from "@/lib/api-client"
import type { Visit } from "@/types"

export const visitService = {
  async getVisits(): Promise<Visit[]> {
    const { data } = await apiClient.get<{ visits: Visit[] }>("/me/visits")
    return data.visits
  },
}
