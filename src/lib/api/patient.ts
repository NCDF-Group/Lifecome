import { apiClient } from "./client";

const V1 = "/api/v1/patients";

// ─── DTOs & Types ─────────────────────────────────────────────────────────────

export interface CreatePatientProfileDto {
  userAccountId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  sex?: string;
  city?: string;
  state?: string;
  country?: "NG" | "GB";
}

export interface UpdatePatientProfileDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  sex?: string;
  city?: string;
  state?: string;
  country?: "NG" | "GB";
}

export interface PatientProfile {
  id: string;
  userAccountId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex?: string;
  city?: string;
  state?: string;
  country?: "NG" | "GB";
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// ─── Patient API ──────────────────────────────────────────────────────────────

/** Create patient profile linked to userAccountId */
export function createPatientProfile(dto: CreatePatientProfileDto) {
  return apiClient.post<PatientProfile>(`${V1}`, dto);
}

/** Get patient profile by profile ID */
export function getPatientProfile(id: string) {
  return apiClient.get<PatientProfile>(`${V1}/${id}`);
}

/** Update patient profile by profile ID */
export function updatePatientProfile(id: string, dto: UpdatePatientProfileDto) {
  return apiClient.patch<PatientProfile>(`${V1}/${id}`, dto);
}
