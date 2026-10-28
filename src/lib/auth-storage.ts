import Cookies from "js-cookie"
import {
  TOKEN_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SESSION_MAX_AGE,
  DEFAULT_IDLE_TIMEOUT_SECONDS,
  SESSION_TIMEOUT_KEY,
  LAST_ACTIVITY_KEY,
  LAST_SERVER_TOUCH_KEY,
} from "./constants"

// Fallback when browser storage is unavailable (private mode, blocked site data)
let inMemoryLastActivity = 0
let inMemoryLastServerTouch = 0
let inMemoryIdleTimeout = DEFAULT_IDLE_TIMEOUT_SECONDS

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // The in-memory values above still cover this tab.
  }
}

/**
 * Storage abstraction for Auth tokens.
 * Stores the API-issued patient token for browser requests and the route gate,
 * plus the session-timeout bookkeeping shared across tabs.
 */
export const authStorage = {
  clearLegacyStorage() {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(TOKEN_COOKIE_NAME)
      localStorage.removeItem(REFRESH_COOKIE_NAME)
      localStorage.removeItem("lifecome_current_user")
    } catch {
      // Cookie-based sessions remain available if browser storage is disabled.
    }
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return Cookies.get(TOKEN_COOKIE_NAME) || null
  },

  setTokens(accessToken: string, expiresInSeconds = SESSION_MAX_AGE) {
    if (typeof window === "undefined") return

    // Set secure cookie accessible to client and middleware
    Cookies.set(TOKEN_COOKIE_NAME, accessToken, {
      expires: expiresInSeconds / (60 * 60 * 24),
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    })

  },

  clearTokens() {
    if (typeof window === "undefined") return
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" })
    Cookies.remove(REFRESH_COOKIE_NAME, { path: "/" })
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY)
      localStorage.removeItem(LAST_SERVER_TOUCH_KEY)
      localStorage.removeItem(SESSION_TIMEOUT_KEY)
    } catch {
      // Nothing stored to clear.
    }
    inMemoryLastActivity = 0
    inMemoryLastServerTouch = 0
    this.clearLegacyStorage()
  },

  getIdleTimeoutSeconds(): number {
    const stored = Number(readStorage(SESSION_TIMEOUT_KEY))
    return stored > 0 ? stored : inMemoryIdleTimeout
  },

  setIdleTimeoutSeconds(seconds: number) {
    if (!(seconds > 0)) return
    inMemoryIdleTimeout = seconds
    writeStorage(SESSION_TIMEOUT_KEY, String(seconds))
  },

  /** Last user activity in any tab, as epoch milliseconds (0 when unknown). */
  getLastActivity(): number {
    const stored = Number(readStorage(LAST_ACTIVITY_KEY))
    return Math.max(stored || 0, inMemoryLastActivity)
  },

  recordActivity(at = Date.now()) {
    inMemoryLastActivity = at
    writeStorage(LAST_ACTIVITY_KEY, String(at))
  },

  /** When the API last restarted the idle timeout, as epoch milliseconds (0 when unknown). */
  getLastServerTouch(): number {
    const stored = Number(readStorage(LAST_SERVER_TOUCH_KEY))
    return Math.max(stored || 0, inMemoryLastServerTouch)
  },

  recordServerTouch(at = Date.now()) {
    inMemoryLastServerTouch = at
    writeStorage(LAST_SERVER_TOUCH_KEY, String(at))
  },
}
