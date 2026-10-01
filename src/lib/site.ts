export const siteName = "LifeCome Live";

export const siteDescription =
  "Online healthcare and coordinated care: see a doctor by video or audio, get a clear care plan, and keep your records in one place. Use your HMO or pay directly.";

/** Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in each environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Base URL of the authenticated patient application. Sign-in is hidden until this is set,
 * so the public site never links to a page that does not exist yet.
 */
export const patientAppUrl = process.env.NEXT_PUBLIC_PATIENT_APP_URL?.replace(/\/$/, "");

/** Public contact address for enquiries (optional). Partner and support calls to action fall back to the support page when unset. */
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

/** Link into the authenticated patient app, or `null` while the app URL is not configured. */
export function appHref(path: `/${string}` = "/sign-in"): string | null {
  return patientAppUrl ? `${patientAppUrl}${path}` : null;
}
