"use client"

import React from "react"
import Link from "next/link"
import {
  Asterisk,
  Building2,
  Calendar,
  CalendarPlus,
  ChevronRight,
  Crown,
  FileText,
  Globe,
  Monitor,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

type Tone = "green" | "blue"

const TONES: Record<Tone, { card: string; icon: string }> = {
  green: { card: "bg-[#F0FDF4] border-[#DCFCE7]", icon: "bg-emerald-100 text-emerald-600" },
  blue: { card: "bg-[#F0F7FF] border-[#E0EDFF]", icon: "bg-blue-100 text-[#0062F5]" },
}

interface ActionCard {
  title: string
  description: string
  href: string
  icon: LucideIcon
  tone: Tone
}

const BOOKING_OPTIONS: ActionCard[] = [
  { title: "Online GP", description: "Care wherever you are.", href: "/portal/online-gp", icon: Monitor, tone: "green" },
  { title: "Smart GP clinics", description: "Care in person.", href: "/portal/clinics", icon: Building2, tone: "blue" },
]

const YOUR_CARE: ActionCard[] = [
  { title: "Appointments", description: "View upcoming visits.", href: "/portal/appointments", icon: Calendar, tone: "green" },
  { title: "Health records", description: "Records and care plans.", href: "/portal/records", icon: FileText, tone: "blue" },
]

const ACCESS_OPTIONS: ActionCard[] = [
  { title: "Pay per visit", description: "Pay for the care you need.", href: "/portal/access/pay-per-visit", icon: Globe, tone: "green" },
  { title: "Membership", description: "Additional benefits, where available.", href: "/portal/access/membership", icon: Crown, tone: "blue" },
  { title: "Employer access", description: "Through an eligible employer or sponsor.", href: "/portal/access/employer", icon: Building2, tone: "blue" },
  { title: "Health plan access", description: "Check cover for your selected service.", href: "/portal/access/health-plan", icon: ShieldCheck, tone: "green" },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function CardLink({ card }: { card: ActionCard }) {
  const Icon = card.icon
  const tone = TONES[card.tone]
  return (
    <Link
      href={card.href}
      className={`${tone.card} border rounded-2xl p-4 flex items-start justify-between gap-3 hover:shadow-sm transition-shadow`}
    >
      <div>
        <div className={`w-10 h-10 rounded-xl ${tone.icon} flex items-center justify-center mb-4`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{card.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-3" />
    </Link>
  )
}

export default function PatientDashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name && !user.name.includes("@") ? user.name.split(" ")[0] : ""

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-sm text-slate-500" suppressHydrationWarning>
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          How can we help today?
        </h1>
      </div>

      <div className="space-y-3">
        <Link
          href="/portal/appointments/book"
          className="bg-[#0062F5] hover:bg-[#0052cc] text-white rounded-2xl px-4 py-4 flex items-center justify-between shadow-sm transition-colors"
        >
          <span className="flex items-center gap-3 font-semibold">
            <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5" />
            </span>
            Book an appointment
          </span>
          <ChevronRight className="w-5 h-5" />
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOOKING_OPTIONS.map((card) => <CardLink key={card.href} card={card} />)}
        </div>

        <Link
          href="/portal/follow-up"
          className={`${TONES.blue.card} border rounded-2xl p-4 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow`}
        >
          <span className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl ${TONES.blue.icon} flex items-center justify-center shrink-0`}>
              <Users className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900">For members and non-members</span>
              <span className="block text-xs text-slate-500 mt-0.5">Coordinated follow-up when needed.</span>
            </span>
          </span>
          <ChevronRight className="w-4 h-4 text-[#0062F5] shrink-0" />
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Your care</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {YOUR_CARE.map((card) => <CardLink key={card.href} card={card} />)}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ways to pay and access care</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose an option when you book.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCESS_OPTIONS.map((card) => <CardLink key={card.href} card={card} />)}
        </div>
      </section>

      <Link
        href="/portal/urgent-help"
        className="bg-red-50/70 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow"
      >
        <span className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Asterisk className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-red-600">Need urgent help?</span>
            <span className="block text-xs text-slate-500 mt-0.5">View emergency guidance.</span>
          </span>
        </span>
        <ChevronRight className="w-4 h-4 text-red-500 shrink-0" />
      </Link>
    </div>
  )
}
