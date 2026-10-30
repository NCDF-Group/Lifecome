"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarX, ChevronRight, Info, UserRoundX } from "lucide-react"
import { SummaryList, actionButtonClass, appointmentPath } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { Avatar, EmptyState, ErrorState, FOCUS_RING, LoadingCards } from "@/components/portal/ui"
import { useAvailability, useClinicalServices, useOnlineProviders } from "@/hooks/useAppointments"
import { getApiErrorMessage, type ApiError } from "@/lib/api-client"
import { MODE_LABELS, formatDateTile, formatFee, formatLongDate, formatTime, groupOpenSlots, toUkDayKey } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { appointmentService, type AvailabilitySlot, type ClinicalService, type CreateAppointmentInput } from "@/services/appointment.service"
import type { Doctor } from "@/types"
import { CheckboxField, FIELD, FIELD_LABEL, RadioCard, SelectField, StepLayout, optionState } from "./shared"

const BOOKING_PATH = ROUTES.PORTAL.BOOK_ONLINE_GP
const stepPath = (step: number) => `${BOOKING_PATH}?step=${step}`

const COUNTRY_UK = "United Kingdom"
const PAYMENT_ROUTE = "Pay as you go"
// The consultation fee from the design, matching the backend's catalogue
const CONSULTATION_FEE = formatFee({ feeMinor: 6500, currency: "GBP" })
const CONTINUE_BUTTON = actionButtonClass("primary", "justify-center")
const OUTLINE_BUTTON = actionButtonClass("outline", "justify-center border-blue-200")
const TEXT_LINK = cn("inline-block rounded-lg px-3 py-2 text-sm sm:text-[15px] font-medium text-[#0062F5] hover:underline cursor-pointer", FOCUS_RING)
const TILE_FOCUS = "peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2"

const WHO_OPTIONS = [
  { value: "self", label: "Myself · age 18 or over" },
  { value: "other", label: "Someone else or a child" },
]
const WHERE_OPTIONS = [
  { value: "uk", label: COUNTRY_UK },
  { value: "elsewhere", label: "Somewhere else" },
]
const DURATION_OPTIONS = ["Less than a week", "1 to 4 weeks", "1 to 6 months", "More than 6 months"].map((value) => ({ value, label: value }))

// The catalogue has no separate medication review or menopause service, so those are booked as a
// GP consultation, with the reason going to the clinician in the intake
const REASONS = [
  { id: "general", title: "General consultation", description: "Discuss a health concern", serviceCode: "gp-consultation", specialty: "General Practitioner", category: "gp" },
  { id: "medication", title: "Medication review", description: "Discuss current medication", serviceCode: "gp-consultation", specialty: "General Practitioner", category: "gp" },
  { id: "follow-up", title: "Follow-up appointment", description: "Continue an existing conversation", serviceCode: "follow-up", specialty: "General Practitioner", category: "gp" },
  { id: "menopause", title: "Menopause Care", description: "Support with menopause symptoms", serviceCode: "gp-consultation", specialty: "Women's Health", category: "menopause" },
] as const

type Reason = (typeof REASONS)[number]

interface BookingForm {
  who: string
  where: string
  understood: boolean
  reason: Reason
  provider: Doctor | null
  day: string | null
  slot: AvailabilitySlot | null
  /** Null until edited, so it can follow whichever reason was chosen. */
  discuss: string | null
  medicines: string
  duration: string
  sharingAgreed: boolean
  termsAgreed: boolean
}

const INITIAL_FORM: BookingForm = {
  who: "self",
  where: "uk",
  understood: false,
  reason: REASONS[0],
  provider: null,
  day: null,
  slot: null,
  discuss: null,
  medicines: "",
  duration: DURATION_OPTIONS[0].value,
  sharingAgreed: false,
  termsAgreed: false,
}

const PAYMENT_STEP = 7

const getDiscussion = (form: BookingForm) => form.discuss ?? form.reason.title
const canPassEligibility = (form: BookingForm) => form.who === "self" && form.where === "uk" && form.understood

