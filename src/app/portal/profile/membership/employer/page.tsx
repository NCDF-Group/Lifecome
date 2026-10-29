"use client"

import React, { useId, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { ErrorState, PageContainer, PageHeader } from "@/components/portal/ui"
import { getApiErrorMessage } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { payerService } from "@/services/payer.service"

const FIELD_CLASS =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
const PRIMARY_CLASS =
  "flex items-center justify-center w-full min-h-[52px] rounded-xl bg-[#0062F5] hover:bg-[#0052cc] text-white text-base sm:text-[17px] font-semibold shadow-sm shadow-blue-600/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Connected() {
  return (
    <PageContainer className="space-y-8">
      <div role="status" className="flex flex-col items-center text-center pt-2">
        <span aria-hidden className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Check className="w-7 h-7" strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">You&apos;re connected</h1>
        <p className="mt-2 text-sm sm:text-[15px] text-slate-500">Your employer benefit is now visible in your account.</p>
      </div>
      <div className="space-y-3">
        <Link href={`${ROUTES.PORTAL.PROFILE}/membership`} className={PRIMARY_CLASS}>
          View benefits
        </Link>
        <Link
          href={ROUTES.PORTAL.BOOK}
          className="flex items-center justify-center w-full min-h-[52px] rounded-xl border border-slate-200 bg-white hover:bg-blue-50/50 text-base sm:text-[17px] font-semibold text-[#0062F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"
        >
          Book a GP appointment
        </Link>
      </div>
    </PageContainer>
  )
}

export default function EmployerAccessPage() {
  const [email, setEmail] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [errors, setErrors] = useState<{ email?: string; accessCode?: string }>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const emailErrorId = useId()
  const codeErrorId = useId()

  if (isConnected) return <Connected />

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter your work email address, like name@company.com"
    if (!accessCode.trim()) nextErrors.accessCode = "Enter the access code from your employer"
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.accessCode) {
      document.getElementById(nextErrors.email ? "work-email" : "access-code")?.focus()
      return
    }

    setVerifyError(null)
    setIsVerifying(true)
    try {
      await payerService.verifyMembership(accessCode.trim(), email.trim().toLowerCase())
      setIsConnected(true)
    } catch (cause) {
      setVerifyError(getApiErrorMessage(cause, "We couldn't verify your access. Check your details and try again."))
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader title="Employer access" description="Use your employer's access code to check your eligibility." />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="work-email" className="block mb-2 text-[15px] sm:text-base font-semibold text-slate-900">
            Work email
          </label>
          {errors.email && (
            <p id={emailErrorId} className="mb-2 text-sm font-medium text-red-600">
              {errors.email}
            </p>
          )}
          <input
            id="work-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? emailErrorId : undefined}
            className={cn(FIELD_CLASS, errors.email ? "border-red-400" : "border-slate-200")}
          />
        </div>

        <div>
          <label htmlFor="access-code" className="block mb-2 text-[15px] sm:text-base font-semibold text-slate-900">
            Access code
          </label>
          {errors.accessCode && (
            <p id={codeErrorId} className="mb-2 text-sm font-medium text-red-600">
              {errors.accessCode}
            </p>
          )}
          <input
            id="access-code"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            aria-invalid={Boolean(errors.accessCode)}
            aria-describedby={errors.accessCode ? codeErrorId : undefined}
            className={cn(FIELD_CLASS, "tracking-wide", errors.accessCode ? "border-red-400" : "border-slate-200")}
          />
          <p className="mt-2 text-sm text-slate-500">You&apos;ll find this in your employer&apos;s benefits information or welcome email.</p>
        </div>

        {verifyError && <ErrorState message={verifyError} />}

        <button type="submit" disabled={isVerifying} className={PRIMARY_CLASS}>
          {isVerifying ? "Verifying…" : "Verify access"}
        </button>
      </form>
    </PageContainer>
  )
}
