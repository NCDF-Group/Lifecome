"use client"

import React, { useState } from "react"
import { CircleCheckBig, FileText } from "lucide-react"
import { ActionRow, ErrorState, LoadingCards, PageContainer, PageHeader } from "@/components/portal/ui"
import { useResource } from "@/hooks/useResource"
import { getApiErrorMessage } from "@/lib/api-client"
import { PRIVACY_NOTICE_VERSION } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { consentService, type ConsentRecord } from "@/services/consent.service"

const fetchConsents = () => consentService.getMine()

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-[15px] sm:text-base font-semibold text-slate-900 cursor-pointer">
          {label}
        </label>
        <p id={`${id}-description`} className="text-sm text-slate-500">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-description`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2",
          checked ? "bg-[#0062F5]" : "bg-slate-200"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

export default function PrivacyPage() {
  const consents = useResource<ConsentRecord[]>("mine", fetchConsents, "We couldn't load your privacy choices.")
  const [draft, setDraft] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const activeSharing = consents.data?.find((consent) => consent.consentType === "record_sharing" && consent.isActive) ?? null
  const saved = Boolean(activeSharing)
  const shareWithTeam = draft ?? saved
  const hasChanges = consents.data !== null && shareWithTeam !== saved

  const handleSave = async () => {
    if (!hasChanges) {
      setIsSaved(true)
      return
    }
    setSaveError(null)
    setIsSaving(true)
    try {
      if (shareWithTeam) await consentService.grant("record_sharing", PRIVACY_NOTICE_VERSION)
      else if (activeSharing) await consentService.revoke(activeSharing.id)
      setDraft(null)
      setIsSaved(true)
      consents.reload()
    } catch (cause) {
      setSaveError(getApiErrorMessage(cause, "We couldn't save your preferences. Please try again."))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader title="Privacy & permissions" description="Choose how your information is used." />

      {consents.isLoading && <LoadingCards count={1} label="Loading your privacy choices" />}
      {consents.error && <ErrorState message={consents.error} onRetry={consents.reload} />}

      {consents.data && (
        <div className="divide-y divide-slate-100">
          <Toggle
            id="share-care-team"
            label="Share across my care team"
            description="Allow relevant care professionals to see shared information."
            checked={shareWithTeam}
            disabled={isSaving}
            onChange={(checked) => {
              setDraft(checked)
              setIsSaved(false)
            }}
          />
        </div>
      )}

      <ActionRow
        iconVariant="circle"
        item={{
          title: "Read the privacy notice",
          description: "How we collect, use and protect your information",
          href: "/portal/privacy-notice",
          icon: FileText,
          tone: "blue",
        }}
      />

      {isSaved && (
        <div role="status" className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CircleCheckBig className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden />
          Your preferences have been saved.
        </div>
      )}
      {saveError && <ErrorState message={saveError} />}

      <button
        type="button"
        onClick={handleSave}
        disabled={!consents.data || isSaving}
        className="w-full min-h-[52px] rounded-xl bg-[#0062F5] hover:bg-[#0052cc] text-white text-base sm:text-[17px] font-semibold shadow-sm shadow-blue-600/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"
      >
        {isSaving ? "Saving…" : "Save preferences"}
      </button>
    </PageContainer>
  )
}
