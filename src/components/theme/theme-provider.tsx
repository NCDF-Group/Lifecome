"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = "lc_theme_preference";
const CHANGE_EVENT = "lifecome-theme-change";
const subscribe = (callback: () => void) => {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
};

export function isThemePreference(
  value: string | null | undefined,
): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function applyTheme(preference: ThemePreference, isSystemDark: boolean) {
  const theme = preference === "system"
    ? isSystemDark ? "dark" : "light"
    : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
}

function readPreference(): ThemePreference {
  const value = document.documentElement.dataset.themePreference;
  return isThemePreference(value) ? value : "system";
}

function readServerPreference(): ThemePreference {
  return "system";
}

function setPreference(nextPreference: ThemePreference) {
  window.localStorage.setItem(STORAGE_KEY, nextPreference);
  applyTheme(nextPreference, window.matchMedia("(prefers-color-scheme: dark)").matches);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (document.documentElement.dataset.themePreference === "system") {
        applyTheme("system", event.matches);
      }
    };
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  return children;
}

export function useThemePreference(): ThemeContextValue {
  const preference = useSyncExternalStore(subscribe, readPreference, readServerPreference);
  return { preference, setPreference };
}
