import Cookies from "js-cookie"
import { TOKEN_COOKIE_NAME, REFRESH_COOKIE_NAME, SESSION_MAX_AGE } from "./constants"

/**
 * Storage abstraction for Auth tokens.
 * Stores the API-issued patient token for browser requests and the route gate.
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
    this.clearLegacyStorage()
  },
}
