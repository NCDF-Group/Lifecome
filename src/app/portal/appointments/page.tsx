"use client"

import React, { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { CalendarClock, CalendarPlus, CalendarX } from "lucide-react"
import { AppointmentCard } from "@/components/portal/AppointmentCard"
import {
  ActionRow,
  EmptyState,
  ErrorState,
  LoadingCards,
  PageContainer,
  PageHeader,
  PrimaryActionLink,
  SectionHeading,
} from "@/components/portal/ui"
import { useAppointments } from "@/hooks/useAppointments"
import { isUpcoming, sortByStart } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Tab = "upcoming" | "past"
const TABS: Tab[] = ["upcoming", "past"]

export default function AppointmentsPage() {
  const { data, error, isLoading, loadedAt, reload } = useAppointments()
  const [tab, setTab] = useState<Tab>("upcoming")
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ upcoming: null, past: null })

  const { upcoming, past } = useMemo(() => {
    const now = loadedAt ?? 0
    const all = data ?? []
    return {
      upcoming: sortByStart(all.filter((appointment) => isUpcoming(appointment, now))),
      past: sortByStart(all.filter((appointment) => !isUpcoming(appointment, now)), "desc"),
    }
  }, [data, loadedAt])

  const visible = tab === "upcoming" ? upcoming : past
  const nextAppointment = upcoming[0]

  // Arrow keys move between the two tabs, as in a native tab list
  const handleTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const next = TABS[(TABS.indexOf(tab) + 1) % TABS.length]
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <PageContainer>
      <PageHeader title="Your appointments" description="View and manage your upcoming and past appointments." />

      <PrimaryActionLink href={ROUTES.PORTAL.BOOK} icon={CalendarPlus}>
        Book an appointment
      </PrimaryActionLink>

      <div role="tablist" aria-label="Appointments" className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100/80 p-1">
        {TABS.map((option) => {
          const selected = tab === option
          const count = option === "upcoming" ? upcoming.length : past.length
          return (
            <button
              key={option}
              ref={(node) => {
                tabRefs.current[option] = node
              }}
              id={`tab-${option}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${option}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(option)}
              onKeyDown={handleTabKey}
              className={cn(
                "rounded-xl py-3 text-[15px] sm:text-base font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5]",
                selected ? "bg-[#E3F5E9] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {option === "upcoming" ? "Upcoming" : "Past"}
              {data && ` (${count})`}
            </button>
          )
        })}
      </div>

      <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-3">
        <SectionHeading title={tab === "upcoming" ? "Upcoming appointments" : "Past appointments"} />

        {isLoading && <LoadingCards label="Loading your appointments" />}
        {error && <ErrorState message={error} onRetry={reload} />}

        {data && visible.length === 0 && (
          <EmptyState
            icon={tab === "upcoming" ? CalendarClock : CalendarX}
            title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            description={
              tab === "upcoming"
                ? "When you book an appointment, it will appear here."
                : "Appointments you've attended or cancelled will appear here."
            }
            action={
              tab === "upcoming" && (
                <Link
                  href={ROUTES.PORTAL.BOOK}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0062F5] hover:bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <CalendarPlus className="w-4 h-4" aria-hidden />
                  Book an appointment
                </Link>
              )
            }
          />
        )}

        {visible.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </section>

      {nextAppointment && (
        <section aria-labelledby="manage-booking" className="space-y-3">
          <SectionHeading id="manage-booking" title="Manage your booking" />
          <ActionRow
            iconVariant="square"
            item={{
              title: "Reschedule or cancel",
              description: "Change or cancel an upcoming appointment.",
              href: `${ROUTES.PORTAL.APPOINTMENTS}/${encodeURIComponent(nextAppointment.id)}`,
              icon: CalendarClock,
              tone: "blue",
            }}
          />
        </section>
      )}
    </PageContainer>
  )
}
