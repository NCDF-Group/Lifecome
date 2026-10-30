"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, ChevronDown, Info } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { StepProgressIndicator } from "@/components/auth/StepProgressIndicator"
import { patientService } from "@/services/patient.service"
import { PENDING_SIGNUP_EMAIL_KEY } from "@/services/auth.service"
import { useAuth } from "@/context/AuthContext"
import { getApiErrorMessage } from "@/lib/api-client"

function OnboardingDetailsContent() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [country, setCountry] = useState<"GB" | "NG">("GB")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    patientService.getMe().then(({ account, profile }) => {
      setFirstName(profile?.firstName || account.firstName || "")
      setLastName(profile?.lastName || account.lastName || "")
      const accountPhone = account.phoneNumber || ""
      const phoneCountry = profile?.country || (accountPhone.startsWith("+234") ? "NG" : "GB")
      const dialCode = phoneCountry === "NG" ? "+234" : "+44"
      setCountry(phoneCountry)
      setPhone(accountPhone.startsWith(dialCode) ? accountPhone.slice(dialCode.length) : accountPhone)
      if (profile?.dateOfBirth) {
        const [profileYear, profileMonth, profileDay] = profile.dateOfBirth.slice(0, 10).split("-")
        setYear(profileYear)
        setMonth(String(Number(profileMonth)))
        setDay(String(Number(profileDay)))
      }
    }).catch((cause) => {
      setError(getApiErrorMessage(cause, "Unable to load your account details."))
    }).finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    const isValidDate = date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (!isValidDate || date > today) {
      setError("Enter a valid date of birth.")
      return
    }
    const phoneDigits = phone.replace(/\D/g, "")
    if (phoneDigits.length < 7) {
      setError("Enter a valid mobile number.")
      return
    }
    setIsLoading(true)
    try {
      await patientService.createOrReplaceProfile({
        firstName,
        lastName,
        dateOfBirth: `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        country,
        phoneNumber: phone.trim()
          ? `${country === "NG" ? "+234" : "+44"}${phone.replace(/\D/g, "").replace(/^0/, "")}`
          : null,
      })
      await refreshUser()
      sessionStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY)
      router.push("/auth/onboarding/interests")
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to save your details. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const leftContent = (
    <div className="space-y-3">
      <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
        Make your account<br />your own.
      </h2>
      <p className="text-sm text-slate-600">
        A few details help us personalise your experience and get you to the
        right support, faster.
      </p>
    </div>
  )

  return (
    <AuthLayout
      leftContent={leftContent}
      illustration="profile"
    >
      <div className="space-y-6">
        {/* Step indicator: dot-line-dot matching Figma */}
        <StepProgressIndicator currentStep={3} stepLabel="Your details" />

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Tell us a little about you
          </h1>
        </div>

        {error && <div role="alert" className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={100}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5] focus:ring-1 focus:ring-[#0062F5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Date of birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">Day</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="DD"
                  minLength={1}
                  maxLength={2}
                  pattern="[0-9]{1,2}"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">Month</span>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  >
                    <option value="">Month</option>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, index) => (
                      <option key={m} value={String(index + 1)}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">Year</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="YYYY"
                  minLength={4}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Mobile number
            </label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0062F5] focus-within:ring-1 focus-within:ring-[#0062F5]">
                            <div className="relative flex shrink-0 items-center gap-2 border-r border-slate-200 bg-slate-50 px-3">
                {country === "GB" ? (
                  <Image
                    src="/images/uk-flag.svg"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={10}
                    className="h-[10px] w-5"
                  />
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500" aria-hidden="true">NG</span>
                )}
                <select
                  aria-label="Mobile number country code"
                  value={country}
                  onChange={(e) => setCountry(e.target.value as "GB" | "NG")}
                  required
                  className="appearance-none bg-transparent py-3 pr-4 text-xs font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="GB">+44</option>
                  {country === "NG" && <option value="NG">+234</option>}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-slate-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel-national"
                placeholder="Enter mobile number"
                aria-label="Mobile number"
                minLength={7}
                maxLength={15}
                pattern="[0-9 ()-]+"
                required
                className="w-full px-4 py-3 bg-white text-slate-900 text-sm focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>We&apos;ll ask for any service-specific information when you book or request support.</span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link
              href={user
                ? `/auth/verify-email?userAccountId=${encodeURIComponent(user.id)}`
                : "/auth/login"}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white font-medium px-8 py-3 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{isLoading ? "Saving…" : "Continue"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default function OnboardingDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <OnboardingDetailsContent />
    </Suspense>
  )
}
