"use client"

import Link from "next/link"
import { CalendarCheck, CalendarPlus, ClipboardCheck, Info, MessagesSquare, Target } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { ServiceInfo, ServiceRow, type ServiceRowItem } from "@/components/portal/services/shared"
import { PageContainer, PageHeader, TONES } from "@/components/portal/ui"
import { useSampleCheckIn } from "@/hooks/useWellbeingSession"
import { formatShortDate } from "@/lib/appointments"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { SAMPLE_PLAN, WELLBEING_CHECK_IN_PATH, WELLBEING_MESSAGE_PATH, WELLBEING_PLAN_PATH, wellbeingPath } from "@/lib/wellbeing"

const BLUE_ICONS = "[&>svg:first-child]:text-[#0062F5] [&>svg:last-child]:text-[#0062F5]"

const STEPS: ServiceRowItem[] = [
  { step: 1, title: "Choose one manageable daily habit", description: "Pick a habit that feels realistic for you.", href: `${WELLBEING_PLAN_PATH}/habit`, tone: "blue" },
  { step: 2, title: "Reflect on my week", description: "Notice what went well and what was challenging.", href: WELLBEING_CHECK_IN_PATH, tone: "green" },
  { step: 3, title: "Discuss progress next session", description: "Share what you've learned and decide on your next steps.", href: ROUTES.PORTAL.APPOINTMENTS, tone: "blue" },
]

export default function WellbeingPlanPage() {
  const checkIn = useSampleCheckIn()
  // The sample plan starts with its first step done, and a check-in completes the second
  const stepsDone = checkIn ? 2 : 1

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="My wellbeing plan" description="Build healthier habits with guidance and support." />

      <Notice icon={Info} title="Sample plan">
        This is a preview. Your plan and check-ins aren&apos;t saved to your account yet.
      </Notice>

      <ServiceInfo icon={Target} tone="green" title={SAMPLE_PLAN.goal}>
        {SAMPLE_PLAN.goalNote}
      </ServiceInfo>

      <ol className="space-y-2.5">
        {STEPS.map((item) => (
          <li key={item.title}>
            <ServiceRow item={item} />
          </li>
        ))}
      </ol>

      <section aria-labelledby="plan-progress" className={cn("border rounded-2xl px-4 py-3.5", TONES.blue.card)}>
        <div className="flex items-center justify-between gap-4">
          <h2 id="plan-progress" className="text-[17px] sm:text-lg font-bold text-slate-900">
            Progress
          </h2>
          <span className="text-sm font-semibold text-slate-600">
            {stepsDone} of {STEPS.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-labelledby="plan-progress"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={stepsDone}
          className="mt-2.5 h-2 rounded-full bg-blue-100 overflow-hidden"
        >
          <div className="h-full rounded-full bg-[#0062F5] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(stepsDone / STEPS.length) * 100}%` }} />
        </div>
      </section>

      <div className="space-y-2.5">
        <ServiceRow
          item={{
            title: "Weekly check-in",
            description: checkIn ? `Completed ${formatShortDate(checkIn)}` : "Not completed",
            href: WELLBEING_CHECK_IN_PATH,
            icon: CalendarCheck,
            tone: "blue",
          }}
        />
        <Link href={WELLBEING_CHECK_IN_PATH} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={ClipboardCheck} align="start">
            Complete check-in
          </ActionButtonContent>
        </Link>
        <Link href={wellbeingPath("lifestyle-coaching", "session")} className={actionButtonClass("soft", BLUE_ICONS)}>
          <ActionButtonContent icon={CalendarPlus} align="start">
            Book a session
          </ActionButtonContent>
        </Link>
        <Link href={WELLBEING_MESSAGE_PATH} className={actionButtonClass("soft", cn(TONES.green.card, "hover:bg-emerald-50", BLUE_ICONS))}>
          <ActionButtonContent icon={MessagesSquare} align="start">
            Message practitioner
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
