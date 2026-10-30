"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, CalendarX, ChevronDown, Clock, Database, FileText, Leaf, Trash2 } from "lucide-react"
import { ActionButtonContent, AppointmentFallback, actionButtonClass, appointmentPath } from "@/components/portal/appointments/shared"
import { EmptyState, ErrorState, IconBadge, PageContainer, PageHeader, TONES } from "@/components/portal/ui"
import { clearSampleSession, useWellbeingSession } from "@/hooks/useWellbeingSession"
import { getApiErrorMessage } from "@/lib/api-client"
import { canManage, formatShortDate, formatTime } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { wellbeingSessionPath } from "@/lib/wellbeing"
import { appointmentService } from "@/services/appointment.service"
import { ServiceInfo, ServiceRow } from "../shared"
import { SampleSessionNotice } from "./SampleSessionNotice"

const REASONS = ["Plans changed", "No longer needed", "Booking a different service", "Other"]

export function CancelSession({ id }: { id: string }) {
  const router = useRouter()
  const { session, error, reload, isSample } = useWellbeingSession(id)
  const [reason, setReason] = useState(REASONS[0])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!session) return <AppointmentFallback error={error} onRetry={reload} />

  if (!canManage(session)) {
    return (
      <PageContainer>
        <PageHeader title="Cancel wellbeing session" />
        <EmptyState
          icon={CalendarX}
          title="This session can't be cancelled"
          description="It has already taken place or been cancelled."
          action={
            <Link href={wellbeingSessionPath(id)} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View session
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isConfirmed) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      if (isSample) {
        clearSampleSession()
        router.push(ROUTES.PORTAL.WELLBEING)
      } else {
        await appointmentService.cancelAppointment(session.id, reason)
        router.push(appointmentPath(session.id, "cancelled"))
      }
    } catch (cause) {
      setSubmitError(getApiErrorMessage(cause, "We couldn't cancel your session. Please try again."))
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="Cancel wellbeing session" description="You can cancel this session if your plans have changed." />

      {isSample && <SampleSessionNotice />}

      <div className={cn("border rounded-2xl p-3.5 flex items-center gap-3 sm:gap-3.5", TONES.blue.card)}>
        <IconBadge icon={Leaf} tone="green" variant="tinted" size="lg" className="sm:w-14 sm:h-14" />
        <div className="min-w-0">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{session.serviceName || "Wellbeing session"}</p>
          {session.providerName && <p className="text-sm text-slate-500 leading-snug">{session.providerName}</p>}
          {session.startsAt && (
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm font-semibold text-slate-800">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                {formatShortDate(session.startsAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                {formatTime(session.startsAt)}
              </span>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={cn("border rounded-2xl p-3.5 sm:p-4", TONES.green.card)}>
          <label htmlFor="cancel-session-reason" className="text-[17px] sm:text-lg font-bold text-slate-900">
            Reason for cancellation
          </label>
          <div className="relative mt-2">
            <select
              id="cancel-session-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full min-h-[52px] appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-11 text-[15px] text-slate-900 cursor-pointer focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
            >
              {REASONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" aria-hidden />
          </div>
        </div>

        <div className="space-y-2.5">
          <ServiceRow
            item={{
              title: "View cancellation terms",
              description: "Read the terms that apply to this session.",
              href: ROUTES.PORTAL.CANCELLATION_TERMS,
              icon: FileText,
              tone: "blue",
            }}
          />
          <ServiceInfo icon={Database} tone="green" title="Refund status">
            {session.paymentStatus === "refunded" ? "Refunded" : "To be confirmed"}
          </ServiceInfo>
        </div>

        <label className={cn("flex items-center gap-3 border rounded-2xl px-3.5 py-3 cursor-pointer", TONES.blue.card)}>
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(event) => setIsConfirmed(event.target.checked)}
            className="w-5 h-5 shrink-0 rounded accent-[#0062F5] cursor-pointer"
          />
          <span className="text-[15px] font-semibold text-slate-900">I want to cancel this session.</span>
        </label>

        {submitError && <ErrorState message={submitError} />}

        <div className="space-y-2.5">
          <button type="submit" disabled={!isConfirmed || isSubmitting} className={actionButtonClass("danger")}>
            <ActionButtonContent icon={Trash2} align="start">
              {isSubmitting ? "Cancelling…" : "Confirm cancellation"}
            </ActionButtonContent>
          </button>
          <Link href={wellbeingSessionPath(id)} className={actionButtonClass("outline")}>
            <ActionButtonContent align="group">Keep session</ActionButtonContent>
          </Link>
        </div>
      </form>
    </PageContainer>
  )
}
