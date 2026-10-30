"use client"

import { FileText, HeartPulse, Hospital, Info, Leaf, MessageSquareText, Video } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { ServiceRow, ServiceTile } from "@/components/portal/services/shared"
import { PageContainer, PageHeader, SectionHeading, type ActionItem } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"

const BOOK = ROUTES.PORTAL.BOOK

const WAYS_TO_BOOK: ActionItem[] = [
  { title: "Online GP", description: "Speak to a GP by video", href: ROUTES.PORTAL.BOOK_ONLINE_GP, icon: Video, tone: "blue" },
  { title: "In-clinic GP", description: "See a GP in person", href: `${BOOK}/clinic`, icon: Hospital, tone: "green" },
]

const MENOPAUSE_CARE: ActionItem = {
  title: "Menopause Care",
  description: "Assessment, consultation and ongoing review",
  href: `${BOOK}/menopause`,
  icon: Leaf,
  tone: "green",
}

const YOUR_GP_CARE: ActionItem[] = [
  { title: "Health records", description: "Notes, prescriptions, referrals and results", href: ROUTES.PORTAL.RECORDS, icon: FileText, tone: "blue" },
  { title: "Your care plan", description: "Next steps after your consultation", href: ROUTES.PORTAL.CARE_PLANS, icon: HeartPulse, tone: "blue" },
  { title: "Message your GP team", description: "Support with your existing care", href: `${ROUTES.PORTAL.NEW_MESSAGE}?team=gp&topic=follow_up`, icon: MessageSquareText, tone: "blue" },
]

export default function BookAppointmentPage() {
  return (
    <PageContainer wide className="space-y-6 sm:space-y-7">
      <PageHeader title="Book an appointment" description="Choose how you'd like to see a GP." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {WAYS_TO_BOOK.map((item) => (
          <ServiceTile key={item.href} item={item} />
        ))}
      </div>

      <section aria-labelledby="specialist-support" className="space-y-3">
        <SectionHeading id="specialist-support" title="Specialist support" />
        <ServiceRow item={MENOPAUSE_CARE} size="home" />
      </section>

      <section aria-labelledby="your-gp-care" className="space-y-3">
        <SectionHeading id="your-gp-care" title="Your GP care" />
        <ul className="space-y-3 sm:space-y-4">
          {YOUR_GP_CARE.map((item) => (
            <li key={item.href}>
              <ServiceRow item={item} size="home" />
            </li>
          ))}
        </ul>
      </section>

      <Notice icon={Info}>Illustrative consultation prices are shown before confirmation.</Notice>
    </PageContainer>
  )
}
