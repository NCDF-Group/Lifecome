"use client";

import { regionForCoordinates, type Region } from "@/lib/region";

export type LocateResult =
  | { status: "found"; region: Region }
  /** Located fine, but not in Nigeria or the UK. */
  | { status: "outside" }
  /** The visitor said no (or their browser/OS blocks it). */
  | { status: "denied" }
  /** No signal, timed out, or the browser has no geolocation. */
  | { status: "unavailable" };

/**
 * Asks the browser for the visitor's position (it shows its own permission prompt) and maps it to a
 * region. Only the resulting region is kept: the coordinates are never stored or sent anywhere.
 * Must be called from a click - browsers ignore or penalise location prompts nobody asked for.
 */
export function locateRegion(): Promise<LocateResult> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve({ status: "unavailable" });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const region = regionForCoordinates(coords.latitude, coords.longitude);
        resolve(region ? { status: "found", region } : { status: "outside" });
      },
      (error) => resolve({ status: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable" }),
      // Country-level is enough: skip GPS, accept a recent cached fix.
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
    );
  });
}
