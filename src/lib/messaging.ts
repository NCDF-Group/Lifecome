import { Headphones, HandHeart, ShieldCheck, Sprout, Stethoscope, type LucideIcon } from "lucide-react"
import type { MessageServiceCategory, MessageThread, MessageTopic, ThreadMessage } from "@/types"

// ─── Teams ───────────────────────────────────────────────────────────────────
// The API files threads by service category and topic; patients choose a team

export type TeamId = "gp" | "care" | "wellbeing" | "insurance" | "support"

export interface MessageTeam {
  id: TeamId
  name: string
  description: string
  icon: LucideIcon
  serviceCategory: MessageServiceCategory
  defaultTopic: MessageTopic
}

export const TEAMS: MessageTeam[] = [
  { id: "gp", name: "GP care team", description: "Appointments, results and clinical questions", icon: Stethoscope, serviceCategory: "clinical", defaultTopic: "clinical_query" },
  { id: "care", name: "Care coordination", description: "Assessments and care at home", icon: HandHeart, serviceCategory: "care", defaultTopic: "care_support" },
  { id: "wellbeing", name: "Wellbeing team", description: "Coaching and wellbeing sessions", icon: Sprout, serviceCategory: "wellbeing", defaultTopic: "wellbeing_coaching" },
  { id: "insurance", name: "Insurance support", description: "Help with cover and policy documents", icon: ShieldCheck, serviceCategory: "insurance", defaultTopic: "insurance_query" },
  { id: "support", name: "Account support", description: "Your account, bookings and payments", icon: Headphones, serviceCategory: "support", defaultTopic: "general_support" },
]

export const getTeam = (id: string | null | undefined) => TEAMS.find((team) => team.id === id) ?? null
export const getTeamForCategory = (category: MessageServiceCategory) =>
  TEAMS.find((team) => team.serviceCategory === category) ?? TEAMS[TEAMS.length - 1]

export const TOPIC_LABELS: Record<MessageTopic, string> = {
  booking_payments: "Booking and payments",
  online_appointment: "Online appointment",
  clinic_visit: "Clinic visit",
  follow_up: "Follow-up",
  clinical_query: "Clinical question",
  care_support: "Care support",
  wellbeing_coaching: "Wellbeing coaching",
  insurance_query: "Insurance question",
  general_support: "General support",
}

export const isTopic = (value: unknown): value is MessageTopic =>
  typeof value === "string" && value in TOPIC_LABELS

export const MESSAGE_MAX_LENGTH = 4000

// ─── Response mapping ────────────────────────────────────────────────────────
// The API spec documents the request bodies but not the responses, so every field is
// read defensively here. Once the real payloads are confirmed, tighten this one file.

type Raw = Record<string, unknown>

const asObject = (value: unknown): Raw | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : null

/** Reads the first non-empty string at any of the dotted paths, e.g. "sender.name". */
function pickString(source: Raw, paths: string[]): string | null {
  for (const path of paths) {
    let current: unknown = source
    for (const part of path.split(".")) current = asObject(current)?.[part]
    if (typeof current === "string" && current.trim()) return current
    if (typeof current === "number") return String(current)
  }
  return null
}

const CATEGORIES: MessageServiceCategory[] = ["clinical", "care", "wellbeing", "insurance", "support"]

export function toThread(raw: unknown): MessageThread | null {
  const source = asObject(raw)
  const id = source && pickString(source, ["id", "threadId"])
  if (!source || !id) return null

  const topic = pickString(source, ["topic"])
  const category = pickString(source, ["serviceCategory", "category"])
  const unread = source.unreadCount ?? source.unread
  return {
    id,
    topic: isTopic(topic) ? topic : null,
    serviceCategory: CATEGORIES.includes(category as MessageServiceCategory) ? (category as MessageServiceCategory) : "support",
    preview: pickString(source, ["lastMessage.body", "latestMessage.body", "lastMessagePreview", "lastMessageBody", "preview"]),
    lastActivityAt: pickString(source, ["lastMessageAt", "lastMessage.createdAt", "latestMessage.createdAt", "updatedAt", "createdAt"]),
    unreadCount: typeof unread === "number" ? unread : unread === true ? 1 : 0,
  }
}

export function toMessage(raw: unknown, viewerId: string | undefined): ThreadMessage | null {
  const source = asObject(raw)
  const id = source && pickString(source, ["id", "messageId"])
  const body = source && pickString(source, ["body", "content", "text"])
  if (!source || !id || !body) return null

  const role = pickString(source, ["senderType", "senderRole", "authorType", "authorRole", "sender.type", "sender.role", "author.role"])
  const senderId = pickString(source, ["senderUserAccountId", "senderId", "authorUserAccountId", "authorId", "sender.id", "author.id"])
  return {
    id,
    body,
    createdAt: pickString(source, ["createdAt", "sentAt"]),
    isMine: role ? /patient/i.test(role) : Boolean(viewerId && senderId === viewerId),
    senderName: pickString(source, ["senderName", "authorName", "sender.displayName", "sender.name", "author.displayName", "author.name"]),
  }
}

export const threadIdFrom = (data: unknown) => {
  const source = asObject(data)
  return (source && (pickString(source, ["id", "threadId", "thread.id"]))) || null
}

// ─── Dates ───────────────────────────────────────────────────────────────────
// Message times follow the patient's own clock, unlike appointments which are in UK time

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })
const dayYearFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" })
const shortDayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
const DAY_MS = 24 * 60 * 60 * 1000

export const formatMessageTime = (iso: string) => timeFormat.format(new Date(iso))
export const messageDayKey = (iso: string) => String(startOfDay(new Date(iso)))

/** "Today", "Yesterday", "Monday 12 October", or with the year when it isn't this year */
export function formatMessageDay(iso: string, now: number) {
  const date = new Date(iso)
  const daysAgo = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / DAY_MS)
  if (daysAgo === 0) return "Today"
  if (daysAgo === 1) return "Yesterday"
  return date.getFullYear() === new Date(now).getFullYear() ? dayFormat.format(date) : dayYearFormat.format(date)
}

/** Time for today's threads, otherwise the date, e.g. "12 Oct" */
export function formatThreadActivity(iso: string, now: number) {
  const date = new Date(iso)
  return startOfDay(date) === startOfDay(new Date(now)) ? timeFormat.format(date) : shortDayFormat.format(date)
}
