"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Clock } from "lucide-react"
import { authStorage } from "@/lib/auth-storage"
import { authService } from "@/services/auth.service"
import { SESSION_WARNING_SECONDS } from "@/lib/constants"

const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "wheel"] as const
/** Activity is written to shared storage at most this often. */
const ACTIVITY_WRITE_INTERVAL_MS = 5_000
/** Longest gap between heartbeats to the API while the patient is active. */
const MAX_HEARTBEAT_INTERVAL_MS = 5 * 60_000
/** Ends the client session slightly early, covering request latency and clock drift. */
const SAFETY_MARGIN_MS = 15_000

/** `timeout`: idle limit reached; `user`: "Sign out now"; `elsewhere`: signed out in another tab. */
export type SessionEndReason = "timeout" | "user" | "elsewhere"

interface SessionTimeoutProps {
  onSessionEnd: (reason: SessionEndReason) => void
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}

/**
 * The session ends at the earlier of the two idle clocks: the patient's last activity in any tab,
 * and the last time the API restarted its own idle timeout. Using the earlier one means the
 * warning never offers to extend a session the server has already ended.
 */
function msUntilTimeout() {
  const lastActivity = authStorage.getLastActivity()
  const lastServerTouch = authStorage.getLastServerTouch() || lastActivity
  const idleMs = authStorage.getIdleTimeoutSeconds() * 1000
  return Math.min(lastActivity, lastServerTouch) + idleMs - SAFETY_MARGIN_MS - Date.now()
}

/**
 * Client half of the session timeout (the API enforces the same idle limit server-side).
 * Tracks activity across every open tab, keeps the server session alive with a heartbeat while
 * the patient is active, warns before the timeout and signs out when it is reached.
 */
export function SessionTimeout({ onSessionEnd }: SessionTimeoutProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [isExtending, setIsExtending] = useState(false)
  const isWarningRef = useRef(false)
  const isRefreshingRef = useRef(false)
  const hasEndedRef = useRef(false)
  const stayButtonRef = useRef<HTMLButtonElement>(null)

  const endSession = useCallback((reason: SessionEndReason) => {
    if (hasEndedRef.current) return
    hasEndedRef.current = true
    onSessionEnd(reason)
  }, [onSessionEnd])

  const refreshServerSession = useCallback(async () => {
    if (isRefreshingRef.current) return
    isRefreshingRef.current = true
    try {
      await authService.refreshSession()
    } finally {
      isRefreshingRef.current = false
    }
  }, [])

  useEffect(() => {
    // Opening the app counts as activity only when nothing is recorded yet; a reload after a long
    // idle spell must still time out
    if (!authStorage.getLastActivity()) authStorage.recordActivity()
    if (!authStorage.getLastServerTouch()) authStorage.recordServerTouch()

    const handleActivity = () => {
      // Once the warning is up, only an explicit "Stay signed in" extends the session
      if (isWarningRef.current) return
      const now = Date.now()
      if (now - authStorage.getLastActivity() >= ACTIVITY_WRITE_INTERVAL_MS) {
        authStorage.recordActivity(now)
      }
      const heartbeatIntervalMs = Math.min(
        MAX_HEARTBEAT_INTERVAL_MS,
        (authStorage.getIdleTimeoutSeconds() * 1000) / 3
      )
      if (now - authStorage.getLastServerTouch() >= heartbeatIntervalMs) {
        // A rejected heartbeat (session already ended) is redirected by the API client
        refreshServerSession().catch(() => undefined)
      }
    }

    const tick = () => {
      // Signed out in another tab
      if (!authStorage.getAccessToken()) {
        endSession("elsewhere")
        return
      }
      const remainingMs = msUntilTimeout()
      if (remainingMs <= 0) {
        endSession("timeout")
      } else if (remainingMs <= SESSION_WARNING_SECONDS * 1000) {
        isWarningRef.current = true
        setSecondsLeft(Math.ceil(remainingMs / 1000))
      } else if (isWarningRef.current) {
        // Extended from another tab
        isWarningRef.current = false
        setSecondsLeft(null)
      }
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }))
    document.addEventListener("visibilitychange", tick)
    const interval = window.setInterval(tick, 1000)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity))
      document.removeEventListener("visibilitychange", tick)
      window.clearInterval(interval)
    }
  }, [endSession, refreshServerSession])

  const isWarningOpen = secondsLeft !== null
  useEffect(() => {
    if (isWarningOpen) stayButtonRef.current?.focus()
  }, [isWarningOpen])

  const staySignedIn = async () => {
    setIsExtending(true)
    try {
      await refreshServerSession()
      authStorage.recordActivity()
      isWarningRef.current = false
      setSecondsLeft(null)
    } catch {
      // The session already ended; the API client redirects to the login page
    } finally {
      setIsExtending(false)
    }
  }

  if (!isWarningOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
        aria-describedby="session-timeout-description"
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h2 id="session-timeout-title" className="mt-5 text-xl font-bold text-slate-900">
          Are you still there?
        </h2>
        <p id="session-timeout-description" className="mt-2 text-sm text-slate-500 leading-relaxed">
          For your security, you&apos;ll be signed out in{" "}
          <span className="font-semibold text-slate-900 tabular-nums">
            {formatCountdown(secondsLeft)}
          </span>{" "}
          because you haven&apos;t been active.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            ref={stayButtonRef}
            type="button"
            onClick={staySignedIn}
            disabled={isExtending}
            className="w-full bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white text-sm font-medium py-3 rounded-[4px] transition-colors cursor-pointer"
          >
            {isExtending ? "Keeping you signed in…" : "Stay signed in"}
          </button>
          <button
            type="button"
            onClick={() => endSession("user")}
            className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 py-2.5 cursor-pointer"
          >
            Sign out now
          </button>
        </div>
      </div>
    </div>
  )
}
