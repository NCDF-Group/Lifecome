"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Monitor,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  FlaskConical,
  Sparkles,
  FileText,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function GpCarePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(2) // 3rd FAQ open by default matching Figma

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "Can I choose online or in-clinic?",
      a: "Yes. You can select either a secure video consultation from wherever you are or book an in-person visit at one of our welcoming clinic locations.",
    },
    {
      q: "What should I prepare?",
      a: "Have a list of any current medications you take, note down the primary symptoms or questions you wish to discuss, and ensure you have a quiet, private space if joining by video.",
    },
    {
      q: "Will I receive a prescription?",
      a: "Prescriptions are issued only where clinically appropriate. If prescribed, electronic prescriptions can be sent directly to your nominated pharmacy for collection or home delivery.",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GP Services
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                GP care, online<br />and in person.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Choose how you see a GP, with care built around your needs.
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
                  href="/clinic-appointments"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <span>Find a clinic</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>For adults aged 18+ physically in England.</span>
              </div>
            </div>

            {/* Right Hero Image matching Figma */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/landing/female-doctor-consultation.webp"
                  alt="Doctor with patient discussing GP care"
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
                  <span>Video or in-clinic GP</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHOOSE YOUR APPOINTMENT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl border border-blue-50 bg-[#F4F8FE] p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
              Choose your appointment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Online GP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Online GP</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Speak to a GP by secure video.
                </p>
              </div>
              <Link
                href="/gp-services"
                className="mt-8 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-sm font-semibold py-3.5 px-4 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Book online</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Clinic appointments */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0062F5] flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Clinic appointments</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Meet a GP in person.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-8 w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-sm font-semibold py-3.5 px-4 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Find a clinic</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          </div>
        </section>

        {/* 3. WHAT WOULD YOU LIKE TO DISCUSS? matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            What would you like to discuss?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* General consultation */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">General consultation</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Discuss a new or ongoing health concern.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Medication review */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Medication review</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Review your current medication and ask questions.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Follow-up appointment */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Follow-up appointment</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Continue your care and discuss next steps.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Menopause Care */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Menopause Care</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Assessment, care options and ongoing support.
                </p>
              </div>
              <Link
                href="/clinic-appointments"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. MENOPAUSE BANNER CARD matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#F8FCFF] border border-[#EDF6FF] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/landing/doctor-listening-patient.webp"
                alt="Doctor listening attentively to patient during consultation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Menopause care,<br />with time to listen.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Discuss symptoms, treatment options and ongoing support with a GP.
              </p>
              <div className="pt-2">
                <Link
                  href="/clinic-appointments"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#0062F5] hover:underline"
                >
                  <span>Explore Menopause Care</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FROM BOOKING TO YOUR NEXT STEPS matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-10">
            From booking to your next steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Choose appointment</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Book online or find a clinic that suits you.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Share your details</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Provide a few details before your appointment.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Meet your GP</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Speak to a GP online or in person.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">View your care plan</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Receive a consultation summary and next steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. YOUR CARE CONTINUES AFTER THE APPOINTMENT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#F7FAFF] border border-blue-50 rounded-3xl p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-blue-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Your care continues after the appointment
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Manage your consultation summary, health records and care plan in one place.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold px-6 py-2.5 rounded-[4px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <span>Log in</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Consultation summary</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    View notes from your appointment.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Health records</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    See your record of consultations.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Clinical care plan</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Review your agreed next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently asked questions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Quick answers to common questions about GP services.
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

        {/* 8. BOTTOM CTA BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-[#ECFDF5] via-[#F6FAFF] to-[#EFF6FF] rounded-3xl overflow-hidden border border-[#DDEDFB] grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Ready to speak to a GP?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Book an appointment online or find a clinic near you.
              </p>
              <div className="pt-2">
                <Link
                  href="/clinic-appointments"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Book a GP appointment</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/landing/male-doctor-corridor.webp"
                alt="Smiling male doctor in hospital corridor"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
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
