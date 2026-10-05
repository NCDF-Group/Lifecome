import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/client";
import {
  AUTH_COOKIE,
  PATIENT_ID_COOKIE,
  REMEMBER_MAX_AGE_SECONDS,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findValue(source: unknown, keys: string[]): string | undefined {
  if (!isObject(source)) return undefined;
  for (const key of keys) {
    if (typeof source[key] === "string" && source[key]) return source[key];
  }
  for (const key of ["data", "user", "patient", "account"]) {
    const nested = findValue(source[key], keys);
    if (nested) return nested;
  }
  return undefined;
}

function getTokenPatientId(token: string): string | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;

  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return findValue(claims, ["patientId", "userAccountId", "userId", "sub", "id"]);
  } catch {
    return undefined;
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function messageFrom(body: unknown, fallback: string): string {
  if (!isObject(body)) return fallback;
  const message = body.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(", ");
  return fallback;
}

export async function POST(request: Request) {
  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "Please provide valid sign-in details." }, { status: 400 });
  }

  if (
    !isObject(credentials) ||
    typeof credentials.email !== "string" ||
    !credentials.email.trim() ||
    typeof credentials.password !== "string" ||
    !credentials.password
  ) {
    return NextResponse.json({ message: "Please provide a valid email and password." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/api/v1/identity/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "The sign-in service is unavailable. Please try again." },
      { status: 502 },
    );
  }

  const body = await readJson(upstream);
  if (!upstream.ok) {
    return NextResponse.json(
      { message: messageFrom(body, "Unable to sign in. Please check your details and try again.") },
      { status: upstream.status },
    );
  }

  const accessToken = findValue(body, ["accessToken", "token"]);
  if (!accessToken) {
    return NextResponse.json(
      { message: "The sign-in service returned an invalid session. Please try again." },
      { status: 502 },
    );
  }

  const patientId =
    findValue(body, ["patientId", "userAccountId", "userId", "sub", "id"]) ??
    getTokenPatientId(accessToken);
  const rememberMe = credentials.rememberMe === true;
  const maxAge = rememberMe ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  const response = NextResponse.json({ success: true });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };

  response.cookies.set(AUTH_COOKIE, accessToken, cookieOptions);
  if (patientId) {
    response.cookies.set(PATIENT_ID_COOKIE, patientId, cookieOptions);
  } else {
    response.cookies.delete(PATIENT_ID_COOKIE);
  }

  return response;
}
