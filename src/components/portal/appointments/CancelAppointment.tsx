"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, CalendarX, ChevronRight, Clock, Info, MapPin, Monitor, Video, type LucideIcon } from "lucide-react"
import { useAppointment } from "@/hooks/useAppointments"
import { getApiErrorMessage } from "@/lib/api-client"
import { canManage, formatLongDate, formatTime, getCategoryLabels, getLocationLabel } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { appointmentService } from "@/services/appointment.service"
import { Avatar, EmptyState, ErrorState, PageContainer, PageHeader, TONES, type Tone } from "../ui"
import { ActionButtonContent, AppointmentFallback, actionButtonClass, appointmentPath } from "./shared"

const REASONS = ["Plans have changed", "No longer needed", "Booking a different service", "Other"] as const
type Reason = (typeof REASONS)[number]

function SummaryItem({ tone, icon: Icon, avatarName, label, value }: { tone: Tone; icon?: LucideIcon; avatarName?: string; label: string; value: string }) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-4 rounded-2xl border px-3 sm:px-4 py-3", TONES[tone].card)}>
      {avatarName !== undefined ? (
        <Avatar name={avatarName} tone="blue" size="md" className="text-xs" />
      ) : (
        Icon && (
          <span
            aria-hidden
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              tone === "green" ? "bg-emerald-100/80 text-emerald-600" : "bg-blue-100/80 text-[#0062F5]"
            )}
          >
            <Icon className="w-[18px] h-[18px]" />
          </span>
        )
      )}
      <div className="min-w-0">
        <dt className="text-[15px] font-semibold text-slate-900">{label}</dt>
        <dd className="text-sm text-slate-500 break-words">{value}</dd>
      </div>
    </div>
  )
}

export function CancelAppointment({ id }: { id: string }) {
  const router = useRouter()
  const { data: appointment, error, reload } = useAppointment(id)
  const [reason, setReason] = useState<Reason>(REASONS[0])
  const [otherReason, setOtherReason] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!appointment) return <AppointmentFallback error={error} onRetry={reload} />

  if (!canManage(appointment)) {
    return (
      <PageContainer>
        <PageHeader title="Cancel your appointment?" />
        <EmptyState
          icon={CalendarX}
          title="This appointment can't be cancelled"
          description="It has already taken place or been cancelled."
          action={
            <Link href={ROUTES.PORTAL.APPOINTMENTS} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View your visits
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const labels = getCategoryLabels(appointment)
  const isInPerson = appointment.consultationMode === "in_person"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isConfirmed) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const detail = reason === "Other" ? otherReason.trim() : ""
      await appointmentService.cancelAppointment(appointment.id, detail ? `Other: ${detail}` : reason)
      router.push(appointmentPath(appointment.id, "cancelled"))
    } catch (cause) {
      setSubmitError(getApiErrorMessage(cause, "We couldn't cancel your appointment. Please try again."))
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader title="Cancel your appointment?" description="Review the appointment before cancelling." />

      <dl className="space-y-2">
        <SummaryItem tone="green" icon={Monitor} label="Service" value={appointment.serviceName || labels.clinician} />
        <SummaryItem tone="blue" avatarName={appointment.providerName ?? ""} label="Clinician" value={appointment.providerName || "To be confirmed"} />
        <SummaryItem tone="green" icon={Calendar} label="Date" value={appointment.startsAt ? formatLongDate(appointment.startsAt) : "To be confirmed"} />
        <SummaryItem tone="blue" icon={Clock} label="Time" value={appointment.startsAt ? `${formatTime(appointment.startsAt)} · UK time` : "To be confirmed"} />
        <SummaryItem tone="green" icon={isInPerson ? MapPin : Video} label="Location" value={getLocationLabel(appointment)} />
      </dl>

      <div className="flex items-start gap-3 rounded-2xl border border-[#DCE8FB] bg-[#F0F6FF] p-4">
        <span aria-hidden className="mt-0.5 w-7 h-7 rounded-full bg-[#0A7CC2] text-white flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-slate-900">Cancellation terms</p>
          <p className="text-sm text-slate-600">Cancellations may be subject to the applicable cancellation terms.</p>
          <Link
            href={ROUTES.PORTAL.CANCELLATION_TERMS}
            className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0A7CC2] hover:underline"
          >
            View cancellation terms
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <fieldset>
          <legend className="mb-3 text-lg font-bold text-slate-900">Why are you cancelling?</legend>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 divide-y divide-slate-100 overflow-hidden">
            {REASONS.map((option) => (
              <label key={option} className="flex items-center gap-3 px-4 py-3 text-[15px] text-slate-800 cursor-pointer hover:bg-white/70">
                <input
                  type="radio"
                  name="cancel-reason"
                  value={option}
                  checked={reason === option}
                  onChange={() => setReason(option)}
                  className="w-5 h-5 accent-[#0A7CC2] cursor-pointer"
                />
                {option}
              </label>
            ))}
            {reason === "Other" && (
              <div className="px-4 py-3 bg-white">
                <label htmlFor="other-reason" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tell us more <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="other-reason"
                  value={otherReason}
                  onChange={(event) => setOtherReason(event.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>
        </fieldset>

        <label className="flex items-center gap-3 rounded-2xl border border-[#DCE8FB] bg-[#F0F6FF] px-4 py-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(event) => setIsConfirmed(event.target.checked)}
            className="w-5 h-5 rounded accent-[#0062F5] cursor-pointer"
          />
          <span className="text-[15px] font-semibold text-slate-900">I want to cancel this appointment.</span>
        </label>

        {submitError && <ErrorState message={submitError} />}

        <div className="space-y-3 pt-2">
          <button type="submit" disabled={!isConfirmed || isSubmitting} className={actionButtonClass("danger")}>
            <ActionButtonContent align="inline">{isSubmitting ? "Cancelling…" : "Confirm cancellation"}</ActionButtonContent>
          </button>
          <div className="text-center">
            <Link href={appointmentPath(appointment.id)} className="inline-block rounded-lg px-3 py-2 text-sm font-semibold text-[#0A7CC2] hover:underline">
              Keep appointment
            </Link>
          </div>
        </div>
      </form>
    </PageContainer>
  )
}
