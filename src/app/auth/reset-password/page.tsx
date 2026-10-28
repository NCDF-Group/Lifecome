"use client"

import React, { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { authService, PENDING_PASSWORD_RESET_EMAIL_KEY } from "@/services/auth.service"
import { getApiErrorMessage } from "@/lib/api-client"

function ResetPasswordContent() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setEmail(sessionStorage.getItem(PENDING_PASSWORD_RESET_EMAIL_KEY) || "")
  }, [])

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError("The reset email is missing. Request a new password reset.")
      return
    }
    setIsLoading(true)
    try {
      await authService.verifyPasswordResetCode(email, code)
      await authService.confirmPasswordReset(email, code, newPassword)
      sessionStorage.removeItem(PENDING_PASSWORD_RESET_EMAIL_KEY)
      setIsSaved(true)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to reset your password. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
          A fresh start<br />for your account.
        </h2>
        <p className="text-sm text-slate-600">
          Set a new password to keep your health and care information safe and
          secure.
        </p>
      </div>
    </div>
  )

  return (
    <AuthLayout leftContent={leftContent} illustration="/illustrator/image 6 (1).svg">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create a new password
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Choose a password you haven&apos;t used for this account.
          </p>
        </div>

        {error && <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}
        {!email && <p role="alert" className="text-sm text-red-700">Your reset session expired. Request a new password reset.</p>}
        {isSaved && <div role="status" className="p-3 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200">Your password has been updated. You can now log in.</div>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">6-digit reset code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              minLength={6}
              maxLength={6}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm tracking-[0.4em] focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5]"
            />
            <p className="text-xs text-slate-500 mt-1">Enter the code sent to {email || "your email address"}.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] pr-16 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0062F5] hover:text-blue-700 flex items-center gap-1"
              >
                {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showNew ? "Hide" : "Show"}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5] pr-16 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0062F5] hover:text-blue-700 flex items-center gap-1"
              >
                {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showConfirm ? "Hide" : "Show"}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Use a long, unique password.
          </div>

          {passwordsMatch && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Passwords match</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!email || !passwordsMatch || code.length !== 6 || isLoading || isSaved}
            className="w-full mt-2 bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white font-medium py-3 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{isLoading ? "Saving…" : isSaved ? "Password updated" : "Save new password"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-slate-400">
          You&apos;ll return to log in after saving.
        </p>

        <div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to log in</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
