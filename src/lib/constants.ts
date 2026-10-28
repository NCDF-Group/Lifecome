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
export const SESSION_MAX_AGE = 60 * 60 * 12 // 12 hours in seconds; the API sends the real value

// ─── Session timeout ─────────────────────────────────────────────────────────
// The API owns the idle timeout and returns it at sign-in; this is only the fallback.
export const DEFAULT_IDLE_TIMEOUT_SECONDS = 15 * 60
/** How long before the timeout the "are you still there?" warning appears. */
export const SESSION_WARNING_SECONDS = 2 * 60
export const SESSION_TIMEOUT_KEY = "lifecome_idle_timeout_seconds"
/** Shared by every open tab, so activity in one keeps the others signed in too. */
export const LAST_ACTIVITY_KEY = "lifecome_last_activity"
/** When the API last restarted the idle timeout (sign-in or refresh), shared across tabs. */
export const LAST_SERVER_TOUCH_KEY = "lifecome_last_server_touch"
export const LOGOUT_PATH = "/identity/logout"
/** API error code for a session ended by the idle timeout. */
export const SESSION_TIMEOUT_CODE = "SESSION_TIMEOUT"

// ─── User Roles ──────────────────────────────────────────────────────────────

export const USER_ROLES = {
  PATIENT: "patient",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
