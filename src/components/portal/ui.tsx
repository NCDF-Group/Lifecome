"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AlertCircle, ChevronRight, RefreshCw, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/appointments"

// ─── Tones ───────────────────────────────────────────────────────────────────

export type Tone = "green" | "blue" | "red"

export const TONES: Record<Tone, { card: string; hover: string; icon: string; chevron: string }> = {
  green: {
    card: "bg-[#F1F9F4] border-[#DDF2E4]",
    hover: "hover:border-emerald-200",
    icon: "text-emerald-600",
    chevron: "text-slate-400",
  },
  blue: {
    card: "bg-[#F0F6FF] border-[#DCE8FB]",
    hover: "hover:border-blue-200",
    icon: "text-[#0062F5]",
    chevron: "text-[#0062F5]",
  },
  red: {
    card: "bg-[#FEF4F4] border-[#FBDADA]",
    hover: "hover:border-red-200",
    icon: "text-red-600",
    chevron: "text-red-500",
  },
}

export const ICON_BACKGROUNDS: Record<Tone, string> = {
  green: "bg-emerald-100/70",
  blue: "bg-blue-100/70",
  red: "bg-red-100/70",
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"

export function IconBadge({
  icon: Icon,
  tone,
  variant = "square",
  size = "md",
  className,
}: {
  icon: LucideIcon
  tone: Tone
  variant?: "square" | "circle" | "tinted"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center shrink-0",
        TONES[tone].icon,
        variant === "circle" && "rounded-full bg-white shadow-sm",
        variant === "square" && `rounded-xl ${ICON_BACKGROUNDS[tone]}`,
        variant === "tinted" && `rounded-full ${ICON_BACKGROUNDS[tone]}`,
        size === "sm" && "w-9 h-9",
        size === "md" && "w-10 h-10",
        size === "lg" && "w-12 h-12",
        size === "xl" && "w-12 h-12 sm:w-14 sm:h-14",
        className
      )}
    >
      <Icon className={size === "lg" || size === "xl" ? "w-6 h-6" : "w-[18px] h-[18px]"} />
    </span>
  )
}

// ─── Cards ───────────────────────────────────────────────────────────────────

export interface ActionItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
  tone: Tone
}

