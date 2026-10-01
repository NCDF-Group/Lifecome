"use client";

import { useSyncExternalStore } from "react";
import {
  GEO_COOKIE,
  LANGUAGE_COOKIE,
  POPUP_COOKIE,
  REGION_COOKIE,
  defaultLanguage,
  defaultRegion,
  htmlLangFor,
  isLanguage,
  isRegion,
  regionForCountry,
  type Language,
  type Region,
} from "@/lib/region";
import { setTranslationTarget } from "@/lib/translate";

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

function writeCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${secure}`;
}

/**
 * Saves the visitor's region and language for a year and updates every mounted `useRegion`
 * consumer. `dontShowAgain` additionally stops the first-visit popup from appearing on later loads.
 */
export function setPreferences({
  region,
  language,
  dontShowAgain = false,
}: {
  region: Region;
  language: Language;
  dontShowAgain?: boolean;
}) {
  writeCookie(REGION_COOKIE, region);
  writeCookie(LANGUAGE_COOKIE, language);
  if (dontShowAgain) writeCookie(POPUP_COOKIE, "off");
  applyRegionToDocument(region);
  listeners.forEach((listener) => listener());
  applyTranslation(language);
}

/** Stops the popup appearing on later loads without changing the visitor's region or language. */
export function disablePopup() {
  writeCookie(POPUP_COOKIE, "off");
  listeners.forEach((listener) => listener());
}

/** Set just before a reload that we caused ourselves, so the popup doesn't pop straight back up. */
export const POPUP_SKIP_KEY = "lc_skip_popup";

/**
 * Yoruba/Igbo/Hausa are applied by translating the page in place, and English can't be restored
 * from that without reloading - so a change in translation reloads once. Same-language changes don't.
 * That reload is ours, not the visitor's, so it is flagged to keep the popup from reopening.
 */
function applyTranslation(language: Language) {
  if (!setTranslationTarget(language)) return;
  try {
    sessionStorage.setItem(POPUP_SKIP_KEY, "1");
  } catch {
    // Storage blocked: the popup may reopen once after the reload, which is harmless.
  }
  window.location.reload();
}

/** Switches the region-specific copy (see `ForRegion` and the rules in globals.css) without a reload. */
function applyRegionToDocument(region: Region) {
  document.documentElement.dataset.region = region;
  document.documentElement.lang = htmlLangFor(region);
}

/** Switching region resets language to English: only Nigeria offers a choice. */
export function setRegion(region: Region) {
  setPreferences({ region, language: defaultLanguage });
}

export function setLanguage(language: Language) {
  writeCookie(LANGUAGE_COOKIE, language);
  listeners.forEach((listener) => listener());
  applyTranslation(language);
}

export interface RegionState {
  /** False until the browser's cookies have been read (always false during server rendering). */
  ready: boolean;
  /** The region in effect: the visitor's choice, else the default. */
  region: Region;
  /** The preferred language: the visitor's choice, else English. */
  language: Language;
  /** Whether the visitor has ever chosen a region (the popup itself no longer depends on this). */
  hasChosen: boolean;
  /** Whether the visitor ticked "Don't show this again". */
  popupDisabled: boolean;
  /** The region their country maps to, or `null` outside both markets / when undetected. */
  detected: Region | null;
}

export function useRegion(): RegionState {
  const cookies = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (cookies === null) {
    return {
      ready: false,
      region: defaultRegion,
      language: defaultLanguage,
      hasChosen: false,
      popupDisabled: false,
      detected: null,
    };
  }

  const chosen = readCookie(cookies, REGION_COOKIE);
  const language = readCookie(cookies, LANGUAGE_COOKIE);
  return {
    ready: true,
    region: isRegion(chosen) ? chosen : defaultRegion,
    language: isLanguage(language) ? language : defaultLanguage,
    hasChosen: isRegion(chosen),
    popupDisabled: readCookie(cookies, POPUP_COOKIE) === "off",
    detected: regionForCountry(readCookie(cookies, GEO_COOKIE)),
  };
}
