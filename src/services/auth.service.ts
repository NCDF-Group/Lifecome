import { apiClient } from "@/lib/api-client"
import { authStorage } from "@/lib/auth-storage"
import type { PatientAccount, PatientMeResponse, PatientSession, User } from "@/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
}

export interface RegistrationResult extends PatientAccount {
  verificationEmailSent: boolean
}

export const PENDING_SIGNUP_EMAIL_KEY = "lifecome_pending_signup_email"
export const PENDING_PASSWORD_RESET_EMAIL_KEY = "lifecome_pending_password_reset_email"

export function toPatientUser(account: PatientAccount, displayName?: string | null): User {
  const registeredName = [account.firstName, account.lastName].filter(Boolean).join(" ").trim()
  return {
    id: account.id,
    email: account.email,
    name: displayName || account.registeredName || registeredName || account.email,
    phone: account.phoneNumber || undefined,
    role: "patient",
  }
}

function saveSession(session: PatientSession): User {
  const user = toPatientUser(session.account)
  authStorage.setTokens(session.accessToken, session.expiresIn)
  return user
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await apiClient.post<PatientSession>("/identity/login", credentials)
    return saveSession(data)
  },

  async register(input: RegisterData): Promise<RegistrationResult> {
    const { data } = await apiClient.post<RegistrationResult>("/identity/register", input)
    return data
  },

  async requestRegistrationOtp(userAccountId: string): Promise<{ emailSent: boolean }> {
    const { data } = await apiClient.post<{ expiresAt: string; emailSent: boolean }>("/identity/otp/request", { userAccountId })
    return { emailSent: data.emailSent }
  },

  async verifyRegistrationOtp(userAccountId: string, code: string): Promise<User> {
    const { data } = await apiClient.post<PatientSession>("/identity/otp/verify", {
      userAccountId,
      code,
    })
    return saveSession(data)
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/identity/password-reset/request", { email })
  },

  async verifyPasswordResetCode(email: string, code: string): Promise<void> {
    await apiClient.post("/identity/password-reset/verify", { email, code })
  },

  async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    await apiClient.post("/identity/password-reset/confirm", { email, code, newPassword })
  },

  async getMe(): Promise<{ response: PatientMeResponse; user: User }> {
    const { data } = await apiClient.get<PatientMeResponse>("/me")
    const user = toPatientUser(data.account, data.displayName)
    return { response: data, user }
  },

  logout(): void {
    authStorage.clearTokens()
  },
}
