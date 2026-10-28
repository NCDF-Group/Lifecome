"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ChevronRight, Eye, EyeOff, Info } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { useAuth } from "@/context/AuthContext"
import { getApiErrorMessage } from "@/lib/api-client"

function LoginContent() {
  const searchParams = useSearchParams()
  const requestedDestination = searchParams.get("from")
  const from = requestedDestination?.startsWith("/") && !requestedDestination.startsWith("//")
    ? requestedDestination
    : "/portal/profile"
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login({ email: email.trim().toLowerCase(), password }, from)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to log in. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
          Your health and<br />care, connected.
        </h2>
        <p className="text-sm text-slate-600">
          Access your appointments, messages and plans.
        </p>
      </div>

      {/* Heart and shield artwork from the Figma login design */}
      <div className="my-8 flex flex-1 items-center justify-center relative">
        <Image
          src="/images/auth/auth-care-illustration.svg"
          alt="A heart protected by a shield"
          width={420}
          height={320}
          priority
          className="relative z-10 h-auto w-full max-w-[26rem]"
        />
      </div>

      <div />
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log in to your LifeCome Health account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
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
              maxLength={254}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={200}
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
          </div>

          <div className="flex justify-end text-xs">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-[#0062F5] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#0062F5] hover:bg-[#0052cc] text-white font-medium py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{isLoading ? "Signing in..." : "Log in"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          <span>New to LifeCome Health? </span>
          <Link
            href="/auth/register"
            className="font-medium text-[#0062F5] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Create an account</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Info Box matching Figma */}
        <div className="p-3.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#0062F5] shrink-0" />
          <span>Use a private device for your health information.</span>
        </div>
      </div>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
