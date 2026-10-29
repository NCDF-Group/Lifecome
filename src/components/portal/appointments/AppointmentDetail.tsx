"use client"

import React from "react"
import Link from "next/link"
import {
  Calendar,
  CalendarPlus,
  CircleCheck,
  CircleCheckBig,
  Clock,
  CreditCard,
  Info,
  MapPin,
  MessageCircle,
  Monitor,
  Video,
} from "lucide-react"
import { useAppointment } from "@/hooks/useAppointments"
import {
  MODE_LABELS,
  STATUS_STYLES,
  canManage,
  formatFee,
  formatFullDate,
  formatTime,
  getCategoryLabels,
  getLocationLabel,
  getReference,
} from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/types"
import { ActionRow, Avatar, PageContainer, PageHeader } from "../ui"
import { ActionButtonContent, AppointmentFallback, DetailRow, actionButtonClass, appointmentPath } from "./shared"

/** A new message to the team behind this appointment, filed under the right topic. */
function messageTeamHref(appointment: Appointment) {
  const team = appointment.serviceCategory === "care" || appointment.serviceCategory === "wellbeing" ? appointment.serviceCategory : "gp"
  const topic = appointment.consultationMode === "in_person" ? "clinic_visit" : "online_appointment"
  return `${ROUTES.PORTAL.NEW_MESSAGE}?team=${team}&topic=${topic}`
}

export function AppointmentDetail({ id, justRescheduled }: { id: string; justRescheduled: boolean }) {
  const { data: appointment, error, reload } = useAppointment(id)
  if (!appointment) return <AppointmentFallback error={error} onRetry={reload} />

  const labels = getCategoryLabels(appointment)
  const status = STATUS_STYLES[appointment.status]
  const isManageable = canManage(appointment)
  const isVideo = appointment.consultationMode === "video"
  const fee = formatFee(appointment)

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader title={`Your ${labels.short} appointment`} description={`Reference ${getReference(appointment)}`} />

      {justRescheduled && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CircleCheckBig className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden />
          <span>Your appointment has been moved to the new time below.</span>
        </div>
      )}

      <span className={cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[15px] font-semibold", status.className)}>
        {appointment.status === "confirmed" && <CircleCheck className="w-4 h-4 fill-emerald-600 text-white" aria-hidden />}
        {status.label}
      </span>

      <div className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-[#DDF2E4] bg-[#F1F9F4] p-4">
        <Avatar name={appointment.providerName} size="lg" />
        <div className="min-w-0">
          <p className="text-base sm:text-lg font-semibold text-slate-900 truncate">{appointment.providerName || "Clinician to be confirmed"}</p>
          <p className="text-sm sm:text-[15px] text-slate-500">{labels.clinician}</p>
        </div>
      </div>

      <dl className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100">
        <DetailRow icon={Monitor} label="Service">
          {appointment.serviceName || labels.clinician}
        </DetailRow>
        <DetailRow icon={Calendar} label="Date">
          {appointment.startsAt ? formatFullDate(appointment.startsAt) : "To be confirmed"}
        </DetailRow>
        <DetailRow icon={Clock} label="Time">
          {appointment.startsAt ? `${formatTime(appointment.startsAt)} • UK time` : "To be confirmed"}
        </DetailRow>
        <DetailRow icon={isVideo ? Video : MapPin} label={appointment.consultationMode === "in_person" ? "Location" : "Appointment"}>
          {appointment.consultationMode === "in_person" ? getLocationLabel(appointment) : MODE_LABELS[appointment.consultationMode].detail}
        </DetailRow>
        {fee && (
          <DetailRow icon={CreditCard} label="Fee">
            {fee}
            {appointment.paymentStatus && (
              <>
                {" • "}
                <span className={appointment.paymentStatus === "paid" ? "text-emerald-600" : "text-slate-500"}>{appointment.paymentStatus}</span>
              </>
            )}
          </DetailRow>
        )}
      </dl>

      {isManageable ? (
        <div className="space-y-3 pt-2">
          {isVideo && (
            <Link href={appointmentPath(appointment.id, "waiting-room")} className={actionButtonClass("primary")}>
              <ActionButtonContent icon={Video}>Join waiting room</ActionButtonContent>
            </Link>
          )}
          <Link href={appointmentPath(appointment.id, "reschedule")} className={actionButtonClass(isVideo ? "outline" : "primary")}>
            <ActionButtonContent icon={Calendar}>Reschedule appointment</ActionButtonContent>
          </Link>
          <div className="text-center pt-1">
            <Link
              href={appointmentPath(appointment.id, "cancel")}
              className="inline-block rounded-lg px-3 py-2 text-base font-semibold text-red-600 hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Cancel appointment
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <Info className="w-5 h-5 shrink-0 text-slate-400" aria-hidden />
          <span>
            {appointment.status === "cancelled"
              ? "This appointment has been cancelled and can no longer be changed."
              : "This appointment has passed and can no longer be changed."}
          </span>
        </div>
      )}

      <ActionRow
        item={{
          title: `Message your ${labels.team}`,
          description: "Questions about this appointment.",
          href: messageTeamHref(appointment),
          icon: MessageCircle,
          tone: "blue",
        }}
      />

      {!isManageable && (
        <ActionRow
          iconVariant="square"
          item={{ title: "Book another appointment", description: "Find a time that suits you.", href: ROUTES.PORTAL.BOOK, icon: CalendarPlus, tone: "green" }}
        />
      )}
    </PageContainer>
  )
}
