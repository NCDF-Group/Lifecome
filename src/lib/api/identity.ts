import { ApiError, apiClient } from "./client";

const V1 = "/api/v1/identity";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findUserAccountId(value: unknown): string | undefined {
  if (!isObject(value)) return undefined;
  for (const key of ["userAccountId", "id"]) {
    if (typeof value[key] === "string" && value[key]) return value[key];
  }
  for (const key of ["data", "userAccount", "user"]) {
    const nestedId = findUserAccountId(value[key]);
    if (nestedId) return nestedId;
  }
  return undefined;
}

export interface RegisterResponse {
  userAccountId: string;
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

  const response = await apiClient.post<unknown>(`${V1}/register`, payload);
  
  const userAccountId = findUserAccountId(response);

  if (!userAccountId || typeof userAccountId !== "string") {
    console.error("[API] Could not find userAccountId in register response:", response);
    throw new Error("Could not retrieve user account ID from registration response.");
  }

  return { ...(isObject(response) ? response : {}), userAccountId };
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

/** Patient login; the server stores the returned access token in an HttpOnly cookie. */
export async function login(email: string, password: string, rememberMe = false): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
    cache: "no-store",
  });

  if (response.ok) return;

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  throw new ApiError(response.status, body);
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
