"use client"

import React, { useCallback, useId, useRef, useState } from "react"
import Link from "next/link"
import { Building2, Calendar, ChevronRight, EllipsisVertical, MapPin, Phone, Video, type LucideIcon } from "lucide-react"
import { useDismiss } from "@/hooks/useDismiss"
import { MODE_LABELS, STATUS_STYLES, canManage, formatDayDate, formatTimeWithZone } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Appointment, AppointmentType } from "@/types"
import { FOCUS_RING, TONES } from "./ui"

const MODE_STYLES: Record<AppointmentType, { icon: LucideIcon; badgeIcon: LucideIcon; tone: "green" | "blue"; badge: string; iconBg: string }> = {
  video: { icon: Video, badgeIcon: Video, tone: "green", badge: "bg-emerald-100/80 text-emerald-800", iconBg: "bg-emerald-100/80 text-emerald-700" },
  audio: { icon: Phone, badgeIcon: Phone, tone: "green", badge: "bg-emerald-100/80 text-emerald-800", iconBg: "bg-emerald-100/80 text-emerald-700" },
  in_person: { icon: Building2, badgeIcon: MapPin, tone: "blue", badge: "bg-blue-100/80 text-[#0062F5]", iconBg: "bg-blue-100/80 text-[#0062F5]" },
}

function AppointmentActions({ appointment }: { appointment: Appointment }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  const base = `${ROUTES.PORTAL.APPOINTMENTS}/${encodeURIComponent(appointment.id)}`
  const actions = [
    { label: "View appointment", href: base, className: "text-slate-700" },
    ...(canManage(appointment)
      ? [
          { label: "Reschedule", href: `${base}/reschedule`, className: "text-slate-700" },
          { label: "Cancel appointment", href: `${base}/cancel`, className: "text-red-600" },
        ]
      : []),
  ]

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Appointment options"
        onClick={() => setIsOpen((open) => !open)}
        className={cn("w-9 h-9 -mr-2 -mt-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/80 cursor-pointer", FOCUS_RING)}
      >
        <EllipsisVertical className="w-4 h-4" />
      </button>
      {isOpen && (
        <div id={menuId} role="menu" className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-900/10">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              role="menuitem"
              onClick={close}
              className={cn("block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50", action.className)}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const mode = MODE_STYLES[appointment.consultationMode] ?? MODE_STYLES.video
  const tone = TONES[mode.tone]
  const ModeIcon = mode.icon
  const BadgeIcon = mode.badgeIcon
  const isInPerson = appointment.consultationMode === "in_person"
  const status = STATUS_STYLES[appointment.status]
  const showStatus = appointment.status !== "confirmed"

  const title = appointment.startsAt ? formatDayDate(appointment.startsAt) : "Date to be confirmed"
  const who = isInPerson ? appointment.clinicName || appointment.providerName : appointment.providerName
  const href = `${ROUTES.PORTAL.APPOINTMENTS}/${encodeURIComponent(appointment.id)}`

  return (
    <article className={cn("border rounded-2xl", tone.card)}>
      <div className="flex gap-3 sm:gap-4 p-4">
        <span aria-hidden className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0", mode.iconBg)}>
          <ModeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">{title}</h3>
            <AppointmentActions appointment={appointment} />
          </div>
          {appointment.startsAt && <p className="text-sm sm:text-[15px] text-slate-500">{formatTimeWithZone(appointment.startsAt)}</p>}
          {who && <p className="mt-1 text-sm sm:text-[15px] font-semibold text-slate-900">{who}</p>}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold", mode.badge)}>
              <BadgeIcon className="w-3.5 h-3.5" aria-hidden />
              {MODE_LABELS[appointment.consultationMode]?.badge ?? "Appointment"}
            </span>
            {showStatus && (
              <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", status.className)}>{status.label}</span>
            )}
          </div>
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          "group mx-4 flex items-center gap-2 border-t border-slate-200/70 py-3 text-[15px] sm:text-base font-medium text-[#0062F5] hover:text-[#0050C7] rounded-b-2xl",
          FOCUS_RING
        )}
      >
        <Calendar className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden />
        <span className="flex-1">{isInPerson ? "View clinic details" : "View appointment"}</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </article>
  )
}
