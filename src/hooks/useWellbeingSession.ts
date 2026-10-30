"use client"

import { useMemo, useSyncExternalStore } from "react"
import { SAMPLE_SESSION_ID } from "@/lib/wellbeing"
import type { Appointment } from "@/types"
import { useAppointment } from "./useAppointments"

// Kept for this tab only, so a sample never outlives the visit or reaches the API
const SAMPLE_KEY = "lifecome_sample_wellbeing_session"
const CHECK_IN_KEY = "lifecome_sample_wellbeing_check_in"
const noopSubscribe = () => () => {}

function read(key: string) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function saveSampleSession(session: Appointment) {
  try {
    window.sessionStorage.setItem(SAMPLE_KEY, JSON.stringify(session))
  } catch {
    // Storage blocked; the session screens explain that the sample has ended
  }
}

export function clearSampleSession() {
  try {
    window.sessionStorage.removeItem(SAMPLE_KEY)
  } catch {
    // Nothing stored to clear
  }
}

/** Only the date is kept. No one can read a check-in yet, so the patient's answers aren't stored. */
export function saveSampleCheckIn() {
  try {
    window.sessionStorage.setItem(CHECK_IN_KEY, new Date().toISOString())
  } catch {
    // Storage blocked; the plan keeps showing the check-in as not completed
  }
}

/** When this tab last completed a check-in, if it has. */
export const useSampleCheckIn = () => useSyncExternalStore(noopSubscribe, () => read(CHECK_IN_KEY), () => null)

/** A real wellbeing appointment from the API, or the tab's sample booking. */
export function useWellbeingSession(id: string) {
  const isSample = id === SAMPLE_SESSION_ID
  const appointment = useAppointment(isSample ? null : id)
  // undefined until the browser takes over, as the server can't see this tab's storage
  const stored = useSyncExternalStore(noopSubscribe, () => read(SAMPLE_KEY), () => undefined)
  const sample = useMemo(() => (stored ? (JSON.parse(stored) as Appointment) : null), [stored])

  if (!isSample) return { session: appointment.data, error: appointment.error, reload: appointment.reload, isSample }
  return {
    session: sample,
    error: stored === null ? "This sample session has ended. Please start a new booking." : null,
    reload: appointment.reload,
    isSample,
  }
}
