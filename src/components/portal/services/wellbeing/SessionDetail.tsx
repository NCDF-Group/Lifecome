"use client"

import Link from "next/link"
import {
  CalendarCheck,
  CalendarDays,
  CircleCheckBig,
  Clock,
  Hourglass,
  Info,
  Leaf,
  MessagesSquare,
  Target,
  User,
  Video,
  X,
} from "lucide-react"
import { ActionButtonContent, AppointmentFallback, actionButtonClass } from "@/components/portal/appointments/shared"
import { IconBadge, PageContainer, PageHeader, TONES } from "@/components/portal/ui"
import { useWellbeingSession } from "@/hooks/useWellbeingSession"
import { STATUS_STYLES, canManage, formatShortDate, formatTime, getReference } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import { WELLBEING_MESSAGE_PATH, wellbeingSessionPath } from "@/lib/wellbeing"
import { ServiceInfo, ServiceRow } from "../shared"
import { SampleSessionNotice } from "./SampleSessionNotice"

export function SessionDetail({ id, justRescheduled }: { id: string; justRescheduled: boolean }) {
  const { session, error, reload, isSample } = useWellbeingSession(id)
  if (!session) return <AppointmentFallback error={error} onRetry={reload} />

  const status = STATUS_STYLES[session.status]
  const isManageable = canManage(session)
  const details = [
    { icon: User, title: session.providerName || "Practitioner to be confirmed", note: "Your wellbeing practitioner" },
    { icon: CalendarDays, title: session.startsAt ? formatShortDate(session.startsAt) : "Date to be confirmed" },
    { icon: Clock, title: session.startsAt ? `${formatTime(session.startsAt)} UK time` : "Time to be confirmed" },
    ...(session.durationMinutes ? [{ icon: Hourglass, title: `${session.durationMinutes} minutes` }] : []),
  ]

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <div>
        <PageHeader title="My wellbeing session" />
        <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold", status.className)}>
          {session.status === "confirmed" && <CalendarCheck className="w-4 h-4" aria-hidden />}
          {status.label}
        </span>
        <p className="mt-2 text-sm sm:text-[15px] text-slate-600">Ref {getReference(session)}</p>
      </div>

      {isSample && <SampleSessionNotice />}

      {justRescheduled && (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CircleCheckBig className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden />
          <span>Your session has been moved to the new time below.</span>
        </div>
      )}

      <ServiceInfo icon={Leaf} tone="green" title={session.serviceName || "Wellbeing session"}>
        Practical support for a healthier you.
      </ServiceInfo>

      <ul className={cn("border rounded-2xl px-4 py-1 divide-y divide-[#DCE8FB]", TONES.blue.card)}>
        {details.map(({ icon, title, note }) => (
          <li key={title} className="flex items-center gap-3 py-3">
            <IconBadge icon={icon} tone="blue" variant="tinted" />
            <div className="min-w-0">
              <p className="text-[15px] sm:text-base font-semibold text-slate-900 leading-snug">{title}</p>
              {note && <p className="text-sm text-slate-500 leading-snug">{note}</p>}
            </div>
          </li>
        ))}
      </ul>

      {session.presentingConcern && (
        <ServiceInfo icon={Target} tone="green" title="Goal">
          {session.presentingConcern}
        </ServiceInfo>
      )}

      {isManageable ? (
        <div className="space-y-2.5">
          {session.consultationMode === "video" && (
            <Link href={wellbeingSessionPath(id, "join")} className={actionButtonClass("primary")}>
              <ActionButtonContent icon={Video} align="group">
                Join session
              </ActionButtonContent>
            </Link>
          )}
          <Link href={wellbeingSessionPath(id, "reschedule")} className={actionButtonClass("outline")}>
            <ActionButtonContent icon={CalendarDays} align="group">
              Reschedule session
            </ActionButtonContent>
          </Link>
          <Link href={wellbeingSessionPath(id, "cancel")} className={actionButtonClass("outline", "bg-white hover:bg-red-50 text-red-600 border-red-300")}>
            <ActionButtonContent icon={X} align="group">
              Cancel session
            </ActionButtonContent>
          </Link>
        </div>
      ) : (
        <ServiceInfo icon={Info} tone="blue">
          {session.status === "cancelled" ? "This session has been cancelled and can no longer be changed." : "This session has passed and can no longer be changed."}
        </ServiceInfo>
      )}

      <ServiceRow
        item={{
          title: "Message practitioner",
          description: "Send a message about this session.",
          href: WELLBEING_MESSAGE_PATH,
          icon: MessagesSquare,
          tone: "blue",
        }}
      />
    </PageContainer>
  )
}
