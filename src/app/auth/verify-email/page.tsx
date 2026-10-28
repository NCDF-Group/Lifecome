"use client"

import React, { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, ChevronLeft, Info } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { StepProgressIndicator } from "@/components/auth/StepProgressIndicator"
import { authService, PENDING_SIGNUP_EMAIL_KEY } from "@/services/auth.service"
import { useAuth } from "@/context/AuthContext"
import { getApiErrorMessage } from "@/lib/api-client"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userAccountId = searchParams.get("userAccountId") || ""
  const initialEmailSent = searchParams.get("emailSent") !== "false"

  const [email, setEmail] = useState("")
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialEmailSent ? null : "We could not send the verification email. Please try sending a new code.")
  const [notice, setNotice] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyRegistrationOtp } = useAuth()

  useEffect(() => {
    setEmail(sessionStorage.getItem(PENDING_SIGNUP_EMAIL_KEY) || "")
  }, [])

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric or take last char
    const clean = val.replace(/\D/g, "")
    const char = clean.slice(-1)

    const nextDigits = [...digits]
    nextDigits[index] = char
    setDigits(nextDigits)

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const isComplete = digits.every((d) => d !== "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!userAccountId) {
      setError("Your registration session is missing. Please create your account again.")
      return
    }
    setIsLoading(true)
    try {
      await verifyRegistrationOtp(userAccountId, digits.join(""))
      router.push("/auth/onboarding/details")
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to verify the code. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    setError(null)
    setNotice(null)
    if (!userAccountId) {
      setError("Your registration session is missing. Please create your account again.")
      return
    }
    setIsLoading(true)
    try {
      const result = await authService.requestRegistrationOtp(userAccountId)
      if (result.emailSent) setNotice("A new verification code has been sent to your email address.")
      else setError("We could not send the verification email. Please try again later.")
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to send a new code. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Confirm your<br />email address.
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Enter the code sent to your email to<br />verify your account.
        </p>
      </div>
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent} illustration="/illustrator/image 2.svg">
      <div className="space-y-6">
        {/* Step indicator: dot-line-dot matching Figma */}
        <StepProgressIndicator currentStep={2} stepLabel="Verify email" />

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            We sent a 6-digit verification code to{" "}
            <span className="font-bold text-slate-900">{email || "the email address you entered"}</span>.
          </p>
        </div>

        {error && <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}
        {notice && <div role="status" className="p-3 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200">{notice}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2.5">
              Verification code
            </label>
            <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  pattern="[0-9]"
                  required
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full h-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] transition-all"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isComplete || isLoading}
            className={`w-full font-medium py-3.5 rounded-[4px] flex items-center justify-center gap-1.5 transition-all shadow-xs text-sm ${isComplete && !isLoading ? "bg-[#0062F5] hover:bg-[#0052cc] text-white" : "bg-[#CBD5E1] text-white cursor-not-allowed"}`}
          >
            <span>{isLoading ? "Verifying…" : "Verify email"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={resendCode}
            disabled={isLoading}
            className="text-[#0062F5] hover:underline"
          >
            Send a new code
          </button>
          <span className="text-slate-300">|</span>
          <Link
            href="/auth/register"
            className="text-[#0062F5] hover:underline"
          >
            Change account details &gt;
          </Link>
        </div>

        {/* Info Box matching Figma */}
        <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl flex items-start gap-3 text-xs text-slate-600">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900">Can&apos;t find the message?</h4>
            <p className="text-slate-500">Check your spam or junk folder, then try sending a new code.</p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0062F5] hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
