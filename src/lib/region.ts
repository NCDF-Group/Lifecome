"use client"

import { createLocalStore } from "./local-store"

export type RegionCode = "GB" | "NG"

export const REGIONS: { code: RegionCode; label: string; name: string }[] = [
  { code: "GB", label: "UK", name: "United Kingdom" },
  { code: "NG", label: "NG", name: "Nigeria" },
]

const isRegion = (value: string): value is RegionCode => REGIONS.some((region) => region.code === value)
const regionStore = createLocalStore<RegionCode>("lifecome_region", isRegion, "GB")

export const setRegion = regionStore.set
/** The patient's chosen region, remembered on this device. */
export const useRegion = regionStore.useValue
