"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  ShoppingBag,
  Activity,
  Apple,
  Sparkles,
  FileText,
  User,
  Target,
  TrendingUp,
  Info,
  CheckCircle2,
  Heart,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BrandLogo } from "@/components/common/BrandLogo"

export default function WellbeingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "How do wellbeing sessions work?",
      a: "You'll have dedicated 1-to-1 conversations with a certified wellbeing practitioner to examine your current lifestyle, nutritional habits, sleep, and stress levels, setting attainable milestones that adapt to your personal schedule.",
    },
    {
      q: "Can I manage sessions in my account?",
      a: "Yes. You can book upcoming wellbeing calls, log daily check-ins, record progress notes, and adjust your personalized wellbeing roadmap directly inside your account.",
    },
    {
      q: "Is this a clinical service?",
      a: "Wellbeing support is a preventive and lifestyle-focused service designed to complement, not replace, clinical medical care. If medical diagnosis or prescription is required, our GP services are readily available.",
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
                Wellbeing
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Small steps.<br />
                Better everyday<br />
                wellbeing.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Practical support for your routines, food choices and time to recharge.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#support-options"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Explore wellbeing sessions</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#wellbeing-shop"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Visit Wellbeing Shop</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/home-wellbeing.png"
                  alt="Wellbeing consultation with tea"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHOOSE THE SUPPORT THAT MATTERS TO YOU matching Figma */}
        <section id="support-options" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#EFF9F5] border border-[#DDEFE5] rounded-3xl p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Choose the support that matters to you
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Practical tools and guidance for a healthier, more balanced you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lifestyle coaching */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Lifestyle coaching</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Build realistic routines.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
                >
                  <span>Explore support</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Healthy eating support */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Apple className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Healthy eating support</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Everyday food education.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
                >
                  <span>Explore support</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stress & relaxation */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Stress & relaxation</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Make space to recharge.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
                >
                  <span>Explore support</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. YOUR WELLBEING JOURNEY matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-3xl p-8 sm:p-12">
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your wellbeing journey
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Simple steps to get the right support for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0062F5] flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Choose your focus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pick the area you want to work on.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0062F5] flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Meet your practitioner</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect with an experienced wellbeing practitioner.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0062F5] flex items-center justify-center">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Agree practical goals</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Set realistic goals that fit your life.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center">
                    4
                  </div>
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0062F5] flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Check in on progress</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review and adjust your plan as you go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. A PLAN THAT FITS YOUR LIFE matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                A plan that fits your life
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Keep your goals, sessions and check-ins together.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>View my wellbeing plan</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="pb-3 border-b border-slate-100">
                  <BrandLogo variant="health" href="#" size="sm" />
                </div>

                <div className="flex items-center gap-6 pt-3 text-xs font-semibold border-b border-slate-100">
                  <span className="pb-2 text-[#0062F5] border-b-2 border-[#0062F5]">My sessions</span>
                  <span className="pb-2 text-slate-400">My wellbeing plan</span>
                  <span className="pb-2 text-slate-400">Check-in</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4 items-center">
                  <div className="sm:col-span-7 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Your goals</span>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>🌿</span>
                        <span>Daily routine</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>🍎</span>
                        <span>Food choices</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>🍵</span>
                        <span>Time to recharge</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="sm:col-span-5 bg-[#F0FDF4] rounded-2xl p-4 text-center flex flex-col items-center justify-center min-h-[130px]">
                    <span className="text-xs font-bold text-slate-800">Your wellbeing<br />in one place.</span>
                    <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-emerald-100 flex items-center justify-center mt-2 text-[#0062F5]">
                      <Heart className="w-4 h-4 text-[#0062F5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. WELLBEING SHOP matching Figma */}
        <section id="wellbeing-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Wellbeing Shop
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore products for your everyday routine.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore the shop</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pt-2">
                Food supplements are not a substitute for a varied diet.
              </p>
            </div>

            <div className="lg:col-span-6 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/service-prescriptions.webp"
                alt="Wellbeing and health products"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* 6. CALLOUT NOTICE matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#0062F5] shrink-0" />
            <span>Wellbeing support complements clinical care.</span>
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

        {/* 8. BOTTOM CTA BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-[#F0FDF4] via-[#ECFDF5] to-[#F0FDF4] rounded-3xl overflow-hidden border border-emerald-100 grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Make space for your wellbeing
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore our full range of wellbeing support, all in one place.
              </p>
              <div className="pt-2">
                <a
                  href="#support-options"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Explore wellbeing sessions</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/follow-up.webp"
                alt="Taking a quiet moment with tea at home"
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
