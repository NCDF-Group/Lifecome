"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarX, Check, Info, Mic, MicOff, Phone, Video, VideoOff, X } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { SelfView } from "@/components/portal/video/CallStage"
import { useAuth } from "@/context/AuthContext"
import { useAppointment } from "@/hooks/useAppointments"
import { useLocalMedia } from "@/hooks/useLocalMedia"
import { canManage, formatTime, getInitials } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { appointmentService, type ConsultationStatus } from "@/services/appointment.service"
import type { Appointment } from "@/types"
import { EmptyState, FOCUS_RING, PageContainer, PageHeader } from "../ui"
import { AppointmentFallback, actionButtonClass, appointmentPath } from "./shared"

const TEXT_LINK = cn("inline-block rounded-lg px-3 py-2 text-sm sm:text-[15px] font-medium text-[#0062F5] hover:underline", FOCUS_RING)
const ROUND_BUTTON = cn("w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed", FOCUS_RING)
const TOGGLE_BUTTON = cn(ROUND_BUTTON, "bg-[#E9F0F8] text-slate-900 hover:bg-[#DCE7F3]")
const BLOCKED_MESSAGE = "We can't use your camera or microphone. Allow access in your browser settings, then reload this page."

const STATUS_POLL_MS = 5000
// The steps a patient moves through themselves, in order, before their GP joins
const CHECK_IN_STEPS: ConsultationStatus[] = ["check_in_open", "device_check", "waiting"]
const IN_CALL_STATUSES: ConsultationStatus[] = ["connected", "reconnecting", "audio_fallback"]

async function checkIn(appointmentId: string) {
  const { status } = await appointmentService.getConsultation(appointmentId)
  const start = status === "booked" ? 0 : CHECK_IN_STEPS.indexOf(status) + 1
  // Anything further along means the consultation has already moved past check-in
  if (start === 0 && status !== "booked") return
  for (const next of CHECK_IN_STEPS.slice(start)) await appointmentService.transitionConsultation(appointmentId, next)
}