/** A step can only be opened once the ones before it are complete, e.g. after a refresh clears the form. */
function getFurthestStep(form: BookingForm) {
  if (!canPassEligibility(form)) return 1
  if (!form.provider) return 3
  if (!form.slot) return 4
  if (!getDiscussion(form).trim() || !form.sharingAgreed) return 5
  if (!form.termsAgreed) return 6
  return PAYMENT_STEP
}

interface StepProps {
  form: BookingForm
  update: (changes: Partial<BookingForm>) => void
  goTo: (step: number) => void
}

function BeforeYouBook({ form, update, goTo }: StepProps) {
  return (
    <StepLayout step={1} backHref={ROUTES.PORTAL.BOOK} title="Before you book" description="A few details to guide you to the right appointment.">
      <SelectField id="booking-who" label="Who is the appointment for?" value={form.who} options={WHO_OPTIONS} onChange={(who) => update({ who })} />
      <SelectField id="booking-where" label="Where will you be?" value={form.where} options={WHERE_OPTIONS} onChange={(where) => update({ where })} />
      <CheckboxField checked={form.understood} onChange={(understood) => update({ understood })}>
        I understand this is a routine appointment and not emergency care.
      </CheckboxField>
      <Notice icon={Info}>
        {form.who !== "self"
          ? "Online GP appointments can only be booked for yourself at the moment."
          : form.where !== "uk"
            ? `Online GP appointments are only available in the ${COUNTRY_UK} at the moment.`
            : `Online GP appointments are for adults in the ${COUNTRY_UK}.`}
      </Notice>
      <button type="button" onClick={() => goTo(2)} disabled={!canPassEligibility(form)} className={CONTINUE_BUTTON}>
        Continue
      </button>
      <div className="text-center">
        <Link href={ROUTES.PORTAL.URGENT_HELP} className={TEXT_LINK}>
          I need urgent help
        </Link>
      </div>
    </StepLayout>
  )
}

function WhatCanWeHelpWith({ form, update, goTo, services, servicesError, reloadServices }: StepProps & { services: ClinicalService[] | null; servicesError: string | null; reloadServices: () => void }) {
  const isUnavailable = services !== null && !services.some((service) => service.code === form.reason.serviceCode && service.isActive)
  return (
    <StepLayout step={2} backHref={stepPath(1)} onBack={() => goTo(1)} title="What can we help with?" description="Choose the closest match. You can tell your GP more before the appointment.">
      <div role="radiogroup" aria-label="What can we help with?" className="space-y-3">
        {REASONS.map((reason) => (
          <RadioCard
            key={reason.id}
            name="booking-reason"
            title={reason.title}
            description={reason.description}
            checked={form.reason.id === reason.id}
            // A different specialty means a different list of clinicians, so any choice made is cleared
            onChange={() => update(reason.specialty === form.reason.specialty ? { reason } : { reason, provider: null, day: null, slot: null })}
          />
        ))}
      </div>
      {servicesError && <ErrorState message={servicesError} onRetry={reloadServices} />}
      {isUnavailable && <Notice icon={Info}>This appointment type can&apos;t be booked online at the moment. Please choose another or message your GP team.</Notice>}
      <button type="button" onClick={() => goTo(3)} disabled={!services || isUnavailable} className={CONTINUE_BUTTON}>
        Continue
      </button>
    </StepLayout>
  )
}

