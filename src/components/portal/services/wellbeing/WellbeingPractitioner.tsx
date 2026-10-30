"use client"

import Link from "next/link"
import { Calendar, ChevronLeft, Clock, Database, FileText, MessageCircleMore, Monitor } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { Avatar, IconBadge, PageContainer, PageHeader, TONES, type Tone } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { SAMPLE_PRACTITIONER, WELLBEING_SERVICES, wellbeingPath, type WellbeingServiceId } from "@/lib/wellbeing"
import { EYEBROW, ServiceRow } from "../shared"

export function WellbeingPractitioner({ serviceId }: { serviceId: WellbeingServiceId }) {
  const service = WELLBEING_SERVICES[serviceId]
  const details: { icon: typeof Monitor; tone: Tone; label: string }[] = [
    { icon: Monitor, tone: "green", label: service.format },
    { icon: Clock, tone: "blue", label: service.length },
    { icon: MessageCircleMore, tone: "green", label: SAMPLE_PRACTITIONER.language },
    { icon: Database, tone: "blue", label: `Sample fee ${service.sampleFee}` },
  ]

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="Wellbeing practitioner" />

      <div className={cn("border rounded-2xl p-4 flex items-center gap-3 sm:gap-3.5", TONES.blue.card)}>
        <Avatar name={SAMPLE_PRACTITIONER.name} tone="blue" className="w-14 h-14 text-lg" />
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{SAMPLE_PRACTITIONER.name}</p>
          <p className="text-[15px] text-slate-600 leading-snug">{SAMPLE_PRACTITIONER.role}</p>
          <p className="text-sm text-slate-500 leading-snug">Sample profile.</p>
        </div>
      </div>

      <ServiceRow item={{ eyebrow: "Focus", title: service.title, href: wellbeingPath(serviceId), icon: service.icon, tone: "green" }} />

      <div className={cn("border rounded-2xl p-3.5 flex items-center gap-3 sm:gap-3.5", TONES.blue.card)}>
        <IconBadge icon={FileText} tone="blue" className="sm:w-11 sm:h-11" />
        <div className="min-w-0">
          <p className={EYEBROW}>About</p>
          <p className="text-sm sm:text-[15px] text-slate-700 leading-snug">{SAMPLE_PRACTITIONER.about}</p>
        </div>
      </div>

      <section aria-labelledby="practitioner-details" className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 pt-3.5 pb-1.5">
        <h2 id="practitioner-details" className={EYEBROW}>
          Details
        </h2>
        <ul className="mt-1 divide-y divide-slate-100">
          {details.map(({ icon, tone, label }) => (
            <li key={label} className="flex items-center gap-3 py-2.5">
              <IconBadge icon={icon} tone={tone} variant="tinted" size="sm" />
              <span className="text-[15px] sm:text-base font-semibold text-slate-900">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-2.5 pt-3 sm:pt-5">
        <Link href={wellbeingPath(serviceId, "session")} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={Calendar} align="start">
            Choose a session
          </ActionButtonContent>
        </Link>
        <Link href={ROUTES.PORTAL.WELLBEING} className={actionButtonClass("soft", "justify-center gap-1.5 text-[#0062F5]")}>
          <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden />
          Back to wellbeing
        </Link>
      </div>
    </PageContainer>
  )
}
