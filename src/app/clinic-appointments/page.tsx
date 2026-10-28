"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Monitor,
  Search,
  MessageSquare,
  Stethoscope,
  FileText,
  Clock,
  User,
  FlaskConical,
  Sparkles,
  RefreshCw,
  Mail,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { appointmentService } from "@/services/appointment.service"
import type { OperatingClinic } from "@/services/appointment.service"
import { getApiErrorMessage } from "@/lib/api-client"

export default function ClinicAppointmentsPage() {
  const [locationQuery, setLocationQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [clinicResults, setClinicResults] = useState<OperatingClinic[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleClinicSearch = async () => {
    setIsSearching(true)
    setSearchError(null)
    setHasSearched(true)
    try {
      const clinics = await appointmentService.getClinics()
      const query = locationQuery.trim().toLocaleLowerCase()
      setClinicResults(query
        ? clinics.filter((clinic) => [clinic.name, clinic.city, clinic.address, clinic.postcode]
            .some((value) => value.toLocaleLowerCase().includes(query)))
        : clinics)
    } catch (cause) {
      setSearchError(getApiErrorMessage(cause, "Unable to load clinics. Please try again."))
      setClinicResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const faqs = [
    {
      q: "How do I choose a clinic?",
      a: "Enter your postcode or town in the clinic search bar above. You'll see a list of nearby LifeCome clinics with current appointment availability and location details.",
    },
    {
      q: "What should I bring?",
      a: "Please bring a valid photo ID, a list of any current medications you take, and any relevant recent test results or medical letters.",
    },
    {
      q: "Can I switch to online GP?",
      a: "Yes. If your schedule changes, you can easily change to a secure video appointment through your LifeCome account or by contacting patient support.",
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
            <span className="text-slate-800 font-medium">Clinic appointments</span>
          </nav>
        </div>

        {/* 1. HERO SECTION matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GP Services
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                GP care, in person.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Meet a GP in a calm, welcoming clinic and discuss your health face to face.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#search-clinics"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-all shadow-xs group"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Find a clinic</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <Link
                  href="/gp-services"
                  className="border border-[#0062F5] text-[#0062F5] hover:bg-blue-50/50 font-medium px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors group"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Explore online GP</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>For adults aged 18+ physically in England.</span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/images/clinic-hero.png"
                  alt="Doctor with patient in person clinic consultation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. FIND YOUR CLINIC SEARCH BAR matching Figma */}
        <section id="search-clinics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Find your clinic</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Search by town or postcode to see current clinic locations.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Enter location"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleClinicSearch}
                  disabled={isSearching}
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold px-6 py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                >
                  <span>{isSearching ? "Searching…" : "Search clinics"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Current clinic locations appear after your search.
              </p>
            </div>
          </div>
          {searchError && <p role="alert" className="mt-4 text-sm text-red-700">{searchError}</p>}
          {hasSearched && !isSearching && !searchError && clinicResults.length === 0 && (
            <p role="status" className="mt-4 text-sm text-slate-600">No clinics match that location.</p>
          )}
          {clinicResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinicResults.map((clinic) => (
                <article key={clinic.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="font-bold text-slate-900">{clinic.name}</h4>
                  <p className="mt-1 text-sm text-slate-600">{clinic.address}, {clinic.city} {clinic.postcode}</p>
                  {clinic.accessibilityDetails && <p className="mt-3 text-xs text-slate-500">{clinic.accessibilityDetails}</p>}
                  {clinic.phone && <a className="mt-3 inline-block text-sm font-semibold text-[#0062F5]" href={`tel:${clinic.phone}`}>{clinic.phone}</a>}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 3. WHAT TO EXPECT matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What to expect
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Person-centred care in a calm, welcoming clinic environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Time to discuss<br />your concerns
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A dedicated appointment to talk through your symptoms, questions and health needs.
              </p>
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                An examination<br />where appropriate
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Your GP can carry out an examination if needed, in a safe and comfortable setting.
              </p>
            </div>

            <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Clear next steps
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                You&apos;ll get a clear plan for your care, including any follow-up, tests or prescriptions if appropriate.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PLAN YOUR VISIT WITH RECEPTION PHOTO matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Reception Photo */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] w-full">
              <Image
                src="/images/clinic-reception.png"
                alt="Patient at LifeCome Health clinic check-in desk"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Right Steps: Plan your visit */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Plan your visit
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  A few simple steps to help you get the most from your appointment.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Choose a clinic and appointment
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Search for a clinic and pick a date and time that works for you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Complete your pre-appointment form
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provide some information before your visit to help us prepare.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Bring your medicines list
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Include any prescribed or over-the-counter medicines you take.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0062F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Check access and arrival details
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review the clinic location and any access information before you go.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. COMMON CLINIC SERVICES matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Common clinic services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              A range of GP appointments to support your health needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">General consultations</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Get help with a wide range of symptoms, concerns and ongoing conditions.
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
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Medication reviews</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Discuss your current medicines and make sure they&apos;re right for you.
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

            <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Menopause Care</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Specialist support for menopause symptoms, care options and next steps.
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
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Follow-up appointments</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Continue your care and review your progress with a GP.
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

        {/* 6. YOUR RECORDS, WHEREVER YOU ACCESS CARE matching Figma */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-3xl p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  Your records, wherever you access care
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Manage your GP appointments, messages and care plans in one place.
                </p>
                <div>
                  <Link
                    href="/auth/login"
                    className="bg-[#0062F5] hover:bg-[#0052cc] text-white text-xs font-semibold px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Log in to your account</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0062F5] flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Consultation summary</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      View a record of your appointments.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0062F5] flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Clinical care plan</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      See your agreed next steps.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0062F5] flex items-center justify-center mb-3">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secure messages</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      Stay in touch with your care team.
                    </p>
                  </div>
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
          <div className="bg-[#EFF6FF] rounded-3xl overflow-hidden border border-blue-100 grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 p-8 sm:p-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find the right appointment for you
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Search clinics and choose a time that works for you.
              </p>
              <div className="pt-2">
                <a
                  href="#search-clinics"
                  className="bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium px-6 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Search clinics</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 relative h-64 sm:h-80 w-full">
              <Image
                src="/images/clinic-banner-doctor.png"
                alt="Smiling doctor in suit"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
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
