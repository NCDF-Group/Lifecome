"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Users,
  Heart,
  Home,
  MessageSquare,
  FileText,
  Calendar,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BrandLogo } from "@/components/common/BrandLogo"

export default function ProfessionalCarePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0) // 1st FAQ open matching Figma

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "Who can request an assessment?",
      a: "Anyone can request an assessment — whether for yourself, a family member, parent, or a loved one you care for. We will guide you through each stage with compassion and expertise.",
    },
    {
      q: "When are costs confirmed?",
      a: "Costs and visiting schedules are fully transparent and confirmed after your initial in-person or remote care assessment, before any care services begin.",
    },
    {
      q: "Can I request changes to my care?",
      a: "Yes. Care needs naturally evolve. You can request routine adjustments, additional hours, or visit modifications at any time directly through your portal or by speaking with your dedicated care manager.",
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
                Professional Care
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Care shaped around<br />
                everyday life.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Personal support, practical help and companionship, starting with a conversation about your needs.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#assessment-section"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <Users className="w-4 h-4" />
                  <span>Request a care assessment</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#services-section"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <span>Explore care services</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/landing/elderly-woman-carer.webp"
                  alt="Professional caregiver supporting senior lady at home"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. FOUR PILLAR CARDS matching Figma */}
        <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#EFF9F5] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Personal care</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Support with everyday personal tasks.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Help at home</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Practical help to keep your home comfortable.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Companionship</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Friendly support and meaningful conversation.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Respite support</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Short-term support to give you a break.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Find out more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. FROM YOUR REQUEST TO AN AGREED CARE PLAN matching Figma */}
        <section id="assessment-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#F0F7FD] border border-[#E4F0FB] rounded-3xl p-8 sm:p-12">
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                From your request to an agreed care plan
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                A clear and supportive process, with you at the centre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <FileText className="w-4 h-4 text-[#0062F5]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Tell us about your needs</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Share what support would help.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <Users className="w-4 h-4 text-[#0062F5]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Meet for an assessment</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    A friendly conversation to understand your needs.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <FileText className="w-4 h-4 text-[#0062F5]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Review your proposal</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    We&apos;ll share a personalised support plan.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#0062F5]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Agree your care plan</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    When you&apos;re happy, we&apos;ll confirm the details.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Availability, visits and costs are confirmed after assessment.</span>
            </div>
          </div>
        </section>

        {/* 4. SUPPORT FOR YOU AND THOSE CLOSE TO YOU matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Photo */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full">
              <Image
                src="/images/landing/elderly-gentleman-carer.webp"
                alt="Carer serving tea to elderly gentleman"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Support for you and those close to you
                </h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Share what matters, preferred routines and the support you are looking for.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Your priorities</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Your preferred schedule</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">Your care preferences</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-8 py-3.5 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Start a care request</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. KEEP YOUR CARE ORGANISED matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Keep your care organised
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage requests, visit information and your care plan in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 cards in 2x2 grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">My care plan</h4>
                    <p className="text-[10px] text-slate-400">View your agreed plan.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Care visits</h4>
                    <p className="text-[10px] text-slate-400">See your upcoming visits.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">My care team</h4>
                    <p className="text-[10px] text-slate-400">Get in touch for help and advice.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Request care changes</h4>
                    <p className="text-[10px] text-slate-400">Ask for changes to your support.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-5 bg-[#F0F7FD] border border-[#E4F0FB] rounded-3xl p-5 sm:p-6">
              <BrandLogo variant="health" href="#" size="sm" />
              <div className="mt-4 grid min-h-[190px] grid-cols-[105px_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                <div className="space-y-1 text-[9px]">
                  <div className="flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-2 font-semibold text-[#0062F5]">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Care visits</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-2 text-slate-500">
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span>Messages</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-2 text-slate-500">
                    <FileText className="h-3 w-3 shrink-0" />
                    <span>My care plan</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-2 text-slate-500">
                    <Users className="h-3 w-3 shrink-0" />
                    <span>Care team</span>
                  </div>
                </div>

                <div className="relative rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-700">
                    <span>Upcoming care visits</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[8px] text-slate-400">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <span key={`${day}-${index}`}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {Array.from({ length: 21 }, (_, index) => (
                      <span key={index} className="h-4 rounded-sm border border-slate-100 bg-white" />
                    ))}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-[#0062F5]">
                      <Home className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h5 className="text-[9px] font-bold text-slate-900">Care visit</h5>
                      <p className="text-[8px] text-slate-400">Support at home</p>
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

        {/* 7. BOTTOM BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#EFF9F5] border border-emerald-100 rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-center">
            <div className="sm:col-span-8 p-8 sm:p-10 flex flex-col lg:flex-row items-center sm:items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Let&apos;s talk about the support you need
                </h2>
                <p className="text-sm text-slate-600">
                  A request does not confirm a care package or scheduled visits.
                </p>
              </div>

              <button
                type="button"
                className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-8 py-3.5 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <span>Request a care assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-4 relative h-40 sm:h-auto sm:min-h-36 sm:self-stretch w-full">
              <Image
                src="/images/landing/care-assessment-team.webp"
                alt="Care assessment team consultation"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-[50%_32%] sm:object-[27%_32%] lg:object-[50%_32%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F0FAF7] via-[#F0FAF7]/15 via-25% to-transparent to-45%" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
