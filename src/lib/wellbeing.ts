import { Apple, Flower2, Leaf } from "lucide-react"
import type { AvailabilitySlot } from "@/services/appointment.service"
import type { Appointment } from "@/types"
import { formatFee, formatTime, toUkDayKey } from "./appointments"
import { ROUTES } from "./constants"

// This flow runs on the sample data from the design. appointmentService already has
// providers, clinical services, availability and booking; what's missing is how wellbeing
// maps onto those records, and a payment gateway behind the API's `/payments/intents`.
const SESSION = { format: "Online", length: "30 minutes" }
const SESSION_MINUTES = 30

const sampleFee = (feeMinor: number) => ({ feeMinor, sampleFee: formatFee({ feeMinor, currency: "GBP" }) ?? "" })

export const WELLBEING_SERVICES = {
  "lifestyle-coaching": { title: "Lifestyle coaching", icon: Leaf, ...sampleFee(4500), ...SESSION },
  "healthy-eating": { title: "Healthy eating support", icon: Apple, ...sampleFee(4500), ...SESSION },
  "stress-relaxation": { title: "Stress & relaxation", icon: Flower2, ...sampleFee(3500), ...SESSION },
}

export type WellbeingServiceId = keyof typeof WELLBEING_SERVICES

export const isWellbeingService = (value: string): value is WellbeingServiceId => Object.hasOwn(WELLBEING_SERVICES, value)

export const SAMPLE_PRACTITIONER = {
  name: "Jordan Ellis",
  role: "Wellbeing practitioner",
  about: "Helping you explore everyday routines and personal goals.",
  language: "English",
}

export const SAMPLE_PAYMENT_CARD = "Card ending 4242"

export const WELLBEING_PLAN_PATH = `${ROUTES.PORTAL.WELLBEING}/plan`
export const WELLBEING_CHECK_IN_PATH = `${WELLBEING_PLAN_PATH}/check-in`
export const WELLBEING_MESSAGE_PATH = `${ROUTES.PORTAL.NEW_MESSAGE}?team=wellbeing&topic=wellbeing_coaching`

export const SAMPLE_PLAN = {
  goal: "Build a realistic routine that fits my week.",
  goalNote: "Small, achievable steps can make a big difference to your wellbeing.",
}

export const SAMPLE_SESSION_TIMES = ["10:00", "12:00", "14:00", "16:00"]

const SESSION_DAY_COUNT = 4

// Midday UTC is always the same calendar day in UK time
export const dayKeyToIso = (dayKey: string) => `${dayKey}T12:00:00Z`

/** The next four weekdays after `from`, as UK day keys. */
export function getSampleSessionDays(from = new Date()) {
  const days: string[] = []
  const cursor = new Date(dayKeyToIso(toUkDayKey(from.toISOString())))
  while (days.length < SESSION_DAY_COUNT) {
    cursor.setUTCDate(cursor.getUTCDate() + 1)
    const weekday = cursor.getUTCDay()
    if (weekday !== 0 && weekday !== 6) days.push(cursor.toISOString().slice(0, 10))
  }
  return days
}

// Nested so the portal's Back link walks back through the booking one step at a time
const STEP_PATHS = {
  practitioner: "/practitioner",
  session: "/practitioner/session",
  review: "/practitioner/session/review",
}

export const wellbeingPath = (service: WellbeingServiceId, step?: keyof typeof STEP_PATHS) =>
  `${ROUTES.PORTAL.WELLBEING}/${service}${step ? STEP_PATHS[step] : ""}`

export const wellbeingSessionPath = (id: string, step?: "confirmed" | "reschedule" | "cancel" | "join") =>
  `${ROUTES.PORTAL.WELLBEING}/sessions/${encodeURIComponent(id)}${step ? `/${step}` : ""}`

/** Stands in for an appointment id until booking works, so the session screens can be walked through. */
export const SAMPLE_SESSION_ID = "sample"

function ukTimeToIso(dayKey: string, time: string) {
  const asUtc = new Date(`${dayKey}T${time}:00Z`)
  const toMinutes = (clock: string) => {
    const [hours, minutes] = clock.split(":").map(Number)
    return hours * 60 + minutes
  }
  const offsetMinutes = toMinutes(formatTime(asUtc.toISOString())) - toMinutes(time)
  return new Date(asUtc.getTime() - offsetMinutes * 60_000).toISOString()
}

export function buildSampleSession(serviceId: WellbeingServiceId, dayKey: string, time: string, goal: string): Appointment {
  const service = WELLBEING_SERVICES[serviceId]
  return {
    id: SAMPLE_SESSION_ID,
    patientId: SAMPLE_SESSION_ID,
    providerId: SAMPLE_SESSION_ID,
    clinicalServiceId: serviceId,
    availabilitySlotId: `${dayKey}T${time}`,
    consultationMode: "video",
    status: "confirmed",
    presentingConcern: goal || null,
    fundingRoute: "pay_per_visit",
    serviceCategory: "wellbeing",
    providerName: SAMPLE_PRACTITIONER.name,
    serviceName: service.title,
    startsAt: ukTimeToIso(dayKey, time),
    durationMinutes: SESSION_MINUTES,
    reference: "LC-WB-SAMPLE",
    feeMinor: service.feeMinor,
    currency: "GBP",
    paymentStatus: "pending",
  }
}

/** The sample days and times, shaped like the API's availability. */
export const getSampleSlots = (): AvailabilitySlot[] =>
  getSampleSessionDays().flatMap((dayKey) =>
    SAMPLE_SESSION_TIMES.map((time) => ({
      id: `${dayKey}T${time}`,
      providerId: SAMPLE_SESSION_ID,
      startsAt: ukTimeToIso(dayKey, time),
      durationMinutes: SESSION_MINUTES,
      isBooked: false,
      heldUntil: null,
    }))
  )

const toIcsTime = (ms: number) => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, "")
const escapeIcsText = (text: string) => text.replace(/([\\,;])/g, "\\$1").replace(/\r?\n/g, "\\n")

/** A calendar file for the session as a download link, or null until it has a start time. */
export function getCalendarHref(session: Appointment) {
  if (!session.startsAt) return null
  const start = new Date(session.startsAt).getTime()
  const end = start + (session.durationMinutes ?? SESSION_MINUTES) * 60_000
  const title = session.serviceName || "Wellbeing session"
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LifeCome Health//Wellbeing//EN",
    "BEGIN:VEVENT",
    `UID:${session.id}@lifecome-health`,
    `DTSTAMP:${toIcsTime(start)}`,
    `DTSTART:${toIcsTime(start)}`,
    `DTEND:${toIcsTime(end)}`,
    `SUMMARY:${escapeIcsText(session.providerName ? `${title} with ${session.providerName}` : title)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`
}
