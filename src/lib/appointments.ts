import type { AvailabilitySlot } from "@/services/appointment.service"
import type { Appointment, AppointmentStatus, AppointmentType } from "@/types"

// Appointments are booked and shown in UK time, whatever the device's own time zone
export const UK_TIME_ZONE = "Europe/London"

const fullDateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: UK_TIME_ZONE,
})
const longDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: UK_TIME_ZONE,
})
const shortDateFormat =new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: UK_TIME_ZONE,
})
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: UK_TIME_ZONE,
})
// en-CA formats as YYYY-MM-DD, which groups slots by their UK calendar day
const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: UK_TIME_ZONE,
})
const tileFormat = {
  weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: UK_TIME_ZONE }),
  day: new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: UK_TIME_ZONE }),
  month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: UK_TIME_ZONE }),
}

/** "Wednesday 21 October 2026" */
export const formatFullDate = (iso: string) => fullDateFormat.format(new Date(iso))
/** "21 October 2026" */
export const formatLongDate = (iso: string) => longDateFormat.format(new Date(iso))
/** "10:30" */
export const formatTime = (iso: string) => timeFormat.format(new Date(iso))
/** "Wed 21 Oct 2026" */
export const formatShortDate = (iso: string) => shortDateFormat.format(new Date(iso)).replace(",", "")
/** "Wed 21 Oct 2026 at 10:30" */
export const formatShortDateTime = (iso: string) => `${formatShortDate(iso)} at ${formatTime(iso)}`
export const toUkDayKey = (iso: string) => dayKeyFormat.format(new Date(iso))
export const formatDateTile = (iso: string) => {
  const date = new Date(iso)
  return {
    weekday: tileFormat.weekday.format(date),
    day: tileFormat.day.format(date),
    month: tileFormat.month.format(date),
  }
}

const MAX_DAYS = 10

export interface DayOption {
  key: string
  slots: AvailabilitySlot[]
}

/** Open slots grouped by UK calendar day, soonest first. */
export function groupOpenSlots(slots: AvailabilitySlot[], currentSlotId: string): DayOption[] {
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

const CLOSED_STATUSES: AppointmentStatus[] = ["cancelled", "patient_no_show", "doctor_unavailable"]

export function isUpcoming(appointment: Appointment, now = Date.now()) {
  if (CLOSED_STATUSES.includes(appointment.status)) return false
  // Without a start time the booking is still being arranged, so it is not in the past yet
  if (!appointment.startsAt) return true
  return new Date(appointment.startsAt).getTime() >= now
}

/** Only bookings that have not happened and are still active can be changed */
export const canManage = (appointment: Appointment) => isUpcoming(appointment)

const CATEGORY_LABELS: Record<Appointment["serviceCategory"], { short: string; clinician: string; team: string }> = {
  gp: { short: "GP", clinician: "General practitioner", team: "GP team" },
  menopause: { short: "menopause", clinician: "Menopause specialist", team: "menopause team" },
  care: { short: "care", clinician: "Care professional", team: "care team" },
  wellbeing: { short: "wellbeing", clinician: "Wellbeing practitioner", team: "wellbeing team" },
}

export const getCategoryLabels = (appointment: Appointment) =>
  CATEGORY_LABELS[appointment.serviceCategory] ?? CATEGORY_LABELS.gp

export const MODE_LABELS: Record<AppointmentType, { badge: string; detail: string; location: string }> = {
  video: { badge: "Video", detail: "Secure video", location: "Secure video appointment" },
  audio: { badge: "Phone", detail: "Phone call", location: "Phone appointment" },
  in_person: { badge: "In person", detail: "In person", location: "In-person appointment" },
}

export function getLocationLabel(appointment: Appointment) {
  if (appointment.consultationMode === "in_person") {
    return [appointment.clinicName, appointment.clinicAddress].filter(Boolean).join(", ") || MODE_LABELS.in_person.location
  }
  return MODE_LABELS[appointment.consultationMode].location
}

export const getReference = (appointment: Appointment) => appointment.reference || appointment.id

export function getInitials(name?: string | null) {
  const words = (name ?? "")
    .replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : words[0][1] ?? ""
  return `${first}${last}`.toUpperCase()
}

export function formatFee(appointment: Pick<Appointment, "feeMinor" | "currency">) {
  if (appointment.feeMinor == null) return null
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: appointment.currency ?? "GBP",
  }).format(appointment.feeMinor / 100)
}

export const STATUS_STYLES: Record<AppointmentStatus, { label: string; className: string }> = {
  slot_held: { label: "Awaiting confirmation", className: "bg-amber-50 text-amber-700 border-amber-100" },
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  rescheduled: { label: "Rescheduled", className: "bg-blue-50 text-[#0062F5] border-blue-100" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600 border-red-100" },
  doctor_unavailable: { label: "Clinician unavailable", className: "bg-amber-50 text-amber-700 border-amber-100" },
  patient_no_show: { label: "Missed", className: "bg-slate-100 text-slate-600 border-slate-200" },
}
