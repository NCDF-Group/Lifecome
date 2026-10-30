"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { useAppointment } from "@/hooks/useAppointments"
import { ROUTES } from "@/lib/constants"
import { PageContainer, PageHeader } from "../ui"
import { AppointmentFallback, StatusBadge, SummaryList, actionButtonClass, appointmentPath, getAppointmentRows } from "./shared"

export function AppointmentBooked({ id }: { id: string }) {
  const router = useRouter()
  const { data: appointment, error, reload } = useAppointment(id)
  const isConfirmed = appointment?.status === "confirmed"

  // A booking that's still awaiting confirmation can't say "You're booked in", so it goes to its own page
  useEffect(() => {
    if (appointment && !isConfirmed) router.replace(appointmentPath(id))
  }, [appointment, isConfirmed, id, router])

  if (!appointment || !isConfirmed) return <AppointmentFallback error={error} onRetry={reload} />

  return (
    <PageContainer wide className="space-y-5 sm:space-y-5">
      <span aria-hidden className="mx-auto w-[88px] h-[88px] rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
        <Check className="w-10 h-10" />
      </span>
      <PageHeader title="You're booked in" description="Your appointment has been added to Visits." />
      <section aria-label="Appointment details" className="space-y-2">
        <StatusBadge status={appointment.status} />
        <SummaryList rows={getAppointmentRows(appointment)} />
      </section>
      <div className="space-y-3">
        <Link href={appointmentPath(id)} className={actionButtonClass("primary", "justify-center")}>
          View appointment
        </Link>
        <Link href={ROUTES.PORTAL.DASHBOARD} className={actionButtonClass("outline", "justify-center border-blue-200")}>
          Return home
        </Link>
      </div>
    </PageContainer>
  )
}
