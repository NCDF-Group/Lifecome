"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  FileText,
  Video,
  CheckCircle2,
  User,
  Sparkles,
  Heart,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function GpServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(1) // 2nd FAQ open matching Figma

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "Who can use online GP?",
      a: "Online GP video consultations are available for adults aged 18 and over who are physically located in England at the time of the appointment.",
    },
    {
      q: "What if I need an examination?",
      a: "Your GP may recommend an in-person appointment where needed. If a physical check is required, we will help you arrange a clinic visit quickly.",
    },
    {
      q: "How do I join my video appointment?",
      a: "You will receive a secure appointment link via email and in your LifeCome account. Simply click the link on your phone, tablet, or computer browser at your appointment time.",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb matching Figma */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">
              Home
            </Link>
            <span>/</span>
            <Link href="/gp-care" className="hover:text-slate-800">
              GP services
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Online GP</span>
          </nav>
        </div>

        {/* 1. HERO SECTION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GP Services
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Speak to a GP.<br />
                Wherever you feel<br />
                comfortable.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Private GP appointments by secure video, for adults aged 18+ physically in England.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/clinic-appointments"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Choose an appointment</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#how-it-works"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <span>How it works</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Hero Video Mockup Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none bg-slate-50 flex items-center justify-center">
                <Image
                  src="/images/Doctor smiling on laptop video consultation screen.svg"
                  alt="Doctor during an online video consultation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. A CLEAR PATH TO YOUR CONSULTATION matching Figma */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl border border-[#E4F0FB] bg-[#F0F7FD] p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                A clear path to your consultation
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Get the care you need in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Choose your GP and time</h3>
                  <ChevronRight className="w-4 h-4 text-[#0062F5]" />
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Pick a time that suits you and book online.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Complete your pre-appointment form</h3>
                  <ChevronRight className="w-4 h-4 text-[#0062F5]" />
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Tell us a bit about your health before your appointment.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Join your video appointment</h3>
                  <ChevronRight className="w-4 h-4 text-[#0062F5]" />
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Connect with your GP at your chosen time, from anywhere you feel comfortable.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 3. PREPARE & ONLINE APPOINTMENT CARD matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Prepare for appointment */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Prepare for your appointment
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  A few simple things can help make your consultation run smoothly.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">A quiet, private space</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Find a place where you can speak freely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">A reliable internet connection</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Use a stable Wi-Fi or mobile data connection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Your current medicines</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Have a list of the medicines you take, if any.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Any questions you want to discuss</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Make a note so you don&apos;t forget.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Your online appointment card matching Figma */}
            <div className="lg:col-span-5">
              <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your online appointment</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Details will be confirmed when you book.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center gap-3">
                    <User className="w-4 h-4 text-[#0062F5]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">GP</h4>
                      <p className="text-[11px] text-slate-400">Selected during booking</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#0062F5]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Date & time</h4>
                      <p className="text-[11px] text-slate-400">Selected during booking</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center gap-3">
                    <Video className="w-4 h-4 text-[#0062F5]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Video consultation</h4>
                      <p className="text-[11px] text-slate-400">Selected during booking</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/clinic-appointments"
                  className="w-full bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold py-3.5 rounded-[4px] flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span>Choose a time</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SUPPORT FOR YOUR HEALTH CONCERNS matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl border border-[#E0F2FE] bg-[#F0F9FF] p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Support for your health concerns
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Speak to a GP about a range of everyday health concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">General health</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Discuss new or ongoing symptoms and get advice on next steps.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0062F5] shrink-0 ml-2" />
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Medication reviews</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Talk about your current medicines and any questions you have.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0062F5] shrink-0 ml-2" />
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Follow-up care</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Get continued support for ongoing conditions and treatment plans.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0062F5] shrink-0 ml-2" />
            </div>
            </div>

            <div className="mt-4">
              <Link
                href="/clinic-appointments"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Menopause Care</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. CLEAR NEXT STEPS AFTER YOUR CONSULTATION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-3xl p-8 lg:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Clear next steps after your consultation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-8">
              View the information shared by your GP in your account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Appointment summary</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    A summary of your consultation notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Health records</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    View any information shared by your GP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Your care plan</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    See agreed next steps and recommendations.
                  </p>
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
                Quick answers to common questions about online GP appointments.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      isOpen || idx === 0 ? "border-[#0062F5]" : "border-blue-200"
                    }`}
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

        {/* 7. BOTTOM BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#EAF4FF] border border-blue-100 rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-center">
            <div className="sm:col-span-8 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Find a time that works for you
                </h2>
                <p className="text-sm text-slate-600">
                  Private GP appointments by secure video.
                </p>
              </div>

              <Link
                href="/clinic-appointments"
                className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-8 py-3.5 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <span>Choose an appointment</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="sm:col-span-4 relative h-40 sm:h-36 w-full">
              <Image
                src="/images/Consultation smile.svg"
                alt="Preview of booking an online GP appointment"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
