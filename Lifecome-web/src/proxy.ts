import { NextResponse, type NextRequest } from "next/server";
import { GEO_COOKIE, LANGUAGE_COOKIE, REGION_COOKIE } from "@/lib/region";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/**
 * Records the visitor's country in a cookie so the (statically rendered) pages can offer the right
 * region without becoming dynamic. Vercel sets `x-vercel-ip-country`, Cloudflare `cf-ipcountry`;
 * anywhere else there is no header and the visitor is simply asked to choose.
 *
 * Outside production, `?geo=GB` overrides the header so the flow can be tried locally.
 * `?region=reset` clears the saved choice so the popup shows again.
 */
export function proxy(request: NextRequest) {
  // `?region=reset` forgets the saved region/language so the first-visit popup shows again (handy for
  // testing, and for anyone who wants to start over). Safe in production: it only clears the caller's own cookies.
  if (request.nextUrl.searchParams.get("region") === "reset") {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("region");
    const redirect = NextResponse.redirect(clean);
    redirect.cookies.delete(REGION_COOKIE);
    redirect.cookies.delete(LANGUAGE_COOKIE);
    return redirect;
  }

  const override = process.env.NODE_ENV !== "production" ? request.nextUrl.searchParams.get("geo") : null;
  const raw = override ?? request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  const country = raw?.trim().toUpperCase();

  const response = NextResponse.next();
  if (country && /^[A-Z]{2}$/.test(country) && request.cookies.get(GEO_COOKIE)?.value !== country) {
    response.cookies.set(GEO_COOKIE, country, {
      path: "/",
      sameSite: "lax",
      maxAge: THIRTY_DAYS,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

export const config = {
  // Pages only: skip Next internals and anything with a file extension (images, robots.txt, sitemap.xml).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
