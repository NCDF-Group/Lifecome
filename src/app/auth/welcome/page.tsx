"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Monitor,
  Moon,
  Users,
  Shield,
  Calendar,
  MessageSquare,
  User,
  Info,
} from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { useAuth } from "@/context/AuthContext"

function WelcomeContent() {
  const { user } = useAuth()
  const name = user?.name || ""

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <BrandLogo variant="health" href="/portal/dashboard" />

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/portal/services/gp-services" className="hover:text-[#0062F5] transition-colors">
              GP services
            </Link>
            <Link href="/portal/services/wellbeing" className="hover:text-[#0062F5] transition-colors">
              Wellbeing
            </Link>
            <Link href="/portal/services/professional-care" className="hover:text-[#0062F5] transition-colors">
              Professional Care
            </Link>
            <Link href="/portal/services/insurance" className="hover:text-[#0062F5] transition-colors">
              Insurance
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full bg-white hover:border-slate-300"
            >
              <Image
                src="/images/uk-flag.svg"
                alt="United Kingdom flag"
                width={20}
                height={10}
                className="h-[10px] w-5"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Help
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content matching Figma */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Celebration Checkmark */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
            {/* Radial Green Burst rays */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                <line x1="40" y1="5" x2="40" y2="15" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="65" x2="40" y2="75" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="5" y1="40" x2="15" y2="40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="65" y1="40" x2="75" y2="40" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="15" y1="15" x2="22" y2="22" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="58" x2="65" y2="65" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="15" y1="65" x2="22" y2="58" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="22" x2="65" y2="15" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Green Center Circle */}
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to LifeCome Health{name ? `, ${name}` : ""}.
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-3 max-w-xl">
            Your account is ready. Choose where you&apos;d like to start.
          </p>
        </div>

        {/* 4 Cards Grid matching Figma */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: GP services */}
          <div className="bg-[#F0FDF4]/60 border border-[#DCFCE7] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">GP services</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Appointments online and in person.
              </p>
            </div>
            <Link
              href="/portal/appointments/book"
              className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Book a GP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Wellbeing */}
          <div className="bg-[#F0F9FF]/70 border border-[#E0F2FE] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Wellbeing</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Practical support for everyday wellbeing.
              </p>
            </div>
            <Link
              href="/portal/services/wellbeing"
              className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Explore Wellbeing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Professional Care */}
          <div className="bg-[#F0FDF4]/60 border border-[#DCFCE7] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Professional Care</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Start with a care assessment request.
              </p>
            </div>
            <Link
              href="/portal/services/professional-care"
              className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Explore Care</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Insurance */}
          <div className="bg-[#F0F9FF]/70 border border-[#E0F2FE] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Insurance</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Explore cover and manage policies.
              </p>
            </div>
            <Link
              href="/portal/services/insurance"
              className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Explore Insurance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Banner Card matching Figma */}
        <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-3xl p-8 lg:p-10 flex flex-col items-center">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-blue-100">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Your account, all in one place
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Manage your appointments, messages and personal details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Visits</h4>
                  <p className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                    View your appointments and past visits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Messages</h4>
                  <p className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                    Read and manage messages from our team.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Profile</h4>
                  <p className="text-[11px] text-slate-500 max-w-[140px] leading-tight">
                    Update your details and preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col items-center gap-3">
            <Link
              href="/portal/dashboard"
              className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-8 py-3.5 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Go to my dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>
                No appointments, care services or insurance products have been
                booked during setup.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching Figma */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <BrandLogo variant="health" href="/portal/dashboard" size="sm" />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/portal/services/gp-services" className="hover:text-[#0062F5]">
              GP services
            </Link>
            <Link href="/portal/services/wellbeing" className="hover:text-[#0062F5]">
              Wellbeing
            </Link>
            <Link href="/portal/services/professional-care" className="hover:text-[#0062F5]">
              Professional Care
            </Link>
            <Link href="/portal/services/insurance" className="hover:text-[#0062F5]">
              Insurance
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0062F5]">
              Contact
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Accessibility
            </Link>
          </div>

          <div className="text-slate-400">
            <span>Website design preview</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  )
}
