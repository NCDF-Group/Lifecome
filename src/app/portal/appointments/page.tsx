"use client"

import React, { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { CalendarDays, HeartPulse, Sprout, Stethoscope, Video } from "lucide-react"
import { actionButtonClass } from "@/components/portal/appointments/shared"
import { ServiceRow } from "@/components/portal/services/shared"
import { ErrorState, FOCUS_RING, LoadingCards, PageContainer, PageHeader } from "@/components/portal/ui"
import { useVisits } from "@/hooks/useVisits"
import { formatLongDate, formatTime } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { getVisitHref, getVisitTab, type VisitTab } from "@/lib/visits"
import type { Visit } from "@/types"

const TABS: { id: VisitTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
]

const EMPTY_STATES: Record<VisitTab, { title: string; description: string }> = {
  upcoming: { title: "No upcoming appointments", description: "Upcoming visits will be listed here." },
  past: { title: "No past appointments", description: "Past visits will be listed here." },
  cancelled: { title: "No cancelled appointments", description: "Cancelled visits will be listed here." },
}

const BOOK_BUTTON = actionButtonClass("outline", "justify-center border-blue-200")

function getVisitIcon(visit: Visit, tab: VisitTab) {
  if (visit.service === "wellbeing") return Sprout
  if (visit.service === "care") return HeartPulse
  return tab === "upcoming" && visit.deliveryChannel === "online" ? Video : Stethoscope
}

export default function VisitsPage() {
  const { data, error, isLoading, loadedAt, reload } = useVisits()
  const [tab, setTab] = useState<VisitTab>("upcoming")
  const tabRefs = useRef<Partial<Record<VisitTab, HTMLButtonElement | null>>>({})

  const visible = useMemo(() => {
    const now = loadedAt ?? 0
    const order = tab === "upcoming" ? 1 : -1
    return (data ?? [])
      .filter((visit) => getVisitTab(visit, now) === tab)
      .sort((a, b) => (new Date(a.scheduledStartsAt).getTime() - new Date(b.scheduledStartsAt).getTime()) * order)
  }, [data, loadedAt, tab])

  // Arrow keys move between the tabs, as in a native tab list
  const handleTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const step = event.key === "ArrowRight" ? 1 : -1
    const next = TABS[(TABS.findIndex(({ id }) => id === tab) + step + TABS.length) % TABS.length].id
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  const showEmpty = data && visible.length === 0

  return (
    <PageContainer wide className="space-y-5 sm:space-y-5">
      <PageHeader title="Your visits" description="Appointments, sessions and care in one place." />

      <div role="tablist" aria-label="Visits" className="flex gap-2">
        {TABS.map(({ id, label }) => {
          const selected = tab === id
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node
              }}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="visits-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={handleTabKey}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                selected ? "bg-[#0062F5] border-[#0062F5] text-white" : "bg-white border-slate-200 text-slate-500 hover:text-slate-700",
                FOCUS_RING
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <section id="visits-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-3">
        {isLoading && <LoadingCards label="Loading your visits" />}
        {error && <ErrorState message={error} onRetry={reload} />}

        {showEmpty && (
          <div className="text-center pt-8 pb-6">
            <CalendarDays aria-hidden className="mx-auto w-14 h-14 text-blue-300" strokeWidth={1.75} />
            <h2 className="mt-5 text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight">{EMPTY_STATES[tab].title}</h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-500">{EMPTY_STATES[tab].description}</p>
          </div>
        )}

        {visible.length > 0 && (
          <ul className="space-y-3">
            {visible.map((visit) => (
              <li key={`${visit.service}-${visit.id}`}>
                <ServiceRow
                  size="home"
                  item={{
                    title: visit.title,
                    description: [formatLongDate(visit.scheduledStartsAt), formatTime(visit.scheduledStartsAt), visit.providerOrWorkerName].join(" · "),
                    href: getVisitHref(visit),
                    icon: getVisitIcon(visit, tab),
                    tone: "blue",
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        {data && (
          <div className="space-y-3 pt-1">
            {showEmpty && tab !== "upcoming" && (
              <button type="button" onClick={() => setTab("upcoming")} className={actionButtonClass("primary", "justify-center")}>
                View upcoming visits
              </button>
            )}
            <Link href={ROUTES.PORTAL.BOOK} className={BOOK_BUTTON}>
              Book an appointment
            </Link>
          </div>
        )}
      </section>
    </PageContainer>
  )
}
