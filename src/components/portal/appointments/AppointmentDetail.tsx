"use client"

import React from "react"
import Link from "next/link"
import { CalendarPlus, CircleCheckBig, Info, MessageSquareText } from "lucide-react"
import { useAppointment } from "@/hooks/useAppointments"
import { canManage, getCategoryLabels, getReference } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import type { Appointment } from "@/types"
import { ServiceRow } from "../services/shared"
import { PageContainer, PageHeader } from "../ui"
import { AppointmentFallback, StatusBadge, SummaryList, actionButtonClass, appointmentPath, getAppointmentRows } from "./shared"

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
  const isManageable = canManage(appointment)
  const isVideo = appointment.consultationMode === "video"

  return (
    <PageContainer wide className="space-y-4 sm:space-y-4">
      <PageHeader title={`Your ${labels.short} appointment`} description={`Reference ${getReference(appointment)}`} />

      {justRescheduled && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CircleCheckBig className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden />
          <span>Your appointment has been moved to the new time below.</span>
        </div>
      )}

      <section aria-label="Appointment details" className="space-y-2">
        <StatusBadge status={appointment.status} />
        <SummaryList rows={getAppointmentRows(appointment)} />
      </section>

      {isManageable ? (
        <div className="space-y-3">
          {isVideo && (
            <Link href={appointmentPath(appointment.id, "waiting-room")} className={actionButtonClass("primary", "justify-center")}>
              Join waiting room
            </Link>
          )}
          <Link href={appointmentPath(appointment.id, "reschedule")} className={actionButtonClass(isVideo ? "outline" : "primary", "justify-center border-blue-200")}>
            Reschedule
          </Link>
          <div className="text-center">
            <Link
              href={appointmentPath(appointment.id, "cancel")}
              className="inline-block rounded-lg px-3 py-2 text-sm sm:text-[15px] font-medium text-[#0062F5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5]"
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

      <ServiceRow
        size="home"
        item={{
          title: "Message your care team",
          description: "Questions about this appointment",
          href: messageTeamHref(appointment),
          icon: MessageSquareText,
          tone: "blue",
        }}
      />

      {!isManageable && (
        <ServiceRow size="home" item={{ title: "Book another appointment", description: "Find a time that suits you", href: ROUTES.PORTAL.BOOK, icon: CalendarPlus, tone: "green" }} />
      )}
    </PageContainer>
  )
}
