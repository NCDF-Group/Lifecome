import type { Visit } from "@/types"
import { ROUTES } from "./constants"
import { wellbeingSessionPath } from "./wellbeing"

export type VisitTab = "upcoming" | "past" | "cancelled"

const FINISHED_STATUSES = ["completed", "missed", "patient_no_show", "doctor_unavailable"]

// A cancelled visit keeps its original date, so the status decides this before the date does
export function getVisitTab(visit: Visit, now: number): VisitTab {
  if (visit.status === "cancelled") return "cancelled"
  if (FINISHED_STATUSES.includes(visit.status)) return "past"
  return new Date(visit.scheduledStartsAt).getTime() >= now ? "upcoming" : "past"
}

export function getVisitHref(visit: Visit) {
  if (visit.service === "wellbeing") return wellbeingSessionPath(visit.id)
  if (visit.service === "care") return `${ROUTES.PORTAL.SERVICES}/care`
  return `${ROUTES.PORTAL.APPOINTMENTS}/${encodeURIComponent(visit.id)}`
}
