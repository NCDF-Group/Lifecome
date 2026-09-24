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
