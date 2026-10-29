"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { ChevronRight, Clock, PenSquare } from "lucide-react"
import { Notice, TeamIcon } from "@/components/portal/messages/shared"
import { ErrorState, FOCUS_RING, LoadingCards, PageContainer, PageHeader } from "@/components/portal/ui"
import { useMessageThreads } from "@/hooks/useMessages"
import { ROUTES } from "@/lib/constants"
import { TEAMS, TOPIC_LABELS, formatThreadActivity, getTeamForCategory, type MessageTeam } from "@/lib/messaging"
import { cn } from "@/lib/utils"

// Teams offered as conversation starters before the patient has any threads
const STARTER_TEAMS = TEAMS.filter((team) => team.id !== "support")

function InboxRow({
  href,
  team,
  title,
  subtitle,
  meta,
  unread = false,
}: {
  href: string
  team: MessageTeam
  title: string
  subtitle: string
  meta?: string | null
  unread?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 sm:gap-4 rounded-2xl border border-[#DCE8FB] bg-[#F0F6FF] px-4 py-3.5 sm:py-4 transition-all hover:border-blue-200 hover:shadow-sm",
          FOCUS_RING
        )}
      >
        <TeamIcon team={team} />
        <span className="flex-1 min-w-0">
          <span className={cn("block text-[15px] sm:text-base text-slate-900 truncate", unread ? "font-bold" : "font-semibold")}>{title}</span>
          <span className={cn("block text-sm truncate", unread ? "text-slate-700" : "text-slate-500")}>{subtitle}</span>
        </span>
        {(meta || unread) && (
          <span className="flex flex-col items-end gap-1 shrink-0">
            {meta && <span className="text-xs text-slate-500">{meta}</span>}
            {unread && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#0062F5]">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-[#0062F5] shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </li>
  )
}

export default function MessagesPage() {
  const { data, error, isLoading, loadedAt, reload } = useMessageThreads()

  const threads = useMemo(
    () =>
      [...(data ?? [])].sort((a, b) => {
        const aTime = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0
        const bTime = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0
        return bTime - aTime
      }),
    [data]
  )

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader title="Your messages" description="Stay connected with your teams." />

      {isLoading && <LoadingCards count={4} label="Loading your messages" />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && threads.length > 0 && (
        <ul className="space-y-3" aria-label="Conversations">
          {threads.map((thread) => {
            const team = getTeamForCategory(thread.serviceCategory)
            return (
              <InboxRow
                key={thread.id}
                href={`${ROUTES.PORTAL.MESSAGES}/${encodeURIComponent(thread.id)}`}
                team={team}
                title={team.name}
                subtitle={thread.preview ?? (thread.topic ? TOPIC_LABELS[thread.topic] : "Conversation")}
                meta={thread.lastActivityAt && loadedAt ? formatThreadActivity(thread.lastActivityAt, loadedAt) : null}
                unread={thread.unreadCount > 0}
              />
            )
          })}
        </ul>
      )}

      {data && threads.length === 0 && (
        <section aria-labelledby="start-conversation" className="space-y-3">
          <p id="start-conversation" className="text-sm text-slate-500">
            You have no messages yet. Choose a team to start a conversation.
          </p>
          <ul className="space-y-3">
            {STARTER_TEAMS.map((team) => (
              <InboxRow
                key={team.id}
                href={`${ROUTES.PORTAL.NEW_MESSAGE}?team=${team.id}`}
                team={team}
                title={team.name}
                subtitle={team.description}
              />
            ))}
          </ul>
        </section>
      )}

      <Link
        href={ROUTES.PORTAL.NEW_MESSAGE}
        className={cn(
          "flex items-center justify-center gap-2 min-h-[52px] rounded-2xl border border-blue-200 bg-white px-4 py-3 text-base sm:text-[17px] font-semibold text-[#0062F5] hover:bg-blue-50/60 hover:border-[#0062F5] transition-colors",
          FOCUS_RING
        )}
      >
        <PenSquare className="w-[18px] h-[18px]" aria-hidden />
        New message
      </Link>

      <Notice icon={Clock}>
        Messages are not monitored for emergencies. Use{" "}
        <Link href={ROUTES.PORTAL.URGENT_HELP} className="font-semibold text-[#0062F5] underline underline-offset-2">
          urgent help
        </Link>{" "}
        if you need immediate assistance.
      </Notice>
    </PageContainer>
  )
}
