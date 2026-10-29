"use client"

import { useSyncExternalStore } from "react"

/**
 * A value remembered on this device and shared by every component (and tab) that reads it.
 * The server always renders `fallback`; the stored value takes over after hydration.
 */
export function createLocalStore<T extends string>(key: string, isValid: (value: string) => value is T, fallback: T) {
  const listeners = new Set<() => void>()

  const read = (): T => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null && isValid(stored) ? stored : fallback
    } catch {
      return fallback
    }
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    window.addEventListener("storage", listener)
    return () => {
      listeners.delete(listener)
      window.removeEventListener("storage", listener)
    }
  }

  return {
    set(value: T) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        // Storage blocked (private mode); the change still applies until the page reloads
      }
      listeners.forEach((listener) => listener())
    },
    useValue: () => useSyncExternalStore(subscribe, read, () => fallback),
  }
}
