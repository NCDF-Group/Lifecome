"use client";

import { useSyncExternalStore } from "react";
import {
  GEO_COOKIE,
  LANGUAGE_COOKIE,
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
 * consumer. Saving the region is what stops the first-visit popup from showing again.
 */
export function setPreferences({ region, language }: { region: Region; language: Language }) {
  writeCookie(REGION_COOKIE, region);
  writeCookie(LANGUAGE_COOKIE, language);
  applyRegionToDocument(region);
  listeners.forEach((listener) => listener());
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
}

export interface RegionState {
  /** False until the browser's cookies have been read (always false during server rendering). */
  ready: boolean;
  /** The region in effect: the visitor's choice, else the default. */
  region: Region;
  /** The preferred language: the visitor's choice, else English. */
  language: Language;
  /** Whether the visitor has already answered the first-visit popup. */
  hasChosen: boolean;
  /** The region their country maps to, or `null` outside both markets / when undetected. */
  detected: Region | null;
}

export function useRegion(): RegionState {
  const cookies = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (cookies === null) {
    return { ready: false, region: defaultRegion, language: defaultLanguage, hasChosen: false, detected: null };
  }

  const chosen = readCookie(cookies, REGION_COOKIE);
  const language = readCookie(cookies, LANGUAGE_COOKIE);
  return {
    ready: true,
    region: isRegion(chosen) ? chosen : defaultRegion,
    language: isLanguage(language) ? language : defaultLanguage,
    hasChosen: isRegion(chosen),
    detected: regionForCountry(readCookie(cookies, GEO_COOKIE)),
  };
}
