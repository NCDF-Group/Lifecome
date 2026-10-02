/**
 * Thin session helpers – store / read / clear the access token.
 *
 * We use a simple cookie so it's available both in browser JS and on the
 * server (e.g. middleware, Server Components), but keep the logic simple enough
 * to replace with a more robust solution (e.g. iron-session, next-auth) later.
 *
 * The cookie is HttpOnly in production, set via an API Route so the token
 * never touches client JS.  For the initial implementation we store in a
 * normal (readable) cookie so no API Route is needed yet; switching to
 * HttpOnly is a one-line server-side change later.
 */

const TOKEN_KEY = "lc_access_token";
const SESSION_MAX_AGE_S = 60 * 60 * 8; // 8 hours for standard session
const REMEMBER_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days for Remember Me

// ─── Browser helpers ──────────────────────────────────────────────────────────

function setCookie(name: string, value: string, maxAge: number) {
  const secure =
    typeof window !== "undefined" &&
    window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Persist the access token received after login. */
export function saveToken(token: string, rememberMe: boolean = false) {
  const maxAge = rememberMe ? REMEMBER_MAX_AGE_S : SESSION_MAX_AGE_S;
  setCookie(TOKEN_KEY, token, maxAge);
}

/** Read the stored access token (null if not logged in). */
export function getToken(): string | null {
  return getCookie(TOKEN_KEY);
}

/** Remove the token (logout). */
export function clearToken() {
  deleteCookie(TOKEN_KEY);
}

/** True when a token is present (does NOT validate the token server-side). */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
