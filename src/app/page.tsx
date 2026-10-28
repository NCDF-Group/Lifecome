"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Monitor,
  Moon,
  Users,
  Shield,
  Building2,
  Sparkles,
  Calendar,
  Clock,
  User,
  MessageSquare,
  FileText,
  Heart,
  Plus,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BrandLogo } from "@/components/common/BrandLogo"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "How do I book a GP appointment?",
      a: "You can book online in just a few minutes. Select whether you prefer a video consultation from home or an in-person appointment at one of our clinics, choose your preferred time and date, and confirm your details.",
    },
    {
      q: "How do care assessments work?",
      a: "A care assessment begins with a friendly consultation to understand your routine, personal priorities, and support requirements. Our team then prepares a bespoke care proposal tailored to your daily life.",
    },
    {
      q: "How can I explore insurance?",
      a: "Our insurance guidance helps you understand private health cover, care-related policies, and protection plans. You can review available products and connect with authorised providers seamlessly.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Connected Health & Care
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Your health.<br />
                Your care. One place.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                GP appointments, everyday wellbeing, professional care and insurance support — connected around you.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/clinic-appointments"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a GP appointment</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/gp-care"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <span>Explore our services</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Hero Image matching Figma */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/Smiling doctor in consultation.svg"
                  alt="Smiling doctor in consultation with a patient"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Floating Badge matching Figma */}
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md py-2 px-4 rounded-full shadow-md border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Monitor className="w-3 h-3" />
                  </div>
                  <span>Online & in-clinic GP</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FOUR PILLAR CARDS matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* GP Services */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">GP services</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Appointments online and in person.
                </p>
              </div>
              <Link
                href="/gp-care"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Wellbeing */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Moon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Wellbeing</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Support for your everyday health.
                </p>
              </div>
              <Link
                href="/wellbeing"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Professional Care */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Professional Care</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Support around your everyday needs.
                </p>
              </div>
              <Link
                href="/professional-care"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Insurance */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Insurance</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Explore cover and manage policies.
                </p>
              </div>
              <Link
                href="/insurance"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. A GP APPOINTMENT THAT FITS YOUR DAY matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A GP appointment that fits your day
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Choose how to see a GP, online or in person.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Online GP */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Online GP</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Speak to a GP by secure video.
                </p>
              </div>
              <Link
                href="/gp-services"
                className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
              >
                <span>Book online</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Clinic appointments */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062F5] flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Clinic appointments</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Meet a GP in person.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-6 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3 px-4 rounded-[4px] flex items-center justify-center gap-1 transition-colors"
              >
                <span>Find a clinic</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Explore Menopause Care */}
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Explore Menopause Care</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Assessment, care options and reviews.
                </p>
              </div>
              <Link
                href="/gp-care"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>For adults aged 18+ physically in England.</span>
          </div>
          </div>
        </section>

        {/* 4. SUPPORT BEYOND YOUR APPOINTMENT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Support beyond your appointment
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Expert support for your everyday health and care needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Wellbeing */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 sm:grid-cols-12 hover:shadow-md transition-shadow">
              <div className="sm:col-span-5 relative h-48 sm:h-auto min-h-[160px]">
                <Image
                  src="/images/Wellbeing lifestyle support.svg"
                  alt="Wellbeing lifestyle support"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Wellbeing</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Lifestyle support, healthy eating guidance and stress management.
                  </p>
                </div>
                <Link
                  href="/wellbeing"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
                >
                  <span>Explore Wellbeing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Professional Care */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 sm:grid-cols-12 hover:shadow-md transition-shadow">
              <div className="sm:col-span-5 relative h-48 sm:h-auto min-h-[160px]">
                <Image
                  src="/images/Container.svg"
                  alt="Professional Care assistant"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Professional Care</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Support with everyday needs, care assessments and tailored plans.
                  </p>
                </div>
                <Link
                  href="/professional-care"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
                >
                  <span>Explore Professional Care</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 5. ONE ACCOUNT, CONNECTED SUPPORT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                One account, connected support
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Manage appointments, messages and plans in one place.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] transition-colors shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Log in to your account</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup UI matching Figma */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <BrandLogo variant="health" href="#" size="sm" />
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 text-xs font-semibold border-b border-slate-100 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
                  <div className="flex items-center gap-1.5 pb-2 border-b-2 border-[#0062F5] text-[#0062F5]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Visits</span>
                  </div>
                  <div className="flex items-center gap-1.5 pb-2 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Messages</span>
                  </div>
                  <div className="flex items-center gap-1.5 pb-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Records</span>
                  </div>
                  <div className="flex items-center gap-1.5 pb-2 text-slate-400">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Care plans</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-5 items-center">
                  <div className="sm:col-span-7 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your visits
                    </span>
                    <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Monitor className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">GP appointment</h4>
                          <p className="text-[10px] text-slate-400">Online appointment</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Clinic appointment</h4>
                          <p className="text-[10px] text-slate-400">In-person appointment</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="sm:col-span-5 bg-[#F0FDF4] rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[140px]">
                    <div className="absolute w-20 h-20 rounded-full bg-emerald-200/50 -bottom-6 -left-6 blur-sm" />
                    <div className="relative z-10">
                      <h5 className="text-xs font-bold text-slate-800 leading-tight">
                        Your care,<br />all in one place.
                      </h5>
                      <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center mx-auto mt-3 text-[#0062F5]">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently asked questions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Quick answers to common questions.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 hover:text-[#0062F5]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                          isOpen ? "rotate-180 text-[#0062F5]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CTA BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-[#F0FDF4] via-[#ECFDF5] to-[#F0FDF4] rounded-3xl overflow-hidden border border-emerald-100 grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find the right support for you
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore our full range of services, all in one place.
              </p>
              <div className="pt-2">
                <Link
                  href="/gp-care"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Explore our services</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/Right CTA Image.svg"
                alt="Smiling man at LifeCome Health"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
