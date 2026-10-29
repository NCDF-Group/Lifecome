"use client"

import React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MessageTeam } from "@/lib/messaging"

export function TeamIcon({ team, size = "md", className }: { team: MessageTeam; size?: "sm" | "md"; className?: string }) {
  const Icon = team.icon
  return (
    <span
      aria-hidden
      className={cn(
        "rounded-full bg-blue-100/70 text-[#0062F5] flex items-center justify-center shrink-0",
        size === "sm" ? "w-9 h-9" : "w-11 h-11",
        className
      )}
    >
      <Icon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
    </span>
  )
}

/** One-line reassurance or safety banner. */
export function Notice({
  icon: Icon,
  tone = "blue",
  title,
  children,
}: {
  icon: LucideIcon
  tone?: "blue" | "green"
  title?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm sm:text-[15px]",
        tone === "blue" ? "border-[#DCE8FB] bg-[#F0F6FF] text-slate-700" : "border-[#DDF2E4] bg-[#F1F9F4] text-slate-600"
      )}
    >
      <Icon className={cn("w-[18px] h-[18px] mt-0.5 shrink-0", tone === "blue" ? "text-[#0062F5]" : "text-emerald-600")} aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold text-slate-900">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
