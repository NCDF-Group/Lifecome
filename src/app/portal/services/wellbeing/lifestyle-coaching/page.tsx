"use client"

import Link from "next/link"
import { ChartNoAxesColumn, Clock, FileText, Leaf, Monitor, Tag, Target, Users } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { ServiceRow } from "@/components/portal/services/shared"
import { IconBadge, PageContainer, PageHeader, SectionHeading, TONES, type ActionItem } from "@/components/portal/ui"
import { cn } from "@/lib/utils"
import { WELLBEING_PLAN_PATH, WELLBEING_SERVICES, wellbeingPath } from "@/lib/wellbeing"

const LIFESTYLE_COACHING = wellbeingPath("lifestyle-coaching")
const SERVICE = WELLBEING_SERVICES["lifestyle-coaching"]

const STEPS: ActionItem[] = [
  { title: "Explore your priorities", description: "Understand what matters to you.", href: `${LIFESTYLE_COACHING}/priorities`, icon: Target, tone: "green" },
  { title: "Set a manageable goal", description: "Create a realistic and achievable plan.", href: `${LIFESTYLE_COACHING}/goals`, icon: FileText, tone: "blue" },
  { title: "Review progress", description: "Check in and make adjustments.", href: `${LIFESTYLE_COACHING}/progress`, icon: ChartNoAxesColumn, tone: "green" },
]

// Only the fee shows its label; the format and length read fine on their own
const SESSION_DETAILS = [
  { icon: Monitor, label: "Format", value: SERVICE.format, showLabel: false },
  { icon: Clock, label: "Length", value: SERVICE.length, showLabel: false },
  { icon: Tag, label: "Sample fee", value: SERVICE.sampleFee, showLabel: true },
]

export default function LifestyleCoachingPage() {
  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <div className={cn("border rounded-2xl p-4 flex items-center justify-between gap-4", TONES.green.card)}>
        <PageHeader title="Lifestyle coaching" description="Build routines that fit your life." />
        <span
          aria-hidden
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-white/80 bg-[#F1F9F4] text-emerald-700 flex items-center justify-center shrink-0 shadow-[0_0_28px_6px_rgba(16,185,129,0.16)]"
        >
          <Leaf className="w-8 h-8 sm:w-12 sm:h-12" />
        </span>
      </div>

      <ul className="space-y-2">
        {STEPS.map((item) => (
          <li key={item.href}>
            <ServiceRow item={item} />
          </li>
        ))}
      </ul>

      <section aria-labelledby="session-details" className={cn("border rounded-2xl p-4", TONES.blue.card)}>
        <SectionHeading id="session-details" title="Session details" />
        <dl className="mt-3 grid grid-cols-3 divide-x divide-[#DCE8FB]">
          {SESSION_DETAILS.map(({ icon, label, value, showLabel }) => (
            <div key={label} className="px-1 sm:px-3 flex flex-col items-center justify-center gap-1.5 text-center">
              <IconBadge icon={icon} tone="blue" variant="tinted" />
              <dt className={cn(showLabel ? "text-xs sm:text-[13px] text-slate-500 leading-tight" : "sr-only")}>{label}</dt>
              <dd className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="space-y-2.5">
        <Link href={wellbeingPath("lifestyle-coaching", "practitioner")} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={Users} align="start">
            Choose a practitioner
          </ActionButtonContent>
        </Link>
        <Link
          href={WELLBEING_PLAN_PATH}
          className={actionButtonClass("soft", "[&>svg:first-child]:text-[#0062F5] [&>svg:last-child]:text-[#0062F5]")}
        >
          <ActionButtonContent icon={FileText} align="start">
            View my wellbeing plan
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
