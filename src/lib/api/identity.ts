import { apiClient } from "./client";

const V1 = "/api/v1/identity";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface RegisterResponse {
  userAccountId: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  accessToken: string;
  [key: string]: unknown;
}

// ─── Identity API ─────────────────────────────────────────────────────────────

/** Step 1 – create user account (returns userAccountId) */
export async function register(
  email: string,
  phoneNumber?: string,
): Promise<RegisterResponse> {
  const payload: Record<string, string> = { email };
  if (phoneNumber?.trim()) {
    payload.phoneNumber = phoneNumber.trim();
  }

  const res = await apiClient.post<Record<string, any>>(`${V1}/register`, payload);
  
  const userAccountId =
    res?.userAccountId ??
    res?.id ??
    res?.data?.userAccountId ??
    res?.data?.id ??
    res?.userAccount?.id ??
    res?.user?.id;

  if (!userAccountId || typeof userAccountId !== "string") {
    console.error("[API] Could not find userAccountId in register response:", res);
    throw new Error("Could not retrieve user account ID from registration response.");
  }

  return { ...res, userAccountId };
}

/** Step 2 – send OTP to the user's email */
export function requestOtp(userAccountId: string) {
  return apiClient.post<void>(`${V1}/otp/request`, { userAccountId });
}

/** Step 3 – verify OTP */
export function verifyOtp(userAccountId: string, code: string) {
  return apiClient.post<void>(`${V1}/otp/verify`, { userAccountId, code });
}

/** Step 4 – set password after OTP verified */
export function setPassword(userAccountId: string, password: string) {
  return apiClient.post<void>(`${V1}/password`, { userAccountId, password });
}

/** Patient login */
export function login(email: string, password: string) {
  return apiClient.post<LoginResponse>(`${V1}/login`, { email, password });
}

/** Forgot password – request reset code (sends email) */
export function requestPasswordReset(email: string) {
  return apiClient.post<void>(`${V1}/password-reset/request`, { email });
}

/** Verify the reset code from the email link */
export function verifyPasswordResetCode(email: string, code: string) {
  return apiClient.post<void>(`${V1}/password-reset/verify`, { email, code });
}

/** Confirm password reset with new password (requires verified code) */
export function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string,
) {
  return apiClient.post<void>(`${V1}/password-reset/confirm`, {
    email,
    code,
    newPassword,
  });
}
