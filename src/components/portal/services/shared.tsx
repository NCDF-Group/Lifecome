"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FOCUS_RING, ICON_BACKGROUNDS, IconBadge, TONES, type ActionItem, type Tone } from "../ui"

export const EYEBROW = "text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-slate-500"

export interface ServiceRowItem extends Omit<ActionItem, "description" | "icon"> {
  description?: string
  eyebrow?: string
  icon?: LucideIcon
  /** Shown in place of the icon on a numbered list of steps */
  step?: number
}

/** Menu row on a service page. `lg` is the roomier row on a service's home page, and `home` matches the rows on Home. */
export function ServiceRow({ item, size = "md" }: { item: ServiceRowItem; size?: "md" | "lg" | "home" }) {
  const tone = TONES[item.tone]
  const large = size === "lg"
  const home = size === "home"
  return (
    <Link
      href={item.href}
      className={cn("group border rounded-2xl flex items-center transition-all hover:shadow-sm", home ? "p-4 sm:p-5 gap-3 sm:gap-4" : "p-3.5 gap-3 sm:gap-3.5", tone.card, tone.hover, FOCUS_RING)}
    >
      {item.icon && (
        <IconBadge
          icon={item.icon}
          tone={item.tone}
          variant="tinted"
          size={home ? "xl" : large ? "lg" : "md"}
          className={cn(large && "sm:w-[52px] sm:h-[52px]", size === "md" && "sm:w-11 sm:h-11")}
        />
      )}
      {item.step !== undefined && (
        <span aria-hidden className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[15px] font-bold", tone.icon, ICON_BACKGROUNDS[item.tone])}>
          {item.step}
        </span>
      )}
      <span className="flex-1 min-w-0">
        {item.eyebrow && <span className={cn("block", EYEBROW)}>{item.eyebrow}</span>}
        <span className={cn("block text-base font-semibold text-slate-900 leading-snug", large ? "sm:text-lg" : "sm:text-[17px]")}>{item.title}</span>
        {item.description && <span className={cn("block text-sm text-slate-500 leading-snug", home ? "mt-1 sm:text-[15px]" : "mt-0.5")}>{item.description}</span>}
      </span>
      <ChevronRight className="w-5 h-5 shrink-0 text-[#0062F5] transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}

/** Tile with the icon above the text, for a pair of choices shown side by side. */
export function ServiceTile({ item }: { item: ActionItem }) {
  const tone = TONES[item.tone]
  return (
    <Link
      href={item.href}
      className={cn("group border rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sm:gap-6 transition-all hover:shadow-sm", tone.card, tone.hover, FOCUS_RING)}
    >
      <span className="flex items-start justify-between gap-2">
        <IconBadge icon={item.icon} tone={item.tone} variant="tinted" size="lg" className="sm:w-14 sm:h-14" />
        <ChevronRight className="w-5 h-5 shrink-0 text-[#0062F5] transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
      <span>
        <span className="block text-base sm:text-[17px] font-semibold text-slate-900 leading-snug">{item.title}</span>
        <span className="block text-sm sm:text-[15px] text-slate-500 leading-snug mt-1">{item.description}</span>
      </span>
    </Link>
  )
}

/** Tinted strip with a round icon: a session fact when it has a `label`, otherwise a note with an optional `title`. */
export function ServiceInfo({
  icon,
  tone,
  label,
  title,
  children,
}: {
  icon: LucideIcon
  tone: Tone
  label?: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("border rounded-2xl p-3.5 flex items-center gap-3 sm:gap-3.5", TONES[tone].card)}>
      <IconBadge icon={icon} tone={tone} variant="tinted" className="sm:w-11 sm:h-11" />
      <div className="min-w-0">
        {label && <p className="text-sm text-slate-500 leading-snug">{label}</p>}
        {title && <p className="text-base sm:text-[17px] font-semibold text-slate-900 leading-snug">{title}</p>}
        <div className={label ? "text-base sm:text-lg font-bold text-slate-900 leading-snug" : "text-sm sm:text-[15px] text-slate-700 leading-snug"}>
          {children}
        </div>
      </div>
    </div>
  )
}
