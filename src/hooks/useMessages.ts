"use client"

import { useEffect, useState } from "react"
import { getApiErrorMessage } from "@/lib/api-client"
import { messagingService } from "@/services/messaging.service"
import type { MessageThread, ThreadMessage } from "@/types"
import { useResource } from "./useResource"

const fetchThreads = () => messagingService.getThreads()

export const useMessageThreads = () =>
  useResource<MessageThread[]>("all", fetchThreads, "We couldn't load your messages.")

// The API has no live updates, so an open conversation checks for replies on this interval
const POLL_INTERVAL_MS = 20_000

interface ThreadState {
  threadId: string
  messages: ThreadMessage[] | null
  error: string | null
  /** When the messages last arrived, for "Today" and "Yesterday" labels */
  loadedAt: number | null
}

/** Messages in one thread, refreshed while the tab is visible. */
export function useThreadMessages(threadId: string, viewerId: string | undefined) {
  const [state, setState] = useState<ThreadState | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    const load = () =>
      messagingService.getMessages(threadId, viewerId).then(
        (messages) => active && setState({ threadId, messages, error: null, loadedAt: Date.now() }),
        (cause) =>
          active &&
          // A failed refresh keeps the messages already on screen
          setState((previous) => {
            const kept = previous?.threadId === threadId ? previous : null
            return {
              threadId,
              messages: kept?.messages ?? null,
              error: getApiErrorMessage(cause, "We couldn't load this conversation."),
              loadedAt: kept?.loadedAt ?? null,
            }
          })
      )

    load()
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load()
    }, POLL_INTERVAL_MS)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [threadId, viewerId, attempt])

  const current = state?.threadId === threadId ? state : null
  return {
    messages: current?.messages ?? null,
    error: current?.error ?? null,
    isLoading: !current,
    loadedAt: current?.loadedAt ?? null,
    /** Fetches again now, e.g. after sending or on "Try again" */
    refresh: () => setAttempt((count) => count + 1),
  }
}
