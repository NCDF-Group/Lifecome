"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, CalendarPlus, Check, CirclePlay, Clock, CreditCard, Hourglass, Leaf, Lightbulb, Monitor, User, type LucideIcon } from "lucide-react"
import { ActionButtonContent, AppointmentFallback, actionButtonClass } from "@/components/portal/appointments/shared"
import { PageContainer, TONES, type Tone } from "@/components/portal/ui"
import { useWellbeingSession } from "@/hooks/useWellbeingSession"
import { formatFee, formatShortDate, formatTime, getLocationLabel, getReference } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import { getCalendarHref, wellbeingSessionPath } from "@/lib/wellbeing"
import { ServiceInfo } from "../shared"
import { SampleSessionNotice } from "./SampleSessionNotice"

const RAYS = ["M22 8l6 6", "M92 8l-6 6", "M4 36h10", "M100 36h10", "M18 92l6-6", "M96 92l-6-6"]

function SuccessMark() {
  return (
    <span aria-hidden className="relative mx-auto block w-[114px] h-[100px]">
      <svg viewBox="0 0 114 100" className="absolute inset-0 w-full h-full text-emerald-200" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        {RAYS.map((ray) => (
          <path key={ray} d={ray} />
        ))}
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
        <Check className="w-8 h-8" strokeWidth={3} />
      </span>
    </span>
  )
}

export function BookingConfirmed({ id }: { id: string }) {
  const router = useRouter()
  const { session, error, reload, isSample } = useWellbeingSession(id)
  const isConfirmed = session?.status === "confirmed"

  // Only a confirmed booking has a confirmation to show
  useEffect(() => {
    if (session && !isConfirmed) router.replace(wellbeingSessionPath(id))
  }, [session, isConfirmed, id, router])

  if (!session || !isConfirmed) return <AppointmentFallback error={error} onRetry={reload} />

  const fee = formatFee(session)
  const calendarHref = getCalendarHref(session)
  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Leaf, label: "Service", value: session.serviceName || "Wellbeing session" },
    { icon: User, label: "With", value: session.providerName || "To be confirmed" },
    { icon: CalendarDays, label: "Date", value: session.startsAt ? formatShortDate(session.startsAt) : "To be confirmed" },
    { icon: Clock, label: "Time", value: session.startsAt ? `${formatTime(session.startsAt)} UK time` : "To be confirmed" },
    { icon: Monitor, label: "Location", value: session.consultationMode === "in_person" ? getLocationLabel(session) : "Online" },
    ...(session.durationMinutes ? [{ icon: Hourglass, label: "Duration", value: `${session.durationMinutes} minutes` }] : []),
    // The API's own payment status decides this line, so it only says paid once money has moved
    ...(fee ? [{ icon: CreditCard, label: "Payment", value: [fee, session.paymentStatus].filter(Boolean).join(" ") }] : []),
  ]

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <header className="text-center">
        <SuccessMark />
        <h1 className="mt-3 text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Wellbeing booking confirmed</h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-slate-500">
          Reference <span className="font-semibold text-slate-900">{getReference(session)}</span>
        </p>
      </header>

      {isSample && <SampleSessionNotice />}

      <dl className="space-y-1.5">
        {rows.map(({ icon: Icon, label, value }, index) => {
          const tone: Tone = index % 2 === 0 ? "green" : "blue"
          return (
            <div key={label} className={cn("border rounded-xl px-3.5 sm:px-4 py-3 flex items-center gap-3", TONES[tone].card)}>
              <dt className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-500 shrink-0">
                <Icon className={cn("w-[18px] h-[18px] shrink-0", TONES[tone].icon)} aria-hidden />
                {label}
              </dt>
              <dd className="flex-1 min-w-0 text-right text-sm sm:text-[15px] font-semibold text-slate-900">{value}</dd>
            </div>
          )
        })}
      </dl>

      <div className="space-y-2.5">
        <Link href={wellbeingSessionPath(id)} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={CirclePlay} align="start">
            View session
          </ActionButtonContent>
        </Link>
        {calendarHref && (
          <a href={calendarHref} download="wellbeing-session.ics" className={actionButtonClass("outline")}>
            <ActionButtonContent icon={CalendarPlus} align="start">
              Add to calendar
            </ActionButtonContent>
          </a>
        )}
      </div>

      <ServiceInfo icon={Lightbulb} tone="blue" title="Preparation">
        Think about one routine you would like to work on.
      </ServiceInfo>
    </PageContainer>
  )
}
