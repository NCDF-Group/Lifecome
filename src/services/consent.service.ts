import { apiClient } from "@/lib/api-client"
import { unwrapList } from "@/lib/utils"

export type ConsentType = "terms_of_use" | "privacy_notice" | "clinical_treatment" | "record_sharing"

export interface ConsentRecord {
  id: string
  consentType: ConsentType
  isActive: boolean
}

// The response shape isn't documented, so this reads the likely fields defensively
function toConsent(raw: unknown): ConsentRecord | null {
  if (!raw || typeof raw !== "object") return null
  const source = raw as Record<string, unknown>
  const id = typeof source.id === "string" ? source.id : null
  const type = source.consentType ?? source.type
  if (!id || typeof type !== "string") return null
  const status = typeof source.status === "string" ? source.status.toLowerCase() : ""
  return {
    id,
    consentType: type as ConsentType,
    isActive: !source.revokedAt && status !== "revoked" && status !== "withdrawn",
  }
}

export const consentService = {
  async getMine(): Promise<ConsentRecord[]> {
    const { data } = await apiClient.get<unknown>("/consent/me")
    return unwrapList(data, ["consents"])
      .map(toConsent)
      .filter((consent): consent is ConsentRecord => consent !== null)
  },

  async grant(consentType: ConsentType, documentVersion: string): Promise<void> {
    await apiClient.post("/consent/me", { consentType, documentVersion, channel: "web" })
  },

  async revoke(id: string): Promise<void> {
    await apiClient.post(`/consent/me/${encodeURIComponent(id)}/revoke`)
  },
}
