"use client"

import { useEffect, useSyncExternalStore } from "react"
import { patientService, type AvatarContentType } from "@/services/patient.service"

// One shared copy of the signed-in patient's photo, so the nav bar, menu and profile page
// all update together after an upload. Keyed by account so a new sign-in never sees the last one.

interface AvatarState {
  ownerId: string | null
  src: string | null
  status: "idle" | "loading" | "ready" | "error"
}

const INITIAL: AvatarState = { ownerId: null, src: null, status: "idle" }
let state = INITIAL
const listeners = new Set<() => void>()

function setState(next: AvatarState) {
  // Object URLs hold the image in memory until released
  if (state.src?.startsWith("blob:") && state.src !== next.src) URL.revokeObjectURL(state.src)
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function ensureLoaded(ownerId: string) {
  if (state.ownerId === ownerId && state.status !== "idle") return
  setState({ ownerId, src: null, status: "loading" })
  patientService.getAvatar().then(
    (src) => state.ownerId === ownerId && setState({ ownerId, src, status: "ready" }),
    () => state.ownerId === ownerId && setState({ ownerId, src: null, status: "error" })
  )
}

/** The photo for `ownerId` (the account id), loading it on first use. */
export function useAvatar(ownerId: string | undefined): string | null {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => INITIAL)
  useEffect(() => {
    if (ownerId) ensureLoaded(ownerId)
  }, [ownerId])
  return ownerId && snapshot.ownerId === ownerId ? snapshot.src : null
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export const ACCEPTED_AVATAR_TYPES: AvatarContentType[] = ["image/jpeg", "image/png", "image/webp"]
const MAX_SOURCE_BYTES = 15 * 1024 * 1024
// The API accepts up to 699,055 base64 characters (512 KB of image)
const MAX_BASE64_LENGTH = 699_055
const MAX_DIMENSION = 512

/** Scales the photo down and re-encodes it as JPEG so it fits the API's size limit. */
async function prepareImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Your browser couldn't prepare this photo.")
  // JPEG has no transparency, so fill behind transparent PNGs
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  for (const quality of [0.9, 0.8, 0.65, 0.5]) {
    const base64 = canvas.toDataURL("image/jpeg", quality).split(",")[1] ?? ""
    if (base64.length <= MAX_BASE64_LENGTH) return base64
  }
  throw new Error("This photo is too large. Please choose a smaller one.")
}

export async function uploadAvatar(ownerId: string, file: File) {
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type as AvatarContentType)) {
    throw new Error("Choose a JPG, PNG or WebP photo.")
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error("This photo is too large. Please choose one under 15 MB.")

  const base64 = await prepareImage(file)
  await patientService.uploadAvatar("image/jpeg", base64)
  setState({ ownerId, src: `data:image/jpeg;base64,${base64}`, status: "ready" })
}

export async function removeAvatar(ownerId: string) {
  await patientService.removeAvatar()
  setState({ ownerId, src: null, status: "ready" })
}
