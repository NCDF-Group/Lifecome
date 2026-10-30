"use client"

import { Apple, CalendarDays, FileText, Flower2, Info, Leaf, ShoppingBag } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { ServiceRow } from "@/components/portal/services/shared"
import { PageContainer, PageHeader, SectionHeading, type ActionItem } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"
import { WELLBEING_PLAN_PATH } from "@/lib/wellbeing"

const WELLBEING = ROUTES.PORTAL.WELLBEING

const SERVICES: ActionItem[] = [
  { title: "Lifestyle coaching", description: "Build realistic routines.", href: `${WELLBEING}/lifestyle-coaching`, icon: Leaf, tone: "green" },
  { title: "Healthy eating support", description: "Everyday food education.", href: `${WELLBEING}/healthy-eating`, icon: Apple, tone: "blue" },
  { title: "Stress & relaxation", description: "Make space to recharge.", href: `${WELLBEING}/stress-relaxation`, icon: Flower2, tone: "blue" },
  { title: "Wellbeing Shop", description: "Products for your routine.", href: `${WELLBEING}/shop`, icon: ShoppingBag, tone: "blue" },
]

const YOUR_WELLBEING: ActionItem[] = [
  { title: "My wellbeing plan", description: "Set goals and track your progress.", href: WELLBEING_PLAN_PATH, icon: FileText, tone: "green" },
  { title: "My sessions", description: "View and manage your sessions.", href: ROUTES.PORTAL.APPOINTMENTS, icon: CalendarDays, tone: "blue" },
]

function RowList({ items }: { items: ActionItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.href}>
          <ServiceRow item={item} size="lg" />
        </li>
      ))}
    </ul>
  )
}

export default function WellbeingPage() {
  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="Wellbeing" description="Small steps for everyday wellbeing." />
      <RowList items={SERVICES} />
      <section aria-labelledby="your-wellbeing" className="space-y-3">
        <SectionHeading id="your-wellbeing" title="Your wellbeing" />
        <RowList items={YOUR_WELLBEING} />
      </section>
      <Notice icon={Info}>Wellbeing support complements clinical care.</Notice>
    </PageContainer>
  )
}