/** Tile with the icon above the text, used in the two-column grids. */
export function ActionCard({ item, iconVariant = "square" }: { item: ActionItem; iconVariant?: "square" | "circle" }) {
  const tone = TONES[item.tone]
  return (
    <Link
      href={item.href}
      className={cn(
        "group border rounded-2xl p-4 flex flex-col gap-3 sm:gap-4 transition-all hover:shadow-sm",
        tone.card,
        tone.hover,
        FOCUS_RING
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <IconBadge icon={item.icon} tone={item.tone} variant={iconVariant} />
        <ChevronRight className={cn("w-4 h-4 mt-1 shrink-0 transition-transform group-hover:translate-x-0.5", tone.chevron)} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-slate-900 leading-snug">{item.title}</span>
        <span className="block text-sm text-slate-500 mt-0.5 leading-snug">{item.description}</span>
      </span>
    </Link>
  )
}

/**
 * Full-width row with the icon beside the text. `lg` is the roomier tile used on the
 * Home screen, with the chevron lined up with the title.
 */
export function ActionRow({
  item,
  iconVariant = "circle",
  titleClassName,
  size = "md",
}: {
  item: ActionItem
  iconVariant?: "square" | "circle"
  titleClassName?: string
  size?: "md" | "lg"
}) {
  const tone = TONES[item.tone]
  const large = size === "lg"
  return (
    <Link
      href={item.href}
      className={cn(
        "group border rounded-2xl flex items-center gap-3 sm:gap-4 transition-all hover:shadow-sm",
        large ? "p-4 sm:p-5" : "p-4",
        tone.card,
        tone.hover,
        FOCUS_RING
      )}
    >
      <IconBadge icon={item.icon} tone={item.tone} variant={iconVariant} size={large ? "xl" : "md"} />
      <span className="flex-1 min-w-0">
        <span className={cn("block font-semibold text-slate-900 leading-snug", large ? "text-base sm:text-[17px]" : "text-[15px]", titleClassName)}>
          {item.title}
        </span>
        <span className={cn("block text-sm text-slate-500 leading-snug", large ? "mt-1 sm:text-[15px]" : "mt-0.5")}>{item.description}</span>
      </span>
      <ChevronRight
        className={cn("w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5", large && "self-start mt-1", tone.chevron)}
        aria-hidden
      />
    </Link>
  )
}

/** The solid blue call to action, e.g. "Book an appointment". */
export function PrimaryActionLink({
  href,
  icon: Icon,
  children,
  className,
}: {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group bg-[#0062F5] hover:bg-[#0052cc] text-white rounded-2xl px-4 py-3.5 sm:py-4 flex items-center gap-3 shadow-sm shadow-blue-600/20 transition-colors",
        FOCUS_RING,
        className
      )}
    >
      <span aria-hidden className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span className="flex-1 font-semibold text-base sm:text-[17px]">{children}</span>
      <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

// ─── Page structure ──────────────────────────────────────────────────────────

export function PageHeader({ eyebrow, title, description }: { eyebrow?: React.ReactNode; title: string; description?: React.ReactNode }) {
  return (
    <header>
      {eyebrow && <p className="text-sm text-slate-500">{eyebrow}</p>}
      <h1 className={cn("text-[28px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight", eyebrow && "mt-1")}>
        {title}
      </h1>
      {description && <p className="text-sm sm:text-[15px] text-slate-500 mt-1.5">{description}</p>}
    </header>
  )
}

export function SectionHeading({
  title,
  description,
  id,
  action,
}: {
  title: string
  description?: string
  id?: string
  /** e.g. a "View all" link, shown at the end of the heading row */
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 id={id} className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn("inline-flex items-center gap-0.5 shrink-0 rounded-md text-sm font-medium text-[#0062F5] hover:text-[#0050C7] hover:underline", FOCUS_RING)}
        >
          {action.label}
          <ChevronRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

/** Keeps every portal page on the same readable column width. `wide` stretches it to Home's card width, from the left. */
export function PageContainer({ children, className, wide = false }: { children: React.ReactNode; className?: string; wide?: boolean }) {
  return <div className={cn("w-full space-y-6 sm:space-y-8", wide ? "max-w-[1200px]" : "max-w-[968px] mx-auto", className)}>{children}</div>
}

// ─── People ──────────────────────────────────────────────────────────────────

export function Avatar({
  name,
  src,
  size = "md",
  tone = "green",
  className,
}: {
  name?: string | null
  src?: string | null
  size?: "sm" | "md" | "lg"
  tone?: "green" | "blue"
  className?: string
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src) && failedSrc !== src
  const initials = getInitials(name)

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-semibold select-none",
        tone === "green" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-[#0062F5]",
        size === "sm" && "w-8 h-8 text-xs",
        size === "md" && "w-10 h-10 text-sm",
        size === "lg" && "w-12 h-12 text-base",
        className
      )}
    >
      {showImage ? (
        // Profile photos come from the API host, so they skip the Next image optimiser
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src!} alt="" className="w-full h-full object-cover" onError={() => setFailedSrc(src!)} />
      ) : (
        <span aria-hidden>{initials || "?"}</span>
      )}
    </span>
  )
}

// ─── States ──────────────────────────────────────────────────────────────────

export function LoadingCards({ count = 2, label }: { count?: number; label: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-2/5 rounded bg-slate-100" />
              <div className="h-3 w-1/4 rounded bg-slate-100" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-100 bg-red-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden />
      <p className="flex-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 cursor-pointer",
            FOCUS_RING
          )}
        >
          <RefreshCw className="w-4 h-4" aria-hidden />
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <span aria-hidden className="mx-auto w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </span>
      <p className="mt-4 text-[15px] font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export { FOCUS_RING }
