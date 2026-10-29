"use client"

import { useEffect, useState } from "react"
import { getApiErrorMessage } from "@/lib/api-client"

export interface Resource<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  /** When the current data arrived, for time-based grouping that must not shift between renders */
  loadedAt: number | null
  reload: () => void
}

type Settled<T> = { requestKey: string; data: T | null; error: string | null; loadedAt: number }

// Loads `fetcher(key)` and keeps only the result for the latest key, so a slow earlier
// response can never replace a newer one. A null key waits without fetching.
// `fetcher` must be stable (defined at module level), or every render refetches.
export function useResource<T>(
  key: string | null,
  fetcher: (key: string) => Promise<T>,
  fallbackError: string
): Resource<T> {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const requestKey = key === null ? null : `${key}#${attempt}`

  useEffect(() => {
    if (key === null || requestKey === null) return
    let active = true
    fetcher(key).then(
      (data) => active && setSettled({ requestKey, data, error: null, loadedAt: Date.now() }),
      (cause) =>
        active && setSettled({ requestKey, data: null, error: getApiErrorMessage(cause, fallbackError), loadedAt: Date.now() })
    )
    return () => {
      active = false
    }
  }, [key, requestKey, fetcher, fallbackError])

  const current = settled && settled.requestKey === requestKey ? settled : null
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    isLoading: requestKey !== null && !current,
    loadedAt: current?.loadedAt ?? null,
    reload: () => setAttempt((count) => count + 1),
  }
}
