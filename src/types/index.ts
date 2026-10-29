// ─── Domain Types for LifeCome Health (Patient & Healthcare App) ──────────────

export type UserRole = "patient"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatarUrl?: string
}

export interface PatientAccount {
  id: string
  email: string
  phoneNumber: string | null
  firstName?: string | null
  lastName?: string | null
  registeredName?: string | null
  avatarUrl?: string | null
  status: string
}

export interface PatientSession extends Partial<SessionTiming> {
  accessToken: string
  expiresIn: number
  account: PatientAccount
}

/** Server-side session timing returned at sign-in and by `/identity/session/refresh`. */
export interface SessionTiming {
  idleTimeoutSeconds: number
  idleExpiresAt: string
  expiresAt: string
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
  // Display details the API may include; each is shown only when present
  reference?: string | null
  clinicName?: string | null
  clinicAddress?: string | null
  /** Fee in minor units (pence or kobo) */
  feeMinor?: number | null
  currency?: "GBP" | "NGN" | null
  paymentStatus?: "paid" | "pending" | "refunded" | null
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export type MessageTopic =
  | "booking_payments"
  | "online_appointment"
  | "clinic_visit"
  | "follow_up"
  | "clinical_query"
  | "care_support"
  | "wellbeing_coaching"
  | "insurance_query"
  | "general_support"

export type MessageServiceCategory = "clinical" | "care" | "wellbeing" | "insurance" | "support"

export interface MessageThread {
  id: string
  topic: MessageTopic | null
  serviceCategory: MessageServiceCategory
  /** Latest message text, when the API includes it */
  preview: string | null
  lastActivityAt: string | null
  unreadCount: number
}

export interface ThreadMessage {
  id: string
  body: string
  createdAt: string | null
  /** True when the signed-in patient wrote it */
  isMine: boolean
  senderName: string | null
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
