import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { API_BASE_URL, ROUTES } from "./constants"
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

// Response Interceptor: Global error & 401 handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Clear token and redirect to login if session expired
      authStorage.clearTokens()
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
        window.location.href = `${ROUTES.AUTH.LOGIN}?expired=true`
      }
    }

    const formattedError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected healthcare service error occurred.",
      status: error.response?.status,
      code: error.code,
      errors: error.response?.data?.errors,
    }

    return Promise.reject(formattedError)
  }
)

