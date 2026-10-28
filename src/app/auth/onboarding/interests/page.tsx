"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Info, Leaf, Monitor, Shield, Users } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { StepProgressIndicator } from "@/components/auth/StepProgressIndicator"
import { patientService } from "@/services/patient.service"
import { getApiErrorMessage } from "@/lib/api-client"

const INTERESTS = [
  { id: "gp_services", title: "GP services", description: "Online and clinic appointments", icon: Monitor },
  { id: "wellbeing", title: "Wellbeing", description: "Coaching, healthy eating and relaxation", icon: Leaf },
  { id: "professional_care", title: "Professional Care", description: "Support for everyday needs", icon: Users },
  { id: "insurance", title: "Insurance", description: "Explore cover and manage policies", icon: Shield },
] as const

function InterestsContent() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    patientService.getMe()
      .then(({ profile }) => setSelectedInterests(profile?.interests ?? []))
      .catch((cause) => setError(getApiErrorMessage(cause, "Unable to load your account preferences.")))
      .finally(() => setIsLoading(false))
  }, [])

  const toggleInterest = (id: string) => {
    setSelectedInterests((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id])
  }

  const finishSetup = async () => {
    setError(null)
    if (selectedInterests.length === 0) {
      setError("Select at least one area you would like support with.")
      return
    }
    setIsSaving(true)
    try {
      await patientService.updateProfile({ interests: selectedInterests })
      router.push("/auth/welcome")
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to save your preferences. Please try again."))
    } finally {
      setIsSaving(false)
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Choose what<br />matters to you.</h2>
        <p className="text-sm text-slate-600">You can change these choices later.</p>
      </div>
      <div className="my-8 flex items-center justify-center">
        <div className="w-56 h-56 relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-emerald-100/50 -top-2 -left-2 blur-md" />
          <div className="absolute w-36 h-36 rounded-full bg-sky-100/60 bottom-0 right-0 blur-sm" />
          <svg className="w-48 h-48 relative z-10" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <path d="M100 150 55 105C30 80 30 45 60 30c25-12 40 10 40 10s15-22 40-10c30 15 30 50 5 75l-45 45Z" stroke="#0062F5" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="160" cy="65" r="14" fill="#A7F3D0" opacity=".7" />
            <circle cx="40" cy="140" r="16" fill="#86EFAC" opacity=".6" />
            <circle cx="155" cy="140" r="12" fill="#BAE6FD" opacity=".8" />
          </svg>
        </div>
      </div>
      <div />
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="space-y-6">
        <StepProgressIndicator currentStep={4} stepLabel="Your interests" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">What would you like support with?</h1>
          <p className="text-sm text-slate-500 mt-2">Select at least one area that interests you.</p>
        </div>

        {error && <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}
        {isLoading && <p role="status" className="text-sm text-slate-500">Loading your preferences…</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTERESTS.map(({ id, title, description, icon: Icon }) => {
            const selected = selectedInterests.includes(id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                disabled={isLoading || isSaving}
                onClick={() => toggleInterest(id)}
                className={`min-h-24 rounded-2xl border p-4 text-left flex items-start gap-3 transition-colors ${selected ? "border-[#0062F5] bg-blue-50/40" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${selected ? "bg-[#0062F5] border-[#0062F5] text-white" : "border-slate-300 text-transparent"}`}>
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062F5] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">{title}</span>
                  <span className="block text-xs text-slate-500 mt-1">{description}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="p-3.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#0062F5] shrink-0" />
          <span>GP appointments are for adults aged 18+ physically in England. Eligibility is checked when booking.</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.push("/auth/onboarding/details")} className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button type="button" onClick={finishSetup} disabled={isLoading || isSaving} className="bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white font-medium px-7 py-3 rounded-[4px] inline-flex items-center gap-1.5 transition-colors shadow-xs">
            {isSaving ? "Saving…" : "Finish setup"}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
        </div>
      </div>
    </AuthLayout>
  )
}

export default function OnboardingInterestsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <InterestsContent />
    </Suspense>
  )
}
