"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarX, Clock, FileText, Info, MessageCircle, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { AppointmentFallback } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { CALL_CONTROL, CALL_CONTROL_ICON, CallControl, CallStage } from "@/components/portal/video/CallStage"
import { EmptyState, PageContainer, PageHeader } from "@/components/portal/ui"
import { useLocalMedia } from "@/hooks/useLocalMedia"
import { useWellbeingSession } from "@/hooks/useWellbeingSession"
import { canManage, formatTime, getCategoryLabels } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import { WELLBEING_MESSAGE_PATH, WELLBEING_PLAN_PATH, wellbeingSessionPath } from "@/lib/wellbeing"
import type { Appointment } from "@/types"
import { ServiceRow } from "../shared"
import { SampleSessionNotice } from "./SampleSessionNotice"

/** Only mounted for a session that can be joined, so the camera prompt never appears otherwise. */
function VideoRoom({ session, isSample }: { session: Appointment; isSample: boolean }) {
  const router = useRouter()
  const media = useLocalMedia()
  const { stream, isBlocked, isMuted, isCameraOff, toggleMuted, toggleCamera } = media
  const practitioner = session.providerName || "Your practitioner"

  return (
    <PageContainer className="space-y-4 sm:space-y-4">
      <div>
        <PageHeader title="Wellbeing video session" description={session.serviceName || "Wellbeing session"} />
        {session.startsAt && (
          <p className="mt-1 flex items-center gap-1.5 text-sm sm:text-[15px] font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-slate-400" aria-hidden />
            {formatTime(session.startsAt)} UK time
          </p>
        )}
      </div>

      {isSample && <SampleSessionNotice />}

      {/* No video service is connected yet, so this says so rather than showing a practitioner who isn't there */}
      <CallStage
        media={media}
        name={practitioner}
        title="Video sessions aren't available yet"
        footer={
          <>
            <p className="text-sm sm:text-base font-semibold leading-snug">{practitioner}</p>
            <p className="text-xs sm:text-sm text-slate-200 leading-snug">{getCategoryLabels(session).clinician}</p>
          </>
        }
      >
        <p>{practitioner} can&apos;t join you here yet. You can check your camera and microphone, or message your practitioner.</p>
      </CallStage>

      {isBlocked && (
        <Notice icon={Info}>We couldn&apos;t use your camera or microphone. Check that your browser has permission to use them.</Notice>
      )}

      <div className="grid grid-cols-4 gap-1 pt-1">
        <div className="flex justify-center">
          <CallControl label={isMuted ? "Unmute" : "Mute"} icon={isMuted ? MicOff : Mic} pressed={isMuted} disabled={!stream} onClick={toggleMuted} />
        </div>
        <div className="flex justify-center">
          <CallControl label="Camera" icon={isCameraOff ? VideoOff : Video} pressed={isCameraOff} disabled={!stream} onClick={toggleCamera} />
        </div>
        <div className="flex justify-center">
          <Link href={WELLBEING_MESSAGE_PATH} className={CALL_CONTROL}>
            <span aria-hidden className={cn(CALL_CONTROL_ICON, "text-white bg-slate-700 hover:bg-slate-800")}>
              <MessageCircle className="w-5 h-5" />
            </span>
            Chat
          </Link>
        </div>
        <div className="flex justify-center">
          <button type="button" onClick={() => router.push(wellbeingSessionPath(session.id))} className={CALL_CONTROL}>
            <span aria-hidden className={cn(CALL_CONTROL_ICON, "text-white bg-red-500 hover:bg-red-600")}>
              <PhoneOff className="w-5 h-5" />
            </span>
            End session
          </button>
        </div>
      </div>

      <ServiceRow
        item={{
          title: "View my plan after session",
          description: "See your agreed support plan.",
          href: WELLBEING_PLAN_PATH,
          icon: FileText,
          tone: "blue",
        }}
      />
    </PageContainer>
  )
}

export function VideoSession({ id }: { id: string }) {
  const { session, error, reload, isSample } = useWellbeingSession(id)
  if (!session) return <AppointmentFallback error={error} onRetry={reload} />

  if (!canManage(session) || session.consultationMode !== "video") {
    return (
      <PageContainer>
        <PageHeader title="Wellbeing video session" />
        <EmptyState
          icon={CalendarX}
          title="This session can't be joined"
          description="It isn't a video session, or it has already taken place or been cancelled."
          action={
            <Link href={wellbeingSessionPath(id)} className="text-sm font-semibold text-[#0062F5] hover:underline">
              View session
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return <VideoRoom session={session} isSample={isSample} />
}
