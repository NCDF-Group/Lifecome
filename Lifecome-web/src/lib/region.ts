/** The markets LifeCome Live is available in. Add a region here first, then to `regionForCountry`. */
export type Region = "ng" | "uk";

/** The region a visitor's explicit choice is stored under (set by the client, never by the proxy). */
export const REGION_COOKIE = "lc_region";

/** The visitor's detected ISO country code, written by `src/proxy.ts` from the CDN's geo header. */
export const GEO_COOKIE = "lc_geo";

/** Shown until a visitor chooses, and to anyone outside both markets. */
export const defaultRegion: Region = "ng";

/** Languages a visitor can prefer. Only Nigeria offers a choice; the UK is English. */
export type Language = "en" | "yo" | "ig" | "ha";

/** The visitor's preferred language, stored alongside their region. */
export const LANGUAGE_COOKIE = "lc_lang";

export const defaultLanguage: Language = "en";

export interface LanguageConfig {
  id: Language;
  /** The language's name in English. */
  name: string;
  /** The language's name in itself, so speakers recognise it at a glance. */
  native: string;
}

export const languageList: readonly LanguageConfig[] = [
  { id: "yo", name: "Yoruba", native: "Yorùbá" },
  { id: "ig", name: "Igbo", native: "Igbo" },
  { id: "ha", name: "Hausa", native: "Hausa" },
  { id: "en", name: "English", native: "English" },
];

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "yo" || value === "ig" || value === "ha";
}

export interface RegionConfig {
  id: Region;
  /** Full name, e.g. in the switcher menu. */
  name: string;
  /** Compact label for the header button. */
  shortName: string;
  /** How the prompt describes where the visitor appears to be. */
  country: string;
}

export const regions: Record<Region, RegionConfig> = {
  ng: { id: "ng", name: "Nigeria", shortName: "NG", country: "Nigeria" },
  uk: { id: "uk", name: "United Kingdom", shortName: "UK", country: "the United Kingdom" },
};

export const regionList: readonly RegionConfig[] = [regions.ng, regions.uk];

export function isRegion(value: string | null | undefined): value is Region {
  return value === "ng" || value === "uk";
}

/** Maps an ISO 3166-1 alpha-2 country code to a region, or `null` when we don't operate there. */
export function regionForCountry(country: string | null | undefined): Region | null {
  switch (country?.toUpperCase()) {
    case "NG":
      return "ng";
    case "GB":
      return "uk";
    default:
      return null;
  }
}

/**
 * Runs in <head> before first paint so the right region's copy is visible immediately (no flash of
 * Nigeria copy for a UK visitor), while every page stays statically rendered. Keep it dependency-free:
 * it is inlined as a string. `document.cookie` is the source of truth, exactly as `useRegion` reads it.
 */
export const regionInitScript = `try{var m=document.cookie.match(/(?:^|; )${REGION_COOKIE}=(ng|uk)/);var r=m?m[1]:"${defaultRegion}";var e=document.documentElement;e.dataset.region=r;e.lang=r==="uk"?"en-GB":"en-NG"}catch(_){}`;

/** The `<html lang>` for a region: both markets read English, spelled the British way. */
export function htmlLangFor(region: Region): string {
  return region === "uk" ? "en-GB" : "en-NG";
}

/**
 * Rough bounding boxes, used only to suggest a region from browser coordinates. Deliberately
 * approximate (no map data, and coordinates never leave the device); the visitor still confirms, so a
 * border case such as Dublin falling inside the UK box costs one tap, not a wrong answer.
 */
const boxes: Record<Region, { south: number; north: number; west: number; east: number }> = {
  ng: { south: 4.2, north: 13.9, west: 2.6, east: 14.7 },
  uk: { south: 49.8, north: 60.9, west: -8.7, east: 1.8 },
};

export function regionForCoordinates(latitude: number, longitude: number): Region | null {
  for (const region of ["ng", "uk"] as const) {
    const box = boxes[region];
    if (latitude >= box.south && latitude <= box.north && longitude >= box.west && longitude <= box.east) return region;
  }
  return null;
}
