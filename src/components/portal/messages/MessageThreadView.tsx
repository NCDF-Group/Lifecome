"use client"

import React, { useEffect, useRef, useState } from "react"
import { ArrowRight, FileText, Info } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useMessageThreads, useThreadMessages } from "@/hooks/useMessages"
import { ROUTES } from "@/lib/constants"
import {
  MESSAGE_MAX_LENGTH,
  TOPIC_LABELS,
  formatMessageDay,
  formatMessageTime,
  getTeamForCategory,
  messageDayKey,
} from "@/lib/messaging"
import { getApiErrorMessage } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { messagingService } from "@/services/messaging.service"
import type { ThreadMessage } from "@/types"
import { ServiceRow } from "../services/shared"
import { ErrorState, FOCUS_RING, LoadingCards, PageContainer, PageHeader } from "../ui"
import { Notice } from "./shared"

const DEFAULT_TEAM = getTeamForCategory("clinical")
const COMPOSER_MAX_HEIGHT = 200

interface PendingMessage {
  body: string
  status: "sending" | "sent"
  /** The message list when it was sent; a newer list from the API includes it */
  baseline: ThreadMessage[] | null
}

function Bubble({ message, isPending = false }: { message: ThreadMessage; isPending?: boolean }) {
  const time = isPending ? "Sending…" : message.createdAt ? formatMessageTime(message.createdAt) : null
  const sender = message.isMine ? "You" : (message.senderName ?? "Care team")

  return (
    <li className={cn("flex", message.isMine && "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] min-w-0 rounded-2xl px-4 py-3",
          message.isMine ? "bg-[#E8F5EC]" : "border border-[#DCE8FB] bg-[#F0F6FF]",
          isPending && "opacity-70"
        )}
      >
        <p className="text-[15px] text-slate-900 whitespace-pre-wrap break-words">{message.body}</p>
        <p className="mt-1.5 text-xs text-slate-500">{[sender, time].filter(Boolean).join(" · ")}</p>
      </div>
    </li>
  )
}

export function MessageThreadView({ id }: { id: string }) {
  const { user } = useAuth()
  const threads = useMessageThreads()
  const { messages, error, isLoading, loadedAt, refresh } = useThreadMessages(id, user?.id)
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState<PendingMessage | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const shownCountRef = useRef<number | null>(null)

  const thread = threads.data?.find((item) => item.id === id) ?? null
  const team = thread ? getTeamForCategory(thread.serviceCategory) : DEFAULT_TEAM
  const showPending = pending && (pending.status === "sending" || messages === pending.baseline)
  const shownCount = (messages?.length ?? 0) + (showPending ? 1 : 0)

  // Bring new messages into view, but not on first load, which keeps the page header visible
  useEffect(() => {
    if (messages === null) return
    const previous = shownCountRef.current
    shownCountRef.current = shownCount
    if (previous !== null && shownCount > previous) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, shownCount])

  const resizeComposer = () => {
    const composer = composerRef.current
    if (!composer) return
    composer.style.height = "auto"
    composer.style.height = `${Math.min(composer.scrollHeight, COMPOSER_MAX_HEIGHT)}px`
  }

  const send = async () => {
    const body = draft.trim()
    if (!body || pending?.status === "sending") return
    setSendError(null)
    setPending({ body, status: "sending", baseline: messages })
    setDraft("")
    requestAnimationFrame(resizeComposer)
    try {
      await messagingService.sendMessage(id, body)
      setPending({ body, status: "sent", baseline: messages })
      refresh()
    } catch (cause) {
      setPending(null)
      setDraft(body)
      setSendError(getApiErrorMessage(cause, "Your message wasn't sent. Please try again."))
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends on devices with a keyboard; on touch screens it adds a new line
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    event.preventDefault()
    void send()
  }

  // Group consecutive messages under a day heading
  const groups: { key: string; label: string | null; items: ThreadMessage[] }[] = []
  for (const message of messages ?? []) {
    const key = message.createdAt ? messageDayKey(message.createdAt) : "undated"
    const last = groups[groups.length - 1]
    if (last?.key === key) last.items.push(message)
    else {
      const label = message.createdAt && loadedAt ? formatMessageDay(message.createdAt, loadedAt) : null
      groups.push({ key, label, items: [message] })
    }
  }

  return (
    <PageContainer wide className="space-y-5 sm:space-y-5">
      <PageHeader title={thread ? team.name : "Care team messages"} description={thread?.topic ? TOPIC_LABELS[thread.topic] : "Patient support."} />

      {isLoading && <LoadingCards count={3} label="Loading conversation" />}
      {error && messages === null && <ErrorState message={error} onRetry={refresh} />}

      {messages && (
        <div role="log" aria-live="polite" aria-label="Conversation" className="space-y-5">
          {messages.length === 0 && !showPending && (
            <p className="py-6 text-center text-sm text-slate-500">No messages in this conversation yet.</p>
          )}
          {groups.map((group) => (
            <section key={group.key} aria-label={group.label ?? undefined} className="space-y-4">
              {group.label && <p className="text-center text-sm text-slate-400">{group.label}</p>}
              <ul className="space-y-4">
                {group.items.map((message) => (
                  <Bubble key={message.id} message={message} />
                ))}
              </ul>
            </section>
          ))}
          {showPending && (
            <ul>
              <Bubble
                message={{ id: "pending", body: pending.body, createdAt: null, isMine: true, senderName: null }}
                isPending={pending.status === "sending"}
              />
            </ul>
          )}
          {error && <p className="text-center text-xs text-slate-400">We couldn&apos;t check for new messages. We&apos;ll try again shortly.</p>}
          <div ref={endRef} />
        </div>
      )}

      <ServiceRow
        item={{
          title: "Related information",
          description: "View the next step in your care",
          href: ROUTES.PORTAL.RECORDS,
          icon: FileText,
          tone: "blue",
        }}
      />

      <div className="space-y-3">
        {sendError && <ErrorState message={sendError} />}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void send()
          }}
          className="flex items-end gap-2.5"
        >
          <label htmlFor="message-composer" className="sr-only">
            Type a message
          </label>
          <textarea
            id="message-composer"
            ref={composerRef}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              resizeComposer()
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Type a message…"
            disabled={messages === null}
            className="flex-1 min-w-0 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || pending?.status === "sending"}
            className={cn(
              "w-[52px] h-[52px] rounded-xl bg-[#0062F5] hover:bg-[#0052cc] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
              FOCUS_RING
            )}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <Notice icon={Info}>
          For routine messages only. Messages are reviewed during service hours, not continuously. If you need help now,{" "}
          <Link href={ROUTES.PORTAL.URGENT_HELP} className="font-semibold text-[#0062F5] underline underline-offset-2">
            view urgent help
          </Link>
          .
        </Notice>
      </div>
    </PageContainer>
  )
}
