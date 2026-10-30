"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Shield,
  Home,
  User,
  Clock,
  Search,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function InsurancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0) // 1st FAQ open matching Figma

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "Is LifeCome Health the insurer?",
      a: "LifeCome Health Benefits Limited distributes insurance products. The insurer provides the policy and makes claims decisions.",
    },
    {
      q: "Does linking a policy confirm cover?",
      a: "No. Linking a policy allows you to keep details together in your account. Specific eligibility and cover for any treatment must always be confirmed directly with your insurer.",
    },
    {
      q: "Who handles claims?",
      a: "Claims assessments and payouts are handled directly by your authorised insurance provider according to your policy terms.",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Insurance
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Explore cover.<br />
                Understand your<br />
                options.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Explore insurance products and keep policy, information together, with support for your next steps.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#insurance-products"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <span>Explore insurance</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <Link
                  href="/auth/login"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <span>Manage my policies</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/landing/couple-on-laptop.webp"
                  alt="Couple reviewing insurance cover on laptop"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Floating Shield Badge */}
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-md border border-slate-100 text-[#0062F5]">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. REGULATORY NOTICE BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-[#E8F3FF] border border-[#D4E7FC] rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-slate-600">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">
                Insurance enquiries through LifeCome Health Benefits Limited.
              </p>
              <p>Policies and claims are handled by the insurer.</p>
            </div>
          </div>
        </section>

        {/* 3. THREE PRODUCT CARDS matching Figma */}
        <section id="insurance-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#EFF9F5] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Health insurance</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Explore cover for private medical care.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Explore options</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Care-related cover</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Explore options related to care needs.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Explore options</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EFF9F5] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Personal protection</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Explore protection for life&apos;s uncertainties.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline"
              >
                <span>Explore options</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Product availability, terms and eligibility depend on the provider.</span>
          </div>
        </section>

        {/* 4. FROM ENQUIRY TO PROVIDER SUPPORT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#F0F7FD] border border-[#E4F0FB] rounded-3xl p-8 sm:p-12">
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                From enquiry to provider support
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Simple steps to help you find the right cover and connect with a provider.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center mb-4">
                    1
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Tell us what you need</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Answer a few questions about the type of cover you&apos;re interested in.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center mb-4">
                    2
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Review your enquiry</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    We&apos;ll confirm your details and share them with a relevant provider.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center mb-4">
                    3
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Continue with the provider</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    The provider will be in touch with next steps and further information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. YOUR POLICIES, IN ONE PLACE matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#F0F7FD] border border-[#E4F0FB] rounded-3xl p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your policies, in one place
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage your insurance information and support, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 cards in 2x2 grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-h-[108px] p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Link a policy</h4>
                    <p className="text-[10px] text-slate-400">Add a policy to your account.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="min-h-[108px] p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">My policies</h4>
                    <p className="text-[10px] text-slate-400">View your policy details and documents.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="min-h-[108px] p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Policy documents</h4>
                    <p className="text-[10px] text-slate-400">Access your policy documents.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="min-h-[108px] p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-xs transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Claims & support</h4>
                    <p className="text-[10px] text-slate-400">Get help with claims and policy questions.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Policy overview</h4>
                  <p className="text-[10px] text-slate-400">An overview of your linked policies and key information.</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-700 py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#0062F5]" />
                    <span className="font-semibold">Provider</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-700 py-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#0062F5]" />
                    <span className="font-semibold">Policy documents</span>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-end pt-2 pr-2">
                <div className="absolute right-0 bottom-0 w-20 h-20 rounded-full bg-indigo-50" />
                <div className="absolute right-12 bottom-1 w-12 h-12 rounded-full bg-emerald-100" />
                <Image
                  src="/images/Document graphic badge.svg"
                  alt=""
                  width={68}
                  height={84}
                  className="relative mr-4"
                />
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 6. CHECK COVER BEFORE YOU BOOK matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Check cover before you book</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Check whether your policy may cover a specific service and confirm any authorisation with the provider.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button
                type="button"
                className="bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold px-6 py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Check service cover</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 max-w-[140px] leading-tight">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Linking a policy does not confirm cover for a service.</span>
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
                Quick answers to common questions about insurance.
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
                        className={`w-4 h-4 text-[#0062F5] transition-transform duration-200 shrink-0 ml-4 ${
                          isOpen ? "rotate-180" : ""
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

        {/* 8. BOTTOM BANNER matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-[#EFF9F5] border border-emerald-100 rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-center">
            <div className="sm:col-span-8 p-8 sm:p-10 flex flex-col lg:flex-row items-center sm:items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Need help with your next step?
                </h2>
                <p className="text-sm text-slate-600">
                  Get support with insurance enquiries and managing your policies.
                </p>
              </div>

              <button
                type="button"
                className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-8 py-3.5 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <span>Insurance support</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-4 relative h-40 sm:h-auto sm:min-h-36 sm:self-stretch w-full">
              <Image
                src="/images/landing/couple-on-laptop.webp"
                alt="Couple exploring insurance options on a laptop"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-[50%_22%]"
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