function ChooseGp({ form, update, goTo }: StepProps) {
  const providers = useOnlineProviders(form.reason.specialty)
  const [isFinding, setIsFinding] = useState(false)
  const [findError, setFindError] = useState<string | null>(null)

  const choose = (provider: Doctor) => {
    // Times belong to one clinician, so a time chosen with someone else can't carry over
    update(provider.id === form.provider?.id ? {} : { provider, day: null, slot: null })
    goTo(4)
  }

  const chooseFirstAvailable = async () => {
    setFindError(null)
    setIsFinding(true)
    try {
      const options = await Promise.all(
        (providers.data ?? []).map(async (provider) => {
          const [firstDay] = groupOpenSlots(await appointmentService.getAvailability(provider.id), "")
          return { provider, slot: firstDay?.slots[0] }
        })
      )
      const first = options
        .filter((option): option is { provider: Doctor; slot: AvailabilitySlot } => Boolean(option.slot))
        .sort((a, b) => new Date(a.slot.startsAt).getTime() - new Date(b.slot.startsAt).getTime())[0]
      if (!first) {
        setFindError("There are no online appointments available right now. Please check again later.")
        setIsFinding(false)
        return
      }
      update({ provider: first.provider, slot: first.slot, day: toUkDayKey(first.slot.startsAt) })
      goTo(4)
    } catch (cause) {
      setFindError(getApiErrorMessage(cause, "We couldn't find the first available time. Please try again."))
      setIsFinding(false)
    }
  }

  return (
    <StepLayout step={3} backHref={stepPath(2)} onBack={() => goTo(2)} title="Choose your GP" description="Find the right person for your appointment.">
      {providers.isLoading && <LoadingCards label="Loading clinicians" />}
      {providers.error && <ErrorState message={providers.error} onRetry={providers.reload} />}
      {providers.data?.length === 0 && (
        <EmptyState icon={UserRoundX} title="No clinicians available" description="There are no clinicians offering online appointments for this right now. Please check again later." />
      )}
      {providers.data && providers.data.length > 0 && (
        <>
          <ul>
            {providers.data.map((provider) => (
              <li key={provider.id}>
                <button type="button" onClick={() => choose(provider)} className={cn("group w-full flex items-center gap-3 sm:gap-4 rounded-2xl text-left cursor-pointer", FOCUS_RING)}>
                  <Avatar name={provider.displayName} tone="blue" className="w-[60px] h-[60px] text-xl underline" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-base sm:text-[17px] font-semibold text-[#0062F5] leading-snug underline">{provider.displayName}</span>
                    <span className="block text-sm sm:text-[15px] text-slate-500 leading-snug mt-1 underline">
                      {provider.specialty} · {provider.consultationModes.includes("in_person") ? "online and in-clinic" : "online"}
                    </span>
                  </span>
                  <ChevronRight className="w-6 h-6 shrink-0 text-[#0062F5] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {findError && <ErrorState message={findError} />}
          <button type="button" onClick={chooseFirstAvailable} disabled={isFinding} className={OUTLINE_BUTTON}>
            {isFinding ? "Finding a time…" : "Choose first available"}
          </button>
        </>
      )}
    </StepLayout>
  )
}

function ChooseTime({ form, update, goTo, slotError }: StepProps & { slotError: string | null }) {
  const availability = useAvailability(form.provider?.id ?? null)
  const days = useMemo(() => (availability.data ? groupOpenSlots(availability.data, "") : []), [availability.data])
  const activeDay = days.find((day) => day.key === form.day) ?? days[0]

  return (
    <StepLayout step={4} backHref={stepPath(3)} onBack={() => goTo(3)} title="Choose your time" description={`${form.provider?.displayName} · Online GP`}>
      {slotError && <ErrorState message={slotError} />}
      {availability.isLoading && <LoadingCards label="Loading available times" />}
      {availability.error && <ErrorState message={availability.error} onRetry={availability.reload} />}
      {availability.data && days.length === 0 && (
        <EmptyState icon={CalendarX} title="No times available" description="This clinician has no open times right now. Please go back and choose someone else." />
      )}
      {activeDay && (
        <>
          <fieldset>
            <legend className={FIELD_LABEL}>Choose a date</legend>
            <div className="grid grid-cols-4 gap-2.5">
              {days.map((day) => {
                const tile = formatDateTile(day.slots[0].startsAt)
                const selected = day.key === activeDay.key
                return (
                  <label key={day.key} className="cursor-pointer">
                    <input type="radio" name="booking-day" value={day.key} checked={selected} onChange={() => update({ day: day.key, slot: null })} className="peer sr-only" />
                    <span className={cn("flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-colors", TILE_FOCUS, optionState(selected))}>
                      <span className="text-sm">{tile.weekday}</span>
                      <span className="text-[28px] font-bold leading-none">{tile.day}</span>
                      <span className="text-sm">{tile.month}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className={FIELD_LABEL}>Available times · UK time</legend>
            <div className="grid grid-cols-3 gap-2.5">
              {activeDay.slots.map((slot) => {
                const selected = slot.id === form.slot?.id
                return (
                  <label key={slot.id} className="cursor-pointer">
                    <input type="radio" name="booking-time" value={slot.id} checked={selected} onChange={() => update({ day: activeDay.key, slot })} className="peer sr-only" />
                    <span className={cn("flex items-center justify-center rounded-xl border py-3 text-sm sm:text-[15px] transition-colors", TILE_FOCUS, optionState(selected))}>
                      {formatTime(slot.startsAt)}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <button type="button" onClick={() => goTo(5)} disabled={!form.slot} className={CONTINUE_BUTTON}>
            {form.slot ? "Continue" : "Choose a time to continue"}
          </button>
        </>
      )}
    </StepLayout>
  )
}

function HelpYourGpPrepare({ form, update, goTo }: StepProps) {
  const discussion = getDiscussion(form)
  return (
    <StepLayout step={5} backHref={stepPath(4)} onBack={() => goTo(4)} title="Help your GP prepare" description="This helps your GP get ready for your appointment.">
      <div>
        <label htmlFor="booking-discuss" className={FIELD_LABEL}>
          What would you like to discuss?
        </label>
        <textarea id="booking-discuss" rows={4} maxLength={1500} value={discussion} onChange={(event) => update({ discuss: event.target.value })} className={cn(FIELD, "py-3 resize-y")} />
      </div>
      <div>
        <label htmlFor="booking-medicines" className={FIELD_LABEL}>
          Current medication or allergies (optional)
        </label>
        <textarea id="booking-medicines" rows={4} maxLength={2000} value={form.medicines} onChange={(event) => update({ medicines: event.target.value })} className={cn(FIELD, "py-3 resize-y")} />
      </div>
      <SelectField id="booking-duration" label="How long has this been a concern?" value={form.duration} options={DURATION_OPTIONS} onChange={(duration) => update({ duration })} />
      <CheckboxField checked={form.sharingAgreed} onChange={(sharingAgreed) => update({ sharingAgreed })}>
        I agree to share this information with the care team for this appointment.
      </CheckboxField>
      <button type="button" onClick={() => goTo(6)} disabled={!discussion.trim() || !form.sharingAgreed} className={CONTINUE_BUTTON}>
        Continue
      </button>
    </StepLayout>
  )
}

function ReviewAppointment({ form, update, goTo, service }: StepProps & { service: ClinicalService | undefined }) {
  const startsAt = form.slot?.startsAt ?? ""
  const rows = [
    { label: "Service", value: "Online GP" },
    { label: "Clinician", value: form.provider?.displayName },
    { label: "Date", value: formatLongDate(startsAt) },
    { label: "Time", value: `${formatTime(startsAt)} · UK time` },
    { label: "Location", value: MODE_LABELS.video.location },
  ]

  return (
    <StepLayout step={6} backHref={stepPath(5)} onBack={() => goTo(5)} title="Review your appointment" description="Check the details and choose how to pay.">
      <SummaryList rows={rows} />
      <RadioCard name="booking-payment" title={PAYMENT_ROUTE} description={`${CONSULTATION_FEE}`} checked onChange={() => {}} />
      <Notice icon={Info}>Self-pay consultation: {CONSULTATION_FEE}. Online payment isn&apos;t available yet, so you won&apos;t be charged for this booking.</Notice>
      <CheckboxField checked={form.termsAgreed} onChange={(termsAgreed) => update({ termsAgreed })}>
        I have reviewed the appointment details and{" "}
        <Link href={ROUTES.PORTAL.CANCELLATION_TERMS} className="font-semibold text-[#0062F5] hover:underline">
          cancellation terms
        </Link>
        .
      </CheckboxField>
      <button type="button" onClick={() => goTo(PAYMENT_STEP)} disabled={!form.termsAgreed || !service} className={CONTINUE_BUTTON}>
        Continue
      </button>
      <div className="text-center">
        <Link href={`${ROUTES.PORTAL.PROFILE}/membership/insurance`} className={TEXT_LINK}>
          Check insurance cover
        </Link>
      </div>
    </StepLayout>
  )
}

function CompleteBooking({ goTo, service, onBook, isBooking, bookError }: StepProps & { service: ClinicalService | undefined; onBook: () => void; isBooking: boolean; bookError: string | null }) {
  return (
    <StepLayout backHref={stepPath(6)} onBack={() => goTo(6)} title="Complete your booking" description="Review your payment before confirming.">
      <SummaryList
        rows={[
          { label: "Consultation", value: CONSULTATION_FEE },
          { label: "Payment route", value: PAYMENT_ROUTE },
          { label: "Total", value: CONSULTATION_FEE },
        ]}
      />
      <Notice icon={Info}>No payment is taken today, because online payment isn&apos;t available yet.</Notice>
      {bookError && <ErrorState message={bookError} />}
      <button type="button" onClick={onBook} disabled={!service || isBooking} className={CONTINUE_BUTTON}>
        {isBooking ? "Booking…" : "Confirm booking"}
      </button>
    </StepLayout>
  )
}

export function OnlineGpBooking() {
  const router = useRouter()
  const requestedStep = Number(useSearchParams().get("step")) || 1
  const services = useClinicalServices()
  const [form, setForm] = useState(INITIAL_FORM)
  const [isBooking, setIsBooking] = useState(false)
  const [bookError, setBookError] = useState<string | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)

  const update = (changes: Partial<BookingForm>) => setForm((current) => ({ ...current, ...changes }))
  // Steps change in the browser, as a failed trip to the server would reload the page and lose the form
  const goTo = (step: number) => {
    setBookError(null)
    setSlotError(null)
    window.history.pushState(null, "", stepPath(step))
    window.scrollTo(0, 0)
  }

  const step = Math.min(requestedStep, getFurthestStep(form))
  const service = services.data?.find((option) => option.code === form.reason.serviceCode)
  const stepProps = { form, update, goTo }

  // Brings the URL back to the step shown, or finishing that step would skip ahead to the old one
  useEffect(() => {
    if (requestedStep > step) window.history.replaceState(null, "", stepPath(step))
  }, [requestedStep, step])

  const handleBook = async () => {
    if (!service || !form.provider || !form.slot) return
    setBookError(null)
    setIsBooking(true)
    const discussion = getDiscussion(form).trim()
    const input: CreateAppointmentInput = {
      providerId: form.provider.id,
      clinicalServiceId: service.id,
      availabilitySlotId: form.slot.id,
      consultationMode: "video",
      presentingConcern: discussion,
      fundingRoute: "pay_per_visit",
      serviceCategory: form.reason.category,
      intake: {
        reason: `${form.reason.title}: ${discussion}\nHow long: ${form.duration}`,
        medicinesAndAllergies: form.medicines.trim() || undefined,
        patientLocation: COUNTRY_UK,
        understoodRemoteLimits: form.understood,
      },
    }

    let appointmentId: string
    try {
      appointmentId = (await appointmentService.bookAppointment(input)).id
    } catch (cause) {
      const message = getApiErrorMessage(cause, "We couldn't book this appointment. Please try again.")
      if ((cause as ApiError).code === "SLOT_UNAVAILABLE") {
        // Taken while the patient was on this page, so they go back to choose a time that's still open
        setSlotError(message)
        update({ slot: null })
      } else {
        setBookError(message)
      }
      setIsBooking(false)
      return
    }

    // The API refuses this until a booking can be confirmed without payment. The booking is still
    // made, and the next page sends it on to show it as awaiting confirmation.
    await appointmentService.confirmAppointment(appointmentId).catch(() => undefined)
    router.push(appointmentPath(appointmentId, "booked"))
  }

  switch (step) {
    case 2:
      return <WhatCanWeHelpWith {...stepProps} services={services.data} servicesError={services.error} reloadServices={services.reload} />
    case 3:
      return <ChooseGp {...stepProps} />
    case 4:
      return <ChooseTime {...stepProps} slotError={slotError} />
    case 5:
      return <HelpYourGpPrepare {...stepProps} />
    case 6:
      return <ReviewAppointment {...stepProps} service={service} />
    case PAYMENT_STEP:
      return <CompleteBooking {...stepProps} service={service} onBook={handleBook} isBooking={isBooking} bookError={bookError} />
    default:
      return <BeforeYouBook {...stepProps} />
  }
}
