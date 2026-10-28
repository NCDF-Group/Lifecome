"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Eye,
  EyeOff,
  Info,
} from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { StepProgressIndicator } from "@/components/auth/StepProgressIndicator"
import { authService, PENDING_SIGNUP_EMAIL_KEY } from "@/services/auth.service"
import { getApiErrorMessage } from "@/lib/api-client"

export default function RegisterStep1Page() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const account = await authService.register({ email: email.trim().toLowerCase(), password })
      sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, account.email)
      router.push(`/auth/verify-email?userAccountId=${encodeURIComponent(account.id)}&emailSent=${account.verificationEmailSent}`)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to create your account. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
          One account.<br />Four ways to care.
        </h2>
        <p className="text-sm text-slate-600">
          Manage your health and care, all in one place.
        </p>
        {/* The four service cards are part of the illustration artwork */}
        <ul className="sr-only">
          <li>GP services: Appointments online and in person.</li>
          <li>Wellbeing: Support for your everyday health.</li>
          <li>Professional Care: Support around your everyday needs.</li>
          <li>Insurance: Explore cover and manage policies.</li>
        </ul>
      </div>
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent} illustration="/illustrator/image 2 (1).svg">
      <div className="space-y-6">
        {/* Step indicator matching Figma */}
        <StepProgressIndicator currentStep={1} stepLabel="Account" />

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
            {error}
          </div>
        )}

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

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Create password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] pr-16 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0062F5] hover:text-blue-700 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Use a long, unique password.</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="rounded border-slate-300 text-[#0062F5] focus:ring-[#0062F5] w-4 h-4 mt-0.5"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-[#0062F5] hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#0062F5] hover:underline">
                  Privacy Notice
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white font-medium py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{isLoading ? "Creating account…" : "Create account"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2">
          <span>Already have an account? </span>
          <Link
            href="/auth/login"
            className="font-medium text-[#0062F5] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Log in</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
