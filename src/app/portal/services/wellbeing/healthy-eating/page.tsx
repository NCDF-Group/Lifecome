"use client"

import Link from "next/link"
import { Apple, Check, Info, Monitor, Tag, Users } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { ServiceInfo } from "@/components/portal/services/shared"
import { PageContainer, PageHeader, TONES } from "@/components/portal/ui"
import { cn } from "@/lib/utils"
import { WELLBEING_SERVICES, wellbeingPath } from "@/lib/wellbeing"

const SERVICE = WELLBEING_SERVICES["healthy-eating"]

const HIGHLIGHTS = ["Explore food routines", "Learn general healthy-eating principles", "Choose a practical next step"]

export default function HealthyEatingPage() {
  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <div className="flex items-center gap-3 sm:gap-5">
        <span aria-hidden className="w-16 h-16 sm:w-[92px] sm:h-[92px] rounded-2xl bg-blue-50 text-[#0062F5] flex items-center justify-center shrink-0">
          <Apple className="w-8 h-8 sm:w-12 sm:h-12" />
        </span>
        <PageHeader title="Healthy eating support" description="Practical education for everyday choices." />
      </div>

      <ul className={cn("border rounded-2xl p-3.5 sm:p-4 space-y-3", TONES.green.card)}>
        {HIGHLIGHTS.map((highlight) => (
          <li key={highlight} className="flex items-center gap-3">
            <span aria-hidden className="w-7 h-7 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </span>
            <span className="text-[15px] sm:text-[17px] font-semibold text-slate-900 leading-snug">{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <ServiceInfo icon={Monitor} tone="blue" label={SERVICE.format}>
          {SERVICE.length}
        </ServiceInfo>
        <ServiceInfo icon={Tag} tone="green" label="Sample fee">
          {SERVICE.sampleFee}
        </ServiceInfo>
      </div>

      <ServiceInfo icon={Info} tone="blue">
        For clinical dietary needs, ask your GP about appropriate support.
      </ServiceInfo>

      <div className="pt-3 sm:pt-5">
        <Link href={wellbeingPath("healthy-eating", "practitioner")} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={Users} align="start">
            Choose a practitioner
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
