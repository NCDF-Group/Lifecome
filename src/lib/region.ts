"use client"

import { useSyncExternalStore } from "react"

export type RegionCode = "GB" | "NG"

export const REGIONS: { code: RegionCode; label: string; name: string }[] = [
  { code: "GB", label: "UK", name: "United Kingdom" },
  { code: "NG", label: "NG", name: "Nigeria" },
]

const REGION_KEY = "lifecome_region"
const DEFAULT_REGION: RegionCode = "GB"
const listeners = new Set<() => void>()

function readRegion(): RegionCode {
  const stored = window.localStorage.getItem(REGION_KEY)
  return REGIONS.some((region) => region.code === stored) ? (stored as RegionCode) : DEFAULT_REGION
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Keeps every open tab on the same region
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

export function setRegion(code: RegionCode) {
  window.localStorage.setItem(REGION_KEY, code)
  listeners.forEach((listener) => listener())
}

/** The patient's chosen region, remembered on this device. */
export function useRegion(): RegionCode {
  return useSyncExternalStore(subscribe, readRegion, () => DEFAULT_REGION)
}
