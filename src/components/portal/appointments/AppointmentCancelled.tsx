"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, CalendarPlus, ChevronRight, CircleCheck, Clock, CreditCard, MapPin, Users } from "lucide-react"
import { useAppointment } from "@/hooks/useAppointments"
import { formatFullDate, formatTime, getCategoryLabels, getLocationLabel, getReference } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { Avatar, PageContainer, PageHeader } from "../ui"
import { ActionButtonContent, AppointmentFallback, actionButtonClass, appointmentPath } from "./shared"

const REFUND_COPY = {
  refunded: { title: "Refunded", body: "Your refund has been issued to your original payment method." },
  reviewing: { title: "To be confirmed", body: "We're reviewing your cancellation. Refund status will be confirmed soon." },
}

export function AppointmentCancelled({ id }: { id: string }) {
  const router = useRouter()
  const { data: appointment, error, reload } = useAppointment(id)
  const isCancelled = appointment?.status === "cancelled"

  // Only a cancelled appointment has a confirmation to show
  useEffect(() => {
    if (appointment && !isCancelled) router.replace(appointmentPath(appointment.id))
  }, [appointment, isCancelled, router])

  if (!appointment || !isCancelled) return <AppointmentFallback error={error} onRetry={reload} />

  const labels = getCategoryLabels(appointment)
  // Refunds only apply when the patient paid for the visit themselves
  const showRefund = appointment.fundingRoute === "pay_per_visit" && appointment.paymentStatus !== "pending"
  const refund = appointment.paymentStatus === "refunded" ? REFUND_COPY.refunded : REFUND_COPY.reviewing

  return (
    <PageContainer wide className="space-y-5 sm:space-y-6">
      <PageHeader title="Appointment cancelled" description="Your appointment has been cancelled." />

      <div role="status" className="flex items-start sm:items-center gap-3 sm:gap-4 rounded-2xl border border-[#DDF2E4] bg-[#F1F9F4] p-4 sm:p-5">
        <span aria-hidden className="w-11 h-11 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
          <CircleCheck className="w-6 h-6" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] sm:text-base font-semibold text-slate-900">Appointment cancelled</p>
          <p className="text-sm sm:text-[15px] text-slate-600 break-words">
            Your {labels.short} appointment has been cancelled. Reference {getReference(appointment)}.
          </p>
        </div>
      </div>

      <section aria-labelledby="cancelled-details" className="rounded-2xl border border-[#DCE8FB] bg-[#F0F6FF] p-4 sm:p-5">
        <h2 id="cancelled-details" className="text-lg font-bold text-slate-900">
          Cancelled appointment
        </h2>
        <div className="mt-3 flex items-center gap-3 pb-4 border-b border-slate-200/70">
          <Avatar name={appointment.providerName} tone="blue" />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-slate-900 truncate">{appointment.providerName || "Your clinician"}</p>
            <p className="text-sm text-slate-500">{labels.short === "GP" ? "GP" : labels.clinician} appointment</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2.5 text-[15px] text-slate-700">
          {appointment.startsAt && (
            <>
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
                {formatFullDate(appointment.startsAt)}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
                {formatTime(appointment.startsAt)}
              </li>
            </>
          )}
          <li className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
            {getLocationLabel(appointment)}
          </li>
        </ul>
      </section>

      {showRefund && (
        <section aria-labelledby="refund-status" className="rounded-2xl border border-[#DDF2E4] bg-[#F1F9F4] p-4 sm:p-5">
          <h2 id="refund-status" className="text-lg font-bold text-slate-900">
            Refund status
          </h2>
          <div className="mt-3 flex items-start gap-3 sm:gap-4">
            <span aria-hidden className="w-11 h-11 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-slate-900">{refund.title}</p>
              <p className="text-sm sm:text-[15px] text-slate-600">{refund.body}</p>
              <Link
                href={ROUTES.PORTAL.CANCELLATION_TERMS}
                className="mt-1.5 inline-flex items-center gap-1 text-[15px] font-medium text-[#0062F5] hover:underline"
              >
                View cancellation terms
                <ChevronRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="space-y-3 pt-1">
        <Link href={ROUTES.PORTAL.APPOINTMENTS} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={CalendarPlus} align="start">
            View your visits
          </ActionButtonContent>
        </Link>
        <Link href={ROUTES.PORTAL.BOOK} className={actionButtonClass("soft", "[&>svg:first-child]:text-[#0062F5] [&>svg:last-child]:text-[#0062F5]")}>
          <ActionButtonContent icon={Users} align="start">
            Book another appointment
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
