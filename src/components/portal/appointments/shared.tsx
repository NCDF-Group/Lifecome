"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { ErrorState, FOCUS_RING, LoadingCards, PageContainer } from "../ui"

export const appointmentPath = (id: string, step?: "reschedule" | "cancel" | "cancelled" | "waiting-room") =>
  `${ROUTES.PORTAL.APPOINTMENTS}/${encodeURIComponent(id)}${step ? `/${step}` : ""}`

/** Shown while an appointment loads or when it can't be loaded. */
export function AppointmentFallback({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <PageContainer>
      {error ? (
        <div className="space-y-4">
          <ErrorState message={error} onRetry={onRetry} />
          <Link href={ROUTES.PORTAL.APPOINTMENTS} className="inline-block text-sm font-medium text-[#0062F5] hover:underline">
            Back to your appointments
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-2/3 max-w-sm rounded bg-slate-100" />
            <div className="h-4 w-1/3 max-w-[180px] rounded bg-slate-100" />
          </div>
          <LoadingCards count={3} label="Loading appointment" />
        </div>
      )}
    </PageContainer>
  )
}

/** A label/value line in a details list; stacks on very narrow screens. */
export function DetailRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-1 min-[400px]:gap-4 px-4 py-3">
      <dt className="flex items-center gap-3 text-[15px] text-slate-500 min-[400px]:flex-1">
        <Icon className="w-[18px] h-[18px] text-[#0062F5] shrink-0" aria-hidden />
        {label}
      </dt>
      <dd className="pl-[30px] min-[400px]:pl-0 text-[15px] font-semibold text-slate-900 min-[400px]:text-right">{children}</dd>
    </div>
  )
}

type ButtonVariant = "primary" | "outline" | "danger" | "soft"

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-[#0062F5] hover:bg-[#0052cc] text-white border-transparent shadow-sm shadow-blue-600/20",
  outline: "bg-white hover:bg-blue-50/60 text-[#0062F5] border-[#0062F5]",
  danger: "bg-[#D7182A] hover:bg-[#B81424] text-white border-transparent shadow-sm shadow-red-600/20",
  soft: "bg-[#F0F6FF] hover:bg-blue-50 text-slate-900 border-[#DCE8FB]",
}

export const actionButtonClass = (variant: ButtonVariant, className?: string) =>
  cn(
    "group w-full min-h-[52px] rounded-xl border px-4 py-3 flex items-center gap-3 text-base sm:text-[17px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
    BUTTON_VARIANTS[variant],
    FOCUS_RING,
    className
  )

/**
 * Wide action with an optional leading icon, a label and a trailing chevron.
 * `inline` keeps the chevron beside a centred label, as on the form submit buttons.
 */
export function ActionButtonContent({
  icon: Icon,
  children,
  align = "center",
}: {
  icon?: LucideIcon
  children: React.ReactNode
  align?: "center" | "start" | "inline"
}) {
  if (align === "inline") {
    return (
      <span className="flex-1 inline-flex items-center justify-center gap-2">
        {children}
        <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    )
  }
  return (
    <>
      {Icon ? <Icon className="w-5 h-5 shrink-0" aria-hidden /> : <span className="w-5 shrink-0" aria-hidden />}
      <span className={cn("flex-1", align === "center" ? "text-center" : "text-left")}>{children}</span>
      <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </>
  )
}
