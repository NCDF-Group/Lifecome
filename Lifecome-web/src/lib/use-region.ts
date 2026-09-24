"use client";

import { useSyncExternalStore } from "react";
import { GEO_COOKIE, REGION_COOKIE, defaultRegion, isRegion, regionForCountry, type Region } from "@/lib/region";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The raw cookie string is the snapshot: a stable primitive, so React can compare it cheaply. */
function getSnapshot(): string | null {
  return document.cookie;
}

/** `null` on the server means "cookies not readable yet", so nothing region-specific renders before hydration. */
function getServerSnapshot(): string | null {
  return null;
}

function readCookie(cookies: string, name: string): string | undefined {
  const match = cookies.split("; ").find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

/** Remembers the visitor's choice for a year and updates every mounted `useRegion` consumer. */
export function setRegion(region: Region) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${REGION_COOKIE}=${region}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${secure}`;
  listeners.forEach((listener) => listener());
}

export interface RegionState {
  /** False until the browser's cookies have been read (always false during server rendering). */
  ready: boolean;
  /** The region in effect: the visitor's choice, else the default. */
  region: Region;
  /** Whether the visitor has explicitly chosen a region. */
  hasChosen: boolean;
  /** The region their country maps to, or `null` outside both markets / when undetected. */
  detected: Region | null;
}

export function useRegion(): RegionState {
  const cookies = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (cookies === null) return { ready: false, region: defaultRegion, hasChosen: false, detected: null };

  const chosen = readCookie(cookies, REGION_COOKIE);
  return {
    ready: true,
    region: isRegion(chosen) ? chosen : defaultRegion,
    hasChosen: isRegion(chosen),
    detected: regionForCountry(readCookie(cookies, GEO_COOKIE)),
  };
}
