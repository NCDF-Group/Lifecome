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

  /** The profile photo as a displayable URL, or null when none is set. */
  async getAvatar(): Promise<string | null> {
    try {
      // Read as a blob: the API may send the image itself or JSON describing it
      const { data } = await apiClient.get<Blob>("/me/avatar", { responseType: "blob" })
      return await avatarSourceFrom(data)
    } catch (cause) {
      if (cause && typeof cause === "object" && "status" in cause && cause.status === 404) return null
      throw cause
    }
  },

  /** `base64` is the encoded image without a `data:` prefix. */
  async uploadAvatar(contentType: AvatarContentType, base64: string): Promise<void> {
    await apiClient.put("/me/avatar", { contentType, data: base64 })
  },

  async removeAvatar(): Promise<void> {
    await apiClient.delete("/me/avatar")
  },
}

export type AvatarContentType = "image/jpeg" | "image/png" | "image/webp"

async function avatarSourceFrom(blob: Blob): Promise<string | null> {
  if (blob.type.startsWith("image/")) return blob.size ? URL.createObjectURL(blob) : null

  const text = await blob.text()
  if (!text.trim()) return null
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return null
  }
  // Accept `{ url }`, `{ contentType, data }`, or either wrapped in `{ avatar }` / `{ data }`
  const candidates = [json, (json as { avatar?: unknown })?.avatar, (json as { data?: unknown })?.data]
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue
    const source = candidate as Record<string, unknown>
    const url = [source.url, source.avatarUrl, source.signedUrl].find((value) => typeof value === "string" && value)
    if (typeof url === "string") return url
    if (typeof source.data === "string" && source.data) {
      if (source.data.startsWith("data:")) return source.data
      const type = typeof source.contentType === "string" ? source.contentType : "image/jpeg"
      return `data:${type};base64,${source.data}`
    }
  }
  return null
}
