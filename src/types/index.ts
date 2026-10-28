// ─── Domain Types for LifeCome Health (Patient & Healthcare App) ──────────────

export type UserRole = "patient"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
}

export interface PatientAccount {
  id: string
  email: string
  phoneNumber: string | null
  firstName?: string | null
  lastName?: string | null
  registeredName?: string | null
  status: string
}

export interface PatientSession {
  accessToken: string
  expiresIn: number
  account: PatientAccount
}

export interface PatientMeResponse {
  account: PatientAccount
  profile: PatientProfile | null
  displayName: string | null
  fullName: string | null
  secondName?: string | null
}

export interface PatientProfile {
  id: string
  userAccountId: string
  firstName: string
  lastName: string | null
  dateOfBirth: string
  sex?: string | null
  city?: string | null
  state?: string | null
  country?: "NG" | "GB"
  address?: string | null
  bloodGroup?: string | null
  genotype?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelationship?: string | null
  interests?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Doctor {
  id: string
  displayName: string
  specialty: string
  languages: string[]
  consultationModes: ("video" | "audio" | "in_person")[]
  city?: string | null
  state?: string | null
  networkStatus: "active" | "suspended" | "pending_review"
}

export type AppointmentType = "video" | "audio" | "in_person"
export type AppointmentStatus =
  | "slot_held"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "doctor_unavailable"
  | "patient_no_show"

export interface Appointment {
  id: string
  patientId: string
  providerId: string
  clinicalServiceId: string
  availabilitySlotId: string
  consultationMode: AppointmentType
  status: AppointmentStatus
  presentingConcern?: string | null
  fundingRoute: "pay_per_visit" | "lifecome_benefits" | "workplace" | "membership"
  serviceCategory: "gp" | "menopause" | "care" | "wellbeing"
  providerName?: string
  serviceName?: string
  startsAt?: string
  durationMinutes?: number
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorName: string
  date: string
  diagnosis: string
  category: "consultation" | "lab_result" | "imaging" | "vaccination" | "prescription"
  summary: string
  documents?: {
    id: string
    name: string
    size: string
    downloadUrl: string
  }[]
  vitalSigns?: {
    bloodPressure?: string
    heartRate?: number
    temperatureCelsius?: number
    oxygenSaturation?: number
  }
}

export interface Prescription {
  id: string
  patientId: string
  doctorName: string
  medicationName: string
  dosage: string
  frequency: string
  durationDays: number
  prescribedDate: string
  status: "active" | "completed" | "cancelled" | "refill_requested"
  pharmacyDestination?: string
}

export interface CarePlan {
  id: string
  patientId: string
  title: string
  category: "chronic_care" | "wellbeing" | "post_op" | "elderly_care"
  status: "active" | "under_review" | "completed"
  goals: {
    title: string
    targetDate: string
    isAchieved: boolean
  }[]
  assignedClinician: string
  lastReviewed: string
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: "LOGIN" | "LOGOUT" | "VIEW_RECORD" | "BOOK_APPOINTMENT" | "DOWNLOAD_DOCUMENT"
  resource: string
  ipAddress: string
  status: "SUCCESS" | "DENIED" | "FAILED"
  metadata?: Record<string, unknown>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
