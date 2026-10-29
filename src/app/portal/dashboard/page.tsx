"use client"

import React, { useSyncExternalStore } from "react"
import {
  Asterisk,
  Building2,
  Calendar,
  CalendarPlus,
  Crown,
  FileText,
  Globe,
  HandHeart,
  IdCard,
  Leaf,
  ShieldCheck,
  Stethoscope,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ROUTES } from "@/lib/constants"
import { ActionCard, ActionRow, PageContainer, PageHeader, PrimaryActionLink, SectionHeading, type ActionItem } from "@/components/portal/ui"

const SERVICES: ActionItem[] = [
  { title: "GP", description: "Online, clinic & menopause care", href: `${ROUTES.PORTAL.SERVICES}/gp`, icon: Stethoscope, tone: "green" },
  { title: "Care", description: "Professional care & support", href: `${ROUTES.PORTAL.SERVICES}/care`, icon: HandHeart, tone: "blue" },
  { title: "Wellbeing", description: "Coaching, sessions & shop", href: `${ROUTES.PORTAL.SERVICES}/wellbeing`, icon: Leaf, tone: "blue" },
  { title: "Insurance", description: "Explore cover & manage policies", href: `${ROUTES.PORTAL.SERVICES}/insurance`, icon: ShieldCheck, tone: "green" },
]

const YOUR_CARE: ActionItem[] = [
  { title: "Appointments", description: "View upcoming visits.", href: ROUTES.PORTAL.APPOINTMENTS, icon: Calendar, tone: "green" },
  { title: "Health records", description: "Records and care plans.", href: ROUTES.PORTAL.RECORDS, icon: FileText, tone: "blue" },
]

const ACCESS_OPTIONS: ActionItem[] = [
  { title: "Pay per visit", description: "Pay for the care you need.", href: "/portal/access/pay-per-visit", icon: Globe, tone: "green" },
  { title: "Membership", description: "Additional benefits, where available.", href: "/portal/access/membership", icon: Crown, tone: "blue" },
  { title: "Employer access", description: "Through an eligible employer or sponsor.", href: "/portal/access/employer", icon: Building2, tone: "blue" },
  { title: "Health plan access", description: "Check cover for your selected service.", href: "/portal/access/health-plan", icon: ShieldCheck, tone: "green" },
]

const ACTIVITY: ActionItem[] = [
  { title: "Visits", description: "Appointments & care visits", href: ROUTES.PORTAL.APPOINTMENTS, icon: Calendar, tone: "green" },
  { title: "Health records", description: "Your records & care plans", href: ROUTES.PORTAL.RECORDS, icon: FileText, tone: "blue" },
]

const MEMBERSHIP: ActionItem = {
  title: "Membership & benefits",
  description: "View your access and funding",
  href: "/portal/membership",
  icon: IdCard,
  tone: "blue",
}

const URGENT_HELP: ActionItem = {
  title: "Need urgent help?",
  description: "View emergency guidance.",
  href: ROUTES.PORTAL.URGENT_HELP,
  icon: Asterisk,
  tone: "red",
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// The greeting depends on the patient's own clock, so the server renders a neutral one
const noopSubscribe = () => () => {}
const useGreeting = () =>
  useSyncExternalStore(noopSubscribe, () => getGreeting(new Date().getHours()), () => "Welcome back")

export default function PatientDashboardPage() {
  const { user } = useAuth()
  const greeting = useGreeting()
  const firstName = user?.name && !user.name.includes("@") ? user.name.split(" ")[0] : ""

  return (
    <PageContainer>
      <PageHeader eyebrow={`${greeting}${firstName ? `, ${firstName}` : ""}`} title="How can we help today?" />

      <section aria-label="Services" className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((item) => (
            <ActionCard key={item.href} item={item} iconVariant="circle" />
          ))}
        </div>
        <PrimaryActionLink href={ROUTES.PORTAL.BOOK} icon={CalendarPlus} className="mt-5">
          Book an appointment
        </PrimaryActionLink>
      </section>

      <section aria-labelledby="your-care" className="space-y-3">
        <SectionHeading id="your-care" title="Your care" />
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          {YOUR_CARE.map((item) => (
            <ActionCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section aria-labelledby="ways-to-pay" className="space-y-3">
        <SectionHeading id="ways-to-pay" title="Ways to pay and access care" description="Choose an option when you book." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCESS_OPTIONS.map((item) => (
            <ActionCard key={item.href} item={item} />
          ))}
        </div>
      </section>

      <section aria-labelledby="your-activity" className="space-y-3 pt-2">
        <SectionHeading id="your-activity" title="Your activity" />
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
          {ACTIVITY.map((item) => (
            <ActionCard key={item.title} item={item} iconVariant="circle" />
          ))}
        </div>
        <ActionRow item={MEMBERSHIP} />
      </section>

      <ActionRow item={URGENT_HELP} titleClassName="text-red-600" />
    </PageContainer>
  )
}
