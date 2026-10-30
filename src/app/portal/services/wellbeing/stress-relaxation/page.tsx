"use client"

import Link from "next/link"
import { CalendarDays, ClipboardCheck, Database, Flower2, Info, LifeBuoy, Monitor, User, Users } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { ServiceInfo, ServiceRow, type ServiceRowItem } from "@/components/portal/services/shared"
import { PageContainer, PageHeader } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"
import { WELLBEING_SERVICES, wellbeingPath } from "@/lib/wellbeing"

const STRESS_RELAXATION = wellbeingPath("stress-relaxation")
const SERVICE = WELLBEING_SERVICES["stress-relaxation"]

const STEPS: ServiceRowItem[] = [
  { title: "Reflect on your routines", href: `${STRESS_RELAXATION}/routines`, icon: ClipboardCheck, tone: "green" },
  { title: "Explore general relaxation approaches", href: `${STRESS_RELAXATION}/approaches`, icon: User, tone: "blue" },
  { title: "Plan time to recharge", href: `${STRESS_RELAXATION}/recharge`, icon: CalendarDays, tone: "green" },
]

export default function StressRelaxationPage() {
  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <div className="flex items-center gap-3 sm:gap-5">
        <span aria-hidden className="w-16 h-16 sm:w-[92px] sm:h-[92px] rounded-2xl bg-[#F1F9F4] flex items-center justify-center shrink-0">
          <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
            <Flower2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
        </span>
        <PageHeader title="Stress & relaxation" description="A supportive space for everyday pressures." />
      </div>

      <ul className="space-y-2">
        {STEPS.map((item) => (
          <li key={item.href}>
            <ServiceRow item={item} />
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <ServiceInfo icon={Monitor} tone="blue" label={SERVICE.format}>
          {SERVICE.length}
        </ServiceInfo>
        <ServiceInfo icon={Database} tone="green" label="Sample fee">
          {SERVICE.sampleFee}
        </ServiceInfo>
      </div>

      <Notice icon={Info}>This is wellbeing support.</Notice>

      <div className="space-y-2.5 pt-3 sm:pt-5">
        <Link href={wellbeingPath("stress-relaxation", "practitioner")} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={Users} align="start">
            Choose a practitioner
          </ActionButtonContent>
        </Link>
        <Link href={ROUTES.PORTAL.URGENT_HELP} className={actionButtonClass("soft", "text-[#0062F5]")}>
          <ActionButtonContent icon={LifeBuoy} align="start">
            Need urgent help?
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
