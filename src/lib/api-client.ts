import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { API_BASE_URL, LOGOUT_PATH, ROUTES, SESSION_TIMEOUT_CODE } from "./constants"
import { authStorage } from "./auth-storage"

export interface ApiError {
  message: string
  code?: string
  status?: number
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message)
  }
  return fallback
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Attach the backend-issued patient session token.
apiClient.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      return Promise.reject(new Error("NEXT_PUBLIC_API_BASE_URL is not configured."))
    }

    const token = authStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// The API wraps failures as `{ error: { code, message, details } }`; older responses were flat
type ApiErrorBody = Partial<ApiError> & { error?: { code?: string; message?: string } }

// Signed-out pages where a 401 (e.g. a wrong password) is shown inline, not redirected
const GUEST_AUTH_PAGE = /^\/auth\/(login|register|forgot-password|reset-password|verify-email|verify-2fa)/

// Response Interceptor: Global error & 401 handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const body = error.response?.data
    const apiCode = body?.error?.code ?? body?.code

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      // Clear token and redirect to login if session expired. Signing out handles its own redirect.
      authStorage.clearTokens()
      const isLogout = originalRequest.url === LOGOUT_PATH
      if (typeof window !== "undefined" && !isLogout && !GUEST_AUTH_PAGE.test(window.location.pathname)) {
        const reason = apiCode === SESSION_TIMEOUT_CODE ? "reason=timeout" : "expired=true"
        window.location.href = `${ROUTES.AUTH.LOGIN}?${reason}`
      }
    }

    const formattedError: ApiError = {
      message:
        body?.error?.message ||
        body?.message ||
        error.message ||
        "An unexpected healthcare service error occurred.",
      status: error.response?.status,
      code: apiCode ?? error.code,
      errors: body?.errors,
    }

    return Promise.reject(formattedError)
  }
)

