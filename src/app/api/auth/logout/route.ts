import { NextResponse } from "next/server";
import { AUTH_COOKIE, PATIENT_ID_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(PATIENT_ID_COOKIE);
  return response;
}
