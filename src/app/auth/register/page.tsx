"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Monitor,
  Leaf,
  Users,
  Shield,
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

        {/* 4 Feature Mini Cards matching Figma */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Monitor className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">GP services</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Appointments online and in person.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
              <Leaf className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Wellbeing</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Support for your everyday health.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Professional Care</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Support around your everyday needs.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Insurance</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Explore cover and manage policies.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Heart Outline at bottom */}
      <div className="pt-4 flex justify-center">
        <svg className="w-36 h-28" viewBox="0 0 160 120" fill="none">
          <path
            d="M80 95 L45 60 C25 40 25 15 50 8 C68 2 80 20 80 20 C80 20 92 2 110 8 C135 15 135 40 115 60 Z"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="95" r="9" fill="#A7F3D0" opacity="0.6" />
          <circle cx="135" cy="85" r="11" fill="#BAE6FD" opacity="0.7" />
        </svg>
      </div>
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent}>
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
