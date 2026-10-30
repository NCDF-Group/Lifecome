"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, CalendarPlus, CalendarX, ChevronRight, Clock, CreditCard, FileText, Info, Monitor, User, Video } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { EmptyState, IconBadge, PageContainer, PageHeader, TONES } from "@/components/portal/ui"
import { saveSampleSession } from "@/hooks/useWellbeingSession"
import { formatShortDate } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  SAMPLE_PAYMENT_CARD,
  SAMPLE_PRACTITIONER,
  SAMPLE_SESSION_ID,
  SAMPLE_SESSION_TIMES,
  WELLBEING_SERVICES,
  buildSampleSession,
  dayKeyToIso,
  getSampleSessionDays,
  wellbeingPath,
  wellbeingSessionPath,
  type WellbeingServiceId,
} from "@/lib/wellbeing"

const CARD = cn("border rounded-2xl p-4", TONES.blue.card)
const CARD_HEADING = "text-[17px] sm:text-lg font-bold text-slate-900"

export function ReviewBooking({ serviceId, date, time }: { serviceId: WellbeingServiceId; date?: string; time?: string }) {
  const router = useRouter()
  const service = WELLBEING_SERVICES[serviceId]
  const [days] = useState(() => getSampleSessionDays())
  const [goal, setGoal] = useState("")
  const [hasReviewed, setHasReviewed] = useState(false)

  if (!date || !time || !days.includes(date) || !SAMPLE_SESSION_TIMES.includes(time)) {
    return (
      <PageContainer>
        <PageHeader title="Review wellbeing booking" />
        <EmptyState
          icon={CalendarX}
          title="This session is no longer available"
          description="Please choose another date and time."
          action={
            <Link href={wellbeingPath(serviceId, "session")} className="text-sm font-semibold text-[#0062F5] hover:underline">
              Choose a session
            </Link>
          }
        />
      </PageContainer>
    )
  }

  // No payment gateway is connected yet, so this continues as a sample rather than taking money or booking
  const handlePay = () => {
    saveSampleSession(buildSampleSession(serviceId, date, time, goal.trim()))
    router.push(wellbeingSessionPath(SAMPLE_SESSION_ID, "confirmed"))
  }

  const sessionDetails = [
    { icon: User, label: SAMPLE_PRACTITIONER.name },
    { icon: CalendarDays, label: formatShortDate(dayKeyToIso(date)) },
    { icon: Clock, label: `${time} UK time` },
    { icon: Video, label: service.length },
    { icon: Monitor, label: service.format },
  ]

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="Review wellbeing booking" description="Please check the details below before confirming your booking." />

      <div className={cn(CARD, "flex items-start gap-3 sm:gap-3.5")}>
        <IconBadge icon={service.icon} tone="green" variant="tinted" size="lg" className="sm:w-16 sm:h-16 text-emerald-700" />
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{service.title}</h2>
          <ul className="mt-1.5 space-y-1.5">
            {sessionDetails.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm sm:text-[15px] text-slate-600">
                <Icon className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={CARD}>
        <label htmlFor="booking-goal" className={CARD_HEADING}>
          Your goal
        </label>
        <textarea
          id="booking-goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          maxLength={200}
          placeholder="Build a realistic routine that fits my week."
          className="mt-2 block w-full h-[76px] sm:h-[54px] resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 text-[15px] leading-snug text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section aria-labelledby="booking-payment" className={CARD}>
        <h2 id="booking-payment" className={CARD_HEADING}>
          Payment
        </h2>
        <div className="mt-1.5 pb-2.5 border-b border-[#DCE8FB] flex items-center gap-3">
          <CreditCard className="w-5 h-5 shrink-0 text-emerald-700" aria-hidden />
          <span className="flex-1 min-w-0 text-[15px] text-slate-700">{SAMPLE_PAYMENT_CARD}</span>
          <Link
            href={`${ROUTES.PORTAL.PROFILE}/payment-methods`}
            aria-label="Change payment method"
            className="inline-flex items-center gap-0.5 shrink-0 rounded-md text-sm font-semibold text-[#0062F5] hover:underline"
          >
            Change
            <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-4">
          <span className="text-[17px] font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">{service.sampleFee}</span>
        </div>
      </section>

      <Link href={ROUTES.PORTAL.CANCELLATION_TERMS} className={actionButtonClass("soft", "text-[#0062F5] text-[15px] sm:text-base")}>
        <ActionButtonContent icon={FileText} align="start">
          Session and cancellation terms
        </ActionButtonContent>
      </Link>

      <label className="flex items-center gap-2.5 cursor-pointer text-sm sm:text-[15px] text-slate-700">
        <input
          type="checkbox"
          checked={hasReviewed}
          onChange={(event) => setHasReviewed(event.target.checked)}
          className="w-5 h-5 shrink-0 rounded accent-[#0062F5] cursor-pointer"
        />
        I have reviewed the details and terms.
      </label>

      <Notice icon={Info} title="Sample booking">
        Online booking isn&apos;t available yet. No payment will be taken and nothing will be booked.
      </Notice>

      <button type="button" onClick={handlePay} disabled={!hasReviewed} className={actionButtonClass("primary", "justify-center gap-2")}>
        <CalendarPlus className="w-5 h-5 shrink-0" aria-hidden />
        Pay {service.sampleFee} and book
      </button>
    </PageContainer>
  )
}
