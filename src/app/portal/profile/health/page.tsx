"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, CircleCheckBig, Info, MessageCircle } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { ActionRow, ErrorState, LoadingCards, PageContainer, PageHeader } from "@/components/portal/ui"
import { getApiErrorMessage } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { patientService } from "@/services/patient.service"

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const GENOTYPES = ["AA", "AS", "AC", "SS", "SC"]

const SELECT_CLASS =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-[15px] text-slate-900 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"

function SelectField({
  id,
  label,
  hint,
  value,
  options,
  onChange,
  disabled,
}: {
  id: string
  label: string
  hint: string
  value: string
  options: string[]
  onChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] sm:text-base font-semibold text-slate-900">
        {label} <span className="font-normal text-slate-500">(optional)</span>
      </label>
      <p id={`${id}-hint`} className="mt-0.5 mb-2 text-sm text-slate-500">
        {hint}
      </p>
      <div className="relative">
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} aria-describedby={`${id}-hint`} className={SELECT_CLASS}>
          <option value="">Not known</option>
          {/* Keep a saved value the list doesn't include, rather than silently dropping it */}
          {value && !options.includes(value) && <option value={value}>{value}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
      </div>
    </div>
  )
}

export default function HealthProfilePage() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [genotype, setGenotype] = useState("")
  const [hasProfile, setHasProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    let active = true
    patientService
      .getMe()
      .then(({ profile }) => {
        if (!active) return
        setBloodGroup(profile?.bloodGroup ?? "")
        setGenotype(profile?.genotype ?? "")
        setHasProfile(Boolean(profile))
        setLoadError(null)
      })
      .catch((cause) => active && setLoadError(getApiErrorMessage(cause, "We couldn't load your health profile.")))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [attempt])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError(null)
    setIsSaved(false)
    setIsSaving(true)
    try {
      await patientService.updateProfile({ bloodGroup: bloodGroup || null, genotype: genotype || null })
      setIsSaved(true)
    } catch (cause) {
      setSaveError(getApiErrorMessage(cause, "We couldn't save your health profile. Please try again."))
    } finally {
      setIsSaving(false)
    }
  }

  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setIsSaved(false)
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader title="Health profile" description="Information you choose to share with your care team." />

      {isLoading && <LoadingCards count={2} label="Loading your health profile" />}
      {loadError && (
        <ErrorState
          message={loadError}
          onRetry={() => {
            setIsLoading(true)
            setLoadError(null)
            setAttempt((count) => count + 1)
          }}
        />
      )}

      {!isLoading && !loadError && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {!hasProfile && (
            <Notice icon={Info} title="Add your personal details first">
              Your health profile is saved with your personal details.{" "}
              <Link href={`${ROUTES.PORTAL.PROFILE}/personal-details`} className="font-semibold text-[#0062F5] underline underline-offset-2">
                Add personal details
              </Link>
            </Notice>
          )}

          <SelectField
            id="blood-group"
            label="Blood group"
            hint="Helps clinicians if you ever need a transfusion."
            value={bloodGroup}
            options={BLOOD_GROUPS}
            onChange={change(setBloodGroup)}
            disabled={!hasProfile}
          />
          <SelectField
            id="genotype"
            label="Genotype"
            hint="Your haemoglobin genotype, if you know it."
            value={genotype}
            options={GENOTYPES}
            onChange={change(setGenotype)}
            disabled={!hasProfile}
          />

          <section aria-labelledby="medicines-allergies" className="space-y-3">
            <h2 id="medicines-allergies" className="text-[15px] sm:text-base font-semibold text-slate-900">
              Medical conditions, medicines and allergies
            </h2>
            <p className="text-sm text-slate-500">
              You&apos;ll be asked about these each time you book, so the clinician sees them before your appointment. To tell your
              care team about a change in the meantime, send them a message.
            </p>
            <ActionRow
              item={{
                title: "Message your GP care team",
                description: "Tell us about a condition, medicine or allergy",
                href: `${ROUTES.PORTAL.NEW_MESSAGE}?team=gp&topic=clinical_query`,
                icon: MessageCircle,
                tone: "blue",
              }}
            />
          </section>

          {isSaved && (
            <div role="status" className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CircleCheckBig className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden />
              Your health profile has been saved.
            </div>
          )}
          {saveError && <ErrorState message={saveError} />}

          <button
            type="submit"
            disabled={!hasProfile || isSaving}
            className={cn(
              "w-full min-h-[52px] rounded-xl bg-[#0062F5] hover:bg-[#0052cc] text-white text-base sm:text-[17px] font-semibold shadow-sm shadow-blue-600/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"
            )}
          >
            {isSaving ? "Saving…" : "Save health profile"}
          </button>
        </form>
      )}
    </PageContainer>
  )
}
