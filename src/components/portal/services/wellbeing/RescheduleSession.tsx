"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarCheck, CalendarDays, CalendarPlus, CalendarX, Clock, Info } from "lucide-react"
import { ActionButtonContent, AppointmentFallback, actionButtonClass } from "@/components/portal/appointments/shared"
import { EmptyState, ErrorState, IconBadge, LoadingCards, PageContainer, PageHeader, TONES, type Tone } from "@/components/portal/ui"
import { useAvailability } from "@/hooks/useAppointments"
import { saveSampleSession, useWellbeingSession } from "@/hooks/useWellbeingSession"
import { getApiErrorMessage } from "@/lib/api-client"
import { canManage, formatShortDate, formatTime, groupOpenSlots } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import { getSampleSlots, wellbeingSessionPath } from "@/lib/wellbeing"
import { appointmentService } from "@/services/appointment.service"
import { SampleSessionNotice } from "./SampleSessionNotice"

function StepCard({
  icon,
  tone,
  title,
  description,
  children,
}: {
  icon: typeof CalendarDays
  tone: Tone
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("border rounded-2xl p-4", TONES[tone].card)}>
      <div className="flex items-center gap-3 sm:gap-3.5">
        <IconBadge icon={icon} tone={tone} className="sm:w-11 sm:h-11" />
        <div className="min-w-0">
          <p className="text-base sm:text-[17px] font-semibold text-slate-900 leading-snug">{title}</p>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-snug">{description}</p>
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function RescheduleSession({ id }: { id: string }) {
  const router = useRouter()
  const { session, error, reload, isSample } = useWellbeingSession(id)
  const availability = useAvailability(session && !isSample && canManage(session) ? session.providerId : null)
  const [sampleSlots] = useState(getSampleSlots)
  const [chosenDay, setChosenDay] = useState<string | null>(null)
  const [chosenSlotId, setChosenSlotId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const slots = isSample ? sampleSlots : availability.data
  const days = useMemo(() => (slots && session ? groupOpenSlots(slots, session.availabilitySlotId) : []), [slots, session])

  if (!session) return <AppointmentFallback error={error} onRetry={reload} />

  const backToSession = wellbeingSessionPath(id)

  if (!canManage(session)) {
    return (
      <PageContainer>
        <PageHeader title="Reschedule wellbeing session" />
        <EmptyState
          icon={CalendarX}
          title="This session can't be rescheduled"
          description="It has already taken place or been cancelled."
          action={
            <Link href={backToSession} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View session
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
      if (isSample) saveSampleSession({ ...session, startsAt: chosenSlot.startsAt, availabilitySlotId: chosenSlot.id })
      else await appointmentService.rescheduleAppointment(session.id, chosenSlot.id)
      router.push(`${backToSession}?updated=rescheduled`)
    } catch (cause) {
      setSubmitError(getApiErrorMessage(cause, "We couldn't move your session. Please choose another time."))
      setIsSubmitting(false)
      availability.reload()
    }
  }

  return (
    <PageContainer className="space-y-3 sm:space-y-3">
      <PageHeader title="Reschedule wellbeing session" description="Choose a new date and time that works for you." />

      {isSample && <SampleSessionNotice />}

      {session.startsAt && (
        <StepCard
          icon={CalendarDays}
          tone="blue"
          title="Current session"
          description={`${formatShortDate(session.startsAt)}, ${formatTime(session.startsAt)}`}
        >
          <p className="flex items-start gap-2 rounded-lg bg-blue-100/60 px-3 py-2 text-sm text-slate-700">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#0062F5]" aria-hidden />
            Your current session stays until a change is confirmed.
          </p>
        </StepCard>
      )}

      {!isSample && availability.isLoading && <LoadingCards count={2} label="Loading available times" />}
      {!isSample && availability.error && <ErrorState message={availability.error} onRetry={availability.reload} />}

      {slots && days.length === 0 && (
        <EmptyState
          icon={CalendarX}
          title="No other times available"
          description="There are no open times with this practitioner right now. Please check again later or message your care team."
        />
      )}

      {activeDay && (
        <>
          <StepCard icon={CalendarDays} tone="green" title="Select date" description="Choose a new date for your session.">
            <div className="relative">
              <select
                aria-label="Select date"
                value={activeDay.key}
                onChange={(event) => {
                  setChosenDay(event.target.value)
                  setChosenSlotId(null)
                }}
                className="w-full min-h-[52px] appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-11 text-[15px] sm:text-base font-semibold text-slate-900 cursor-pointer focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
              >
                {days.map((day) => (
                  <option key={day.key} value={day.key}>
                    {formatShortDate(day.slots[0].startsAt)}
                  </option>
                ))}
              </select>
              <CalendarDays className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" aria-hidden />
            </div>
          </StepCard>

          <StepCard icon={Clock} tone="blue" title="Select time" description="Choose an available time.">
            <fieldset>
              <legend className="sr-only">Available times, UK time</legend>
              <div className="grid grid-cols-3 gap-2">
                {activeDay.slots.map((slot) => {
                  const selected = slot.id === chosenSlot?.id
                  return (
                    <label key={slot.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="reschedule-session-time"
                        value={slot.id}
                        checked={selected}
                        onChange={() => setChosenSlotId(slot.id)}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-xl border py-3.5 text-[15px] sm:text-base font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2",
                          selected ? "bg-[#0062F5] border-[#0062F5] text-white shadow-sm shadow-blue-600/20" : "bg-white border-slate-200 text-slate-900 hover:border-blue-200"
                        )}
                      >
                        {formatTime(slot.startsAt)}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </StepCard>

          {chosenSlot && (
            <div aria-live="polite">
              <StepCard
                icon={CalendarCheck}
                tone="green"
                title="New session"
                description={`${formatShortDate(chosenSlot.startsAt)}, ${formatTime(chosenSlot.startsAt)} UK time`}
              />
            </div>
          )}

          {submitError && <ErrorState message={submitError} />}
        </>
      )}

      <div className="space-y-2.5 pt-2">
        {activeDay && (
          <button type="button" onClick={handleConfirm} disabled={!chosenSlot || isSubmitting} className={actionButtonClass("primary")}>
            <ActionButtonContent icon={CalendarPlus} align="start">
              {isSubmitting ? "Confirming…" : chosenSlot ? "Confirm new time" : "Choose a time to continue"}
            </ActionButtonContent>
          </button>
        )}
        <Link href={backToSession} className={actionButtonClass("soft", "text-[#0062F5]")}>
          <ActionButtonContent icon={Clock} align="start">
            Keep current time
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