function useConsultationStatus(appointmentId: string) {
  const [status, setStatus] = useState<ConsultationStatus | null>(null)

  useEffect(() => {
    let active = true
    const load = () =>
      appointmentService.getConsultation(appointmentId).then(
        (session) => active && setStatus(session.status),
        // A missed update is picked up by the next one
        () => undefined
      )
    void load()
    const timer = window.setInterval(load, STATUS_POLL_MS)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [appointmentId])

  return status
}

function statusLabel(status: ConsultationStatus | null, clinician: string) {
  if (status === "ended") return "This consultation has ended"
  if (status === "clinician_joining") return `${clinician} is joining`
  if (status === "reconnecting") return "Reconnecting"
  if (status && IN_CALL_STATUSES.includes(status)) return "Consultation in progress"
  return `Waiting for ${clinician} to join`
}

/** Only rendered once the appointment can be joined, so the camera prompt never appears otherwise. */
function JoinableAppointment({ id, title, children }: { id: string; title: string; children: (appointment: Appointment) => React.ReactNode }) {
  const { data: appointment, error, reload } = useAppointment(id)
  if (!appointment) return <AppointmentFallback error={error} onRetry={reload} />

  if (!canManage(appointment) || appointment.consultationMode !== "video") {
    return (
      <PageContainer wide>
        <PageHeader title={title} />
        <EmptyState
          icon={CalendarX}
          title="This appointment can't be joined"
          description="It isn't a video appointment, or it has already taken place or been cancelled."
          action={
            <Link href={appointmentPath(id)} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View appointment
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return children(appointment)
}

function CallPanel({ initials, title, lines, media }: { initials: string; title: string; lines: string[]; media: ReturnType<typeof useLocalMedia> }) {
  return (
    <div className="relative min-h-[412px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B3A5C] to-[#0D2438] text-white flex flex-col items-center justify-center px-6 py-10 text-center">
      <SelfView media={media} />
      <span aria-hidden className="w-[125px] h-[125px] rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
        {initials}
      </span>
      <h2 className="mt-6 text-xl sm:text-[22px] font-bold">{title}</h2>
      <div className="mt-3 space-y-1.5 text-sm sm:text-[15px] text-slate-300">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

function WaitingRoomContent({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const { user } = useAuth()
  const media = useLocalMedia()
  const [isJoining, setIsJoining] = useState(false)
  const clinician = appointment.providerName || "Your GP"
  const name = user?.name && !user.name.includes("@") ? user.name : ""

  const deviceCheck = (label: string, hasTrack: boolean) =>
    media.stream
      ? { icon: hasTrack ? Check : X, className: hasTrack ? "text-emerald-700" : "text-red-600", label: `Your ${label} ${hasTrack ? "is working" : "wasn't found"}` }
      : media.isBlocked
        ? { icon: X, className: "text-red-600", label: `We can't use your ${label}` }
        : { icon: Info, className: "text-slate-400", label: `Checking your ${label}` }

  const checks = [
    { icon: Check, className: "text-emerald-700", label: "Your appointment details are ready" },
    deviceCheck("camera", Boolean(media.stream?.getVideoTracks().length)),
    deviceCheck("microphone", Boolean(media.stream?.getAudioTracks().length)),
  ]

  const join = async () => {
    setIsJoining(true)
    // The status tells the care team the patient is waiting, but shouldn't stand between them and the call
    await checkIn(appointment.id).catch(() => undefined)
    router.push(appointmentPath(appointment.id, "consultation"))
  }

  return (
    <PageContainer wide className="space-y-4 sm:space-y-4">
      <PageHeader title="Your GP will see you soon" description={appointment.startsAt ? `${clinician} · ${formatTime(appointment.startsAt)}` : clinician} />
      {media.isBlocked && <Notice icon={Info}>{BLOCKED_MESSAGE}</Notice>}
      <CallPanel media={media} initials={getInitials(name)} title="Ready when you are" lines={["Find a quiet, private place."]} />
      <ul className="space-y-2.5">
        {checks.map(({ icon: Icon, className, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-sm sm:text-[15px] text-slate-600">
            <Icon className={cn("w-[18px] h-[18px] shrink-0", className)} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
      <button type="button" onClick={join} disabled={isJoining} className={actionButtonClass("primary", "justify-center")}>
        {isJoining ? "Joining…" : "Join consultation"}
      </button>
      <div className="text-center">
        <Link href={`${ROUTES.PORTAL.NEW_MESSAGE}?team=support&topic=online_appointment`} className={TEXT_LINK}>
          Connection help
        </Link>
      </div>
    </PageContainer>
  )
}

function ConsultationContent({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const media = useLocalMedia()
  const status = useConsultationStatus(appointment.id)
  const clinician = appointment.providerName || "Your GP"
  const devices = media.stream
    ? `Microphone ${media.isMuted ? "off" : "on"} · Camera ${media.isCameraOff ? "off" : "on"}`
    : media.isBlocked
      ? "Camera and microphone unavailable"
      : "Connecting your camera and microphone"

  const end = async () => {
    if (status && IN_CALL_STATUSES.includes(status)) await appointmentService.transitionConsultation(appointment.id, "ended").catch(() => undefined)
    router.push(appointmentPath(appointment.id))
  }

  return (
    <PageContainer wide className="space-y-4 sm:space-y-4">
      <PageHeader title="GP consultation" description="Secure video appointment" />
      {media.isBlocked && <Notice icon={Info}>{BLOCKED_MESSAGE}</Notice>}
      <CallPanel media={media} initials={getInitials(clinician)} title={clinician} lines={[statusLabel(status, clinician), devices]} />
      <div className="flex justify-center gap-4">
        <button type="button" onClick={media.toggleMuted} disabled={!media.stream} aria-label={media.isMuted ? "Unmute" : "Mute"} aria-pressed={media.isMuted} className={TOGGLE_BUTTON}>
          {media.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <button
          type="button"
          onClick={media.toggleCamera}
          disabled={!media.stream}
          aria-label={media.isCameraOff ? "Turn camera on" : "Turn camera off"}
          aria-pressed={media.isCameraOff}
          className={TOGGLE_BUTTON}
        >
          {media.isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
        <button type="button" onClick={end} aria-label="End call" className={cn(ROUND_BUTTON, "bg-[#FF3B5C] hover:bg-[#E72F4F] text-white")}>
          <Phone className="w-6 h-6" />
        </button>
      </div>
      <Link href={`${ROUTES.PORTAL.NEW_MESSAGE}?team=gp&topic=online_appointment`} className={actionButtonClass("outline", "justify-center border-blue-200")}>
        Open messages
      </Link>
      <div className="text-center">
        <button type="button" onClick={end} className={cn(TEXT_LINK, "cursor-pointer")}>
          End consultation
        </button>
      </div>
    </PageContainer>
  )
}

export function WaitingRoom({ id }: { id: string }) {
  return <JoinableAppointment id={id} title="Your GP will see you soon">{(appointment) => <WaitingRoomContent appointment={appointment} />}</JoinableAppointment>
}

export function Consultation({ id }: { id: string }) {
  return <JoinableAppointment id={id} title="GP consultation">{(appointment) => <ConsultationContent appointment={appointment} />}</JoinableAppointment>
}
