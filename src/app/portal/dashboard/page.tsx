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
import { ActionRow, PageContainer, PageHeader, PrimaryActionLink, SectionHeading, type ActionItem } from "@/components/portal/ui"

const SERVICES: ActionItem[] = [
  { title: "GP", description: "Online, clinic & menopause care", href: ROUTES.PORTAL.BOOK, icon: Stethoscope, tone: "green" },
  { title: "Care", description: "Professional care & support", href: `${ROUTES.PORTAL.SERVICES}/care`, icon: HandHeart, tone: "blue" },
  { title: "Wellbeing", description: "Coaching, sessions & shop", href: ROUTES.PORTAL.WELLBEING, icon: Leaf, tone: "blue" },
  { title: "Insurance", description: "Explore cover & manage policies", href: `${ROUTES.PORTAL.SERVICES}/insurance`, icon: ShieldCheck, tone: "green" },
]

const YOUR_CARE: ActionItem[] = [
  { title: "Appointments", description: "View upcoming visits.", href: ROUTES.PORTAL.APPOINTMENTS, icon: Calendar, tone: "green" },
  { title: "Health records", description: "Records and care plans.", href: ROUTES.PORTAL.RECORDS, icon: FileText, tone: "blue" },
]

const ACCESS_OPTIONS: ActionItem[] = [
  { title: "Pay per visit", description: "Pay for the care you need.", href: "/portal/access/pay-per-visit", icon: Globe, tone: "green" },
  { title: "Membership", description: "Additional benefits, where available.", href: `${ROUTES.PORTAL.PROFILE}/membership/lifecome`, icon: Crown, tone: "blue" },
  { title: "Employer access", description: "Through an eligible employer or sponsor.", href: `${ROUTES.PORTAL.PROFILE}/membership/employer`, icon: Building2, tone: "blue" },
  { title: "Health plan access", description: "Check cover for your selected service.", href: `${ROUTES.PORTAL.PROFILE}/membership/insurance`, icon: ShieldCheck, tone: "green" },
]

const ACTIVITY: ActionItem[] = [
  { title: "Visits", description: "Appointments & care visits", href: ROUTES.PORTAL.APPOINTMENTS, icon: Calendar, tone: "green" },
  { title: "Health records", description: "Your records & care plans", href: ROUTES.PORTAL.RECORDS, icon: FileText, tone: "blue" },
]

const MEMBERSHIP: ActionItem = {
  title: "Membership & benefits",
  description: "View your access and funding",
  href: `${ROUTES.PORTAL.PROFILE}/membership`,
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
    <PageContainer className="max-w-[1200px] space-y-6 sm:space-y-7">
      <PageHeader
        eyebrow={`${greeting}${firstName ? `, ${firstName}` : ""}`}
        title="How can we help today?"
        description={
          <span className="block max-w-xl">Access quality healthcare, manage your appointments, and stay healthy with personalised care.</span>
        }
      />

      <section aria-label="Services" className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {SERVICES.map((item) => (
            <ActionRow key={item.href} item={item} size="lg" />
          ))}
        </div>
        <PrimaryActionLink href={ROUTES.PORTAL.BOOK} icon={CalendarPlus}>
          Book an appointment
        </PrimaryActionLink>
      </section>

      <section aria-labelledby="your-care" className="space-y-3">
        <SectionHeading id="your-care" title="Your care" action={{ label: "View all", href: ROUTES.PORTAL.APPOINTMENTS }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {YOUR_CARE.map((item) => (
            <ActionRow key={item.title} item={item} size="lg" />
          ))}
        </div>
      </section>

      <section aria-labelledby="ways-to-pay" className="space-y-3">
        <SectionHeading id="ways-to-pay" title="Ways to pay and access care" description="Choose an option when you book." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {ACCESS_OPTIONS.map((item) => (
            <ActionRow key={item.href} item={item} size="lg" />
          ))}
        </div>
      </section>

      <section aria-labelledby="your-activity" className="space-y-3">
        <SectionHeading id="your-activity" title="Your activity" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {ACTIVITY.map((item) => (
            <ActionRow key={item.title} item={item} size="lg" />
          ))}
          <div className="sm:col-span-2">
            <ActionRow item={MEMBERSHIP} />
          </div>
        </div>
      </section>

      <ActionRow item={URGENT_HELP} titleClassName="text-red-600" />
    </PageContainer>
  )
}
