"use client"

import React, { useEffect, useRef, useState } from "react"
import { Asterisk, Info, SendHorizontal } from "lucide-react"
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
  type MessageTeam,
} from "@/lib/messaging"
import { getApiErrorMessage } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { messagingService } from "@/services/messaging.service"
import type { ThreadMessage } from "@/types"
import { ActionRow, ErrorState, FOCUS_RING, LoadingCards, PageContainer, PageHeader } from "../ui"
import { Notice, TeamIcon } from "./shared"

const DEFAULT_TEAM = getTeamForCategory("clinical")
const COMPOSER_MAX_HEIGHT = 200

interface PendingMessage {
  body: string
  status: "sending" | "sent"
  /** The message list when it was sent; a newer list from the API includes it */
  baseline: ThreadMessage[] | null
}

function Bubble({ message, team, isPending = false }: { message: ThreadMessage; team: MessageTeam; isPending?: boolean }) {
  const time = message.createdAt ? formatMessageTime(message.createdAt) : null

  if (message.isMine) {
    return (
      <li className="flex justify-end">
        <div className={cn("max-w-[85%] sm:max-w-[60%] rounded-2xl rounded-br-md bg-[#E8F5EC] px-3.5 py-2.5", isPending && "opacity-70")}>
          <p className="text-right text-xs text-slate-500">{isPending ? "Sending…" : time}</p>
          <p className="mt-0.5 text-[15px] text-slate-900 whitespace-pre-wrap break-words">{message.body}</p>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-start gap-2.5 sm:gap-3">
      <TeamIcon team={team} size="sm" className="bg-[#F0F6FF] border border-[#DCE8FB] mt-0.5" />
      <div className="max-w-[85%] sm:max-w-[60%] min-w-0 rounded-2xl rounded-tl-md border border-[#DCE8FB] bg-[#F0F6FF] px-3.5 py-2.5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] font-semibold text-slate-900 truncate">{message.senderName ?? "Care team"}</p>
          {time && <p className="text-xs text-slate-500 shrink-0">{time}</p>}
        </div>
        <p className="mt-1 text-[15px] text-slate-800 whitespace-pre-wrap break-words">{message.body}</p>
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
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Messages"
        title={thread ? team.name : "Care team messages"}
        description={thread?.topic ? TOPIC_LABELS[thread.topic] : "Patient support."}
      />

      <Notice icon={Info}>Messages are reviewed during service hours, not continuously.</Notice>

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
                  <Bubble key={message.id} message={message} team={team} />
                ))}
              </ul>
            </section>
          ))}
          {showPending && (
            <ul>
              <Bubble
                message={{ id: "pending", body: pending.body, createdAt: null, isMine: true, senderName: null }}
                team={team}
                isPending={pending.status === "sending"}
              />
            </ul>
          )}
          {error && <p className="text-center text-xs text-slate-400">We couldn&apos;t check for new messages. We&apos;ll try again shortly.</p>}
          <div ref={endRef} />
        </div>
      )}

      <div className="border-t border-slate-100 pt-5 space-y-3">
        {sendError && <ErrorState message={sendError} />}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void send()
          }}
          className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white pl-4 pr-2 py-2 focus-within:border-[#0062F5] focus-within:ring-2 focus-within:ring-blue-100"
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
            className="flex-1 resize-none bg-transparent py-2 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || pending?.status === "sending"}
            className={cn(
              "w-10 h-10 rounded-full bg-[#0062F5] hover:bg-[#0052cc] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
              FOCUS_RING
            )}
          >
            <SendHorizontal className="w-[18px] h-[18px]" />
          </button>
        </form>

        <ActionRow
          titleClassName="text-red-600"
          item={{
            title: "Need urgent help?",
            description: "View emergency guidance.",
            href: ROUTES.PORTAL.URGENT_HELP,
            icon: Asterisk,
            tone: "red",
          }}
        />
      </div>
    </PageContainer>
  )
}
