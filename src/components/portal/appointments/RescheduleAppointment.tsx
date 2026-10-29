"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, CalendarX } from "lucide-react"
import { useAppointment, useAvailability } from "@/hooks/useAppointments"
import { getApiErrorMessage } from "@/lib/api-client"
import { canManage, formatDateTile, formatShortDateTime, formatTime, toUkDayKey } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import { appointmentService, type AvailabilitySlot } from "@/services/appointment.service"
import { EmptyState, ErrorState, LoadingCards, PageContainer, PageHeader } from "../ui"
import { ActionButtonContent, AppointmentFallback, actionButtonClass, appointmentPath } from "./shared"

const MAX_DAYS = 10

interface DayOption {
  key: string
  slots: AvailabilitySlot[]
}

/** Open slots grouped by UK calendar day, soonest first. */
function groupOpenSlots(slots: AvailabilitySlot[], currentSlotId: string): DayOption[] {
  const now = Date.now()
  const open = slots
    .filter(
      (slot) =>
        !slot.isBooked &&
        slot.id !== currentSlotId &&
        new Date(slot.startsAt).getTime() > now &&
        (!slot.heldUntil || new Date(slot.heldUntil).getTime() < now)
    )
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  const days = new Map<string, AvailabilitySlot[]>()
  for (const slot of open) {
    const key = toUkDayKey(slot.startsAt)
    days.set(key, [...(days.get(key) ?? []), slot])
  }
  return [...days.entries()].slice(0, MAX_DAYS).map(([key, daySlots]) => ({ key, slots: daySlots }))
}

function SummaryCard({ tone, title, when, note }: { tone: "green" | "blue"; title: string; when: string; note: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 sm:gap-4 rounded-2xl border p-4 sm:p-5",
        tone === "green" ? "border-[#DDF2E4] bg-[#F1F9F4]" : "border-[#DCE8FB] bg-[#F0F6FF]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
          tone === "green" ? "bg-emerald-100/80 text-emerald-700" : "bg-blue-100/80 text-[#0062F5]"
        )}
      >
        <CalendarDays className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-slate-900">{title}</p>
        <p className="text-[15px] font-semibold text-slate-900">{when}</p>
        <p className="mt-0.5 text-sm text-slate-500">{note}</p>
      </div>
    </div>
  )
}

export function RescheduleAppointment({ id }: { id: string }) {
  const router = useRouter()
  const { data: appointment, error, reload } = useAppointment(id)
  const availability = useAvailability(appointment && canManage(appointment) ? appointment.providerId : null)
  const [chosenDay, setChosenDay] = useState<string | null>(null)
  const [chosenSlotId, setChosenSlotId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const days = useMemo(
    () => (availability.data && appointment ? groupOpenSlots(availability.data, appointment.availabilitySlotId) : []),
    [availability.data, appointment]
  )

  if (!appointment) return <AppointmentFallback error={error} onRetry={reload} />

  if (!canManage(appointment)) {
    return (
      <PageContainer>
        <PageHeader title="Reschedule appointment" />
        <EmptyState
          icon={CalendarX}
          title="This appointment can't be rescheduled"
          description="It has already taken place or been cancelled."
          action={
            <Link href={appointmentPath(id)} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View appointment
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const activeDay = days.find((day) => day.key === chosenDay) ?? days[0]
  const chosenSlot = activeDay?.slots.find((slot) => slot.id === chosenSlotId) ?? null

  const handleConfirm = async () => {
    if (!chosenSlot) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await appointmentService.rescheduleAppointment(appointment.id, chosenSlot.id)
      router.push(`${appointmentPath(appointment.id)}?updated=rescheduled`)
    } catch (cause) {
      setSubmitError(getApiErrorMessage(cause, "We couldn't move your appointment. Please choose another time."))
      setIsSubmitting(false)
      availability.reload()
    }
  }

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PageHeader title="Reschedule appointment" description="Find a new time for your appointment." />

      {appointment.startsAt && (
        <SummaryCard
          tone="green"
          title="Current appointment"
          when={formatShortDateTime(appointment.startsAt)}
          note="Your existing appointment stays in place until you confirm a new time."
        />
      )}

      {availability.isLoading && <LoadingCards count={2} label="Loading available times" />}
      {availability.error && <ErrorState message={availability.error} onRetry={availability.reload} />}

      {availability.data && days.length === 0 && (
        <EmptyState
          icon={CalendarX}
          title="No other times available"
          description="There are no open times with this clinician right now. Please check again later or message your care team."
        />
      )}

      {activeDay && (
        <>
          <fieldset className="space-y-3">
            <legend className="mb-3 text-lg sm:text-xl font-bold text-slate-900">Choose a date</legend>
            <div className="flex gap-2 overflow-x-auto snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-5 sm:overflow-visible">
              {days.map((day) => {
                const tile = formatDateTile(day.slots[0].startsAt)
                const selected = day.key === activeDay.key
                return (
                  <label key={day.key} className="snap-start shrink-0 w-[84px] sm:w-auto cursor-pointer">
                    <input
                      type="radio"
                      name="reschedule-day"
                      value={day.key}
                      checked={selected}
                      onChange={() => {
                        setChosenDay(day.key)
                        setChosenSlotId(null)
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border py-4 sm:py-6 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2",
                        selected ? "bg-[#0062F5] border-[#0062F5] text-white shadow-sm shadow-blue-600/20" : "bg-slate-50/60 border-slate-200 text-slate-900 hover:border-blue-200"
                      )}
                    >
                      <span className={cn("text-sm", selected ? "text-white/90" : "text-slate-600")}>{tile.weekday}</span>
                      <span className="text-2xl font-bold leading-tight">{tile.day}</span>
                      <span className={cn("text-sm", selected ? "text-white/90" : "text-slate-500")}>{tile.month}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-lg sm:text-xl font-bold text-slate-900">
              Available times <span className="text-sm sm:text-base font-normal text-slate-500">· UK time</span>
            </legend>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {activeDay.slots.map((slot) => {
                const selected = slot.id === chosenSlot?.id
                return (
                  <label key={slot.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="reschedule-time"
                      value={slot.id}
                      checked={selected}
                      onChange={() => setChosenSlotId(slot.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-xl py-3.5 text-base font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2",
                        selected ? "bg-[#0062F5] text-white shadow-sm shadow-blue-600/20" : "bg-[#EAF2FF] text-[#0062F5] hover:bg-blue-100"
                      )}
                    >
                      {formatTime(slot.startsAt)}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {chosenSlot && (
            <div aria-live="polite">
              <SummaryCard tone="blue" title="New time" when={formatShortDateTime(chosenSlot.startsAt)} note="UK time" />
            </div>
          )}

          {submitError && <ErrorState message={submitError} />}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!chosenSlot || isSubmitting}
              className={actionButtonClass("primary")}
            >
              <ActionButtonContent align="inline">{isSubmitting ? "Confirming…" : chosenSlot ? "Confirm new time" : "Choose a time to continue"}</ActionButtonContent>
            </button>
          </div>
        </>
      )}
    </PageContainer>
  )
}
