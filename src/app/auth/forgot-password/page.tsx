"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, HelpCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { authService, PENDING_PASSWORD_RESET_EMAIL_KEY } from "@/services/auth.service"
import { getApiErrorMessage } from "@/lib/api-client"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      await authService.requestPasswordReset(normalizedEmail)
      sessionStorage.setItem(PENDING_PASSWORD_RESET_EMAIL_KEY, normalizedEmail)
      setSubmitted(true)
      router.push("/auth/reset-password")
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to request a password reset. Please try again."))
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Your Account
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
          Let&apos;s get<br />you back in.
        </h2>
        <p className="text-sm text-slate-600">
          Reset your password to continue managing your appointments, messages
          and care in one place.
        </p>
      </div>

      {/* Key & Envelope Illustration matching Figma */}
      <div className="my-8 flex items-center justify-center">
        <div className="w-56 h-56 relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-emerald-100/50 -top-2 -left-2 blur-md" />
          <div className="absolute w-36 h-36 rounded-full bg-sky-100/60 bottom-0 right-0 blur-sm" />

          <svg className="w-48 h-48 relative z-10" viewBox="0 0 200 200" fill="none">
            {/* Soft decorative background leaf */}
            <circle cx="50" cy="120" r="30" fill="#A7F3D0" opacity="0.6" />
            <circle cx="160" cy="140" r="24" fill="#BAE6FD" opacity="0.7" />

            {/* Envelope in Background */}
            <rect
              x="60"
              y="95"
              width="100"
              height="70"
              rx="10"
              fill="white"
              stroke="#0062F5"
              strokeWidth="4"
            />
            <path
              d="M60 100 L110 135 L160 100"
              stroke="#0062F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Spark lines */}
            <path d="M165 90 L175 80" stroke="#0062F5" strokeWidth="3" strokeLinecap="round" />
            <path d="M175 100 L188 100" stroke="#0062F5" strokeWidth="3" strokeLinecap="round" />
            <path d="M170 115 L182 122" stroke="#0062F5" strokeWidth="3" strokeLinecap="round" />

            {/* Stylized Key in Foreground */}
            <circle
              cx="75"
              cy="95"
              r="22"
              fill="white"
              stroke="#0062F5"
              strokeWidth="4.5"
            />
            <circle cx="75" cy="95" r="7" fill="#0062F5" />
            <path
              d="M93 108 L55 145 C50 150 42 146 45 140 L50 135 L45 130 L55 120"
              stroke="#0062F5"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
            />
          </svg>
        </div>

        {error && <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}
      </div>

      <div />
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Enter your email address and we&apos;ll send password reset instructions if
            an account exists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{submitted ? "Sending instructions…" : "Send reset instructions"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to log in</span>
          </Link>
        </div>

        {/* Help Card matching Figma */}
        <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl flex items-start gap-3 text-xs text-slate-600">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-900">Can&apos;t access your email?</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              If you no longer have access to your email address, we can help you regain
              access to your account.
            </p>
            <Link
              href="#"
              className="font-semibold text-[#0062F5] hover:underline inline-flex items-center gap-0.5 pt-0.5"
            >
              <span>Get account support</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
