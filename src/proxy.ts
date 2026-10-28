import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { TOKEN_COOKIE_NAME } from "@/lib/constants"

const DASHBOARD_PATH = "/portal/dashboard"

// Routes that require patient authentication. Onboarding and welcome run after the
// email is verified, so they belong to the signed-in session rather than the guest flow.
const PROTECTED_PREFIXES = ["/portal", "/auth/onboarding", "/auth/welcome"]

// Guest-only authentication paths; a signed-in patient is sent to the dashboard
const GUEST_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-2fa",
  "/auth/verify-email",
]

// Public landing pages; a signed-in patient stays inside the portal instead
const LANDING_PATHS = [
  "/",
  "/gp-care",
  "/gp-services",
  "/clinic-appointments",
  "/wellbeing",
  "/professional-care",
  "/insurance",
]

const matchesPath = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`)

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
  const isGuestAuthPage = GUEST_AUTH_PATHS.some((path) => matchesPath(pathname, path))
  const isLandingPage = LANDING_PATHS.some((path) =>
    path === "/" ? pathname === "/" : matchesPath(pathname, path)
  )
  const isProtected = PROTECTED_PREFIXES.some((prefix) => matchesPath(pathname, prefix))

  // 1. A signed-in patient never lands back on the public site or the guest auth pages;
  // keep them inside the patient dashboard
  if ((isGuestAuthPage || isLandingPage) && isAuthenticated) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
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
