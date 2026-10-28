// ─── API & App Constants ────────────────────────────────────────────────────

export const APP_NAME = "LifeCome Health"
export const APP_DESCRIPTION =
  "GP appointments, everyday wellbeing, professional care and insurance support — connected around you."

/** Full backend base URL, including `/api/v1`, supplied when the live endpoint is known. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") ?? ""

// ─── Route Paths ────────────────────────────────────────────────────────────

export const ROUTES = {
  // Public
  HOME: "/",
  GP_CARE: "/gp-care",
  CLINIC_APPOINTMENTS: "/clinic-appointments",
  WELLBEING: "/wellbeing",
  PROFESSIONAL_CARE: "/professional-care",
  INSURANCE: "/insurance",

  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Protected Patient Portal
  PORTAL: {
    DASHBOARD: "/portal/dashboard",
    APPOINTMENTS: "/portal/appointments",
    RECORDS: "/portal/records",
    CARE_PLANS: "/portal/care-plans",
    PROFILE: "/portal/profile",
  },
} as const

// ─── Auth ────────────────────────────────────────────────────────────────────

export const TOKEN_COOKIE_NAME = "lifecome_access_token"
export const REFRESH_COOKIE_NAME = "lifecome_refresh_token"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

// ─── User Roles ──────────────────────────────────────────────────────────────

export const USER_ROLES = {
  PATIENT: "patient",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
