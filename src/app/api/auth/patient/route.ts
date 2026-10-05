import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/client";
import { AUTH_COOKIE, PATIENT_ID_COOKIE } from "@/lib/auth/session";

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function messageFrom(body: unknown, fallback: string): string {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return fallback;
  const message = (body as Record<string, unknown>).message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(", ");
  return fallback;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const patientId = cookieStore.get(PATIENT_ID_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Your session has expired. Please sign in again." }, { status: 401 });
  }
  if (!patientId) {
    return NextResponse.json(
      { message: "Your account is signed in, but the patient profile could not be identified." },
      { status: 422 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${API_BASE_URL}/api/v1/patients/${encodeURIComponent(patientId)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Patient information is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }

  const body = await readJson(upstream);
  if (!upstream.ok) {
    const response = NextResponse.json(
      { message: messageFrom(body, "Unable to load your patient profile.") },
      { status: upstream.status },
    );
    if (upstream.status === 401) {
      response.cookies.delete(AUTH_COOKIE);
      response.cookies.delete(PATIENT_ID_COOKIE);
    }
    return response;
  }

  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
