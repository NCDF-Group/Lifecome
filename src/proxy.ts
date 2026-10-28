import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { TOKEN_COOKIE_NAME } from "@/lib/constants"

// Routes that require patient authentication
const PROTECTED_PREFIXES = ["/portal"]

// Authentication paths
const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-2fa",
  "/auth/verify-email",
  "/auth/onboarding",
  "/auth/welcome",
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore static assets and Next internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/brand") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const tokenCookie = request.cookies.get(TOKEN_COOKIE_NAME)?.value
  // The API owns the patient JWT signing key. The proxy only checks for a session cookie;
  // protected API requests validate the token with the backend.
  const isAuthenticated = Boolean(tokenCookie)
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path))
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  // 1. If user is logged in and tries to go to home page "/" or auth pages,
  // do not redirect back to the home page; keep them inside the patient dashboard
  if ((isAuthPage || pathname === "/") && isAuthenticated) {
    return NextResponse.redirect(new URL("/portal/profile", request.url))
  }

  // 2. Protect Patient Portal routes - redirect unauthenticated users to login
  if (isProtected) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add strict healthcare security headers to response
  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
