"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Home,
  LayoutGrid,
  Calendar,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
  CheckCircle,
  LogOut,
} from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { useAuth } from "@/context/AuthContext"
import { patientService } from "@/services/patient.service"
import { getApiErrorMessage } from "@/lib/api-client"

export default function PatientProfilePage() {
  const router = useRouter()
  const { logout, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("Profile")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [postcode, setPostcode] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState<"" | "NG" | "GB">("")
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    patientService.getMe().then(({ account, profile }) => {
      setFirstName(profile?.firstName || account.firstName || "")
      setLastName(profile?.lastName || account.lastName || "")
      setDob(profile?.dateOfBirth?.slice(0, 10) || "")
      setCity(profile?.city || "")
      setCountry(profile?.country || "")
      const [line1 = "", line2 = "", savedPostcode = ""] = (profile?.address || "").split("\n")
      setAddressLine1(line1)
      setAddressLine2(line2)
      setPostcode(savedPostcode)
      setHasProfile(Boolean(profile))
    }).catch((cause) => {
      setError(getApiErrorMessage(cause, "Unable to load your profile."))
    }).finally(() => setIsLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSaved(false)
    if (!dob || !country) {
      setError("Enter your date of birth and select your country.")
      return
    }
    setIsSaving(true)
    try {
      const input = {
        firstName,
        lastName,
        dateOfBirth: dob,
        address: [addressLine1, addressLine2, postcode].filter(Boolean).join("\n"),
        city,
        country,
      }
      if (hasProfile) await patientService.updateProfile(input)
      else await patientService.createOrReplaceProfile(input)
      setHasProfile(true)
      await refreshUser()
      setIsSaved(true)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "Unable to save your profile."))
    } finally {
      setIsSaving(false)
    }
  }

  // Navigation stays within the patient session
  const sidebarItems = [
    { label: "Home", icon: Home, href: "/portal/profile" },
    { label: "Services", icon: LayoutGrid, href: "/gp-services" },
    { label: "Visit", icon: Calendar, href: "/clinic-appointments" },
    { label: "Messages", icon: MessageSquare, href: "#" },
    { label: "Profile", icon: User, href: "/portal/profile" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Left Sidebar matching Figma */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-8">
          {/* Logo using brand file */}
          <div className="pt-2">
            <BrandLogo variant="live" href="/portal/profile" size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isSelected = item.label === activeTab
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.label)
                    if (item.href !== "#") router.push(item.href)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    isSelected
                      ? "bg-[#0062F5] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sign Out Button in Sidebar (redirects to /auth/login) */}
        <div className="pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col items-center overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="md:hidden w-full max-w-3xl flex items-center justify-between mb-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
          <BrandLogo variant="live" href="/portal/profile" size="sm" />
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Centered Care Profile Card Container matching Figma */}
        <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs relative">
          {/* Top Bar with Back Arrow and Centered Brand Logo */}
          <div className="flex items-center justify-between mb-2 relative">
            <button
              type="button"
              onClick={() => router.push("/portal/profile")}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2">
              <BrandLogo variant="live" size="md" />
            </div>

            <div className="w-9" />
          </div>

          {/* Header Title */}
          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your care profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Keep your details up to date so we can provide the best care for you.
            </p>
          </div>

          {isSaved && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Your care profile has been saved successfully.</span>
            </div>
          )}
          {error && <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>}
          {isLoading && <p role="status" className="mb-6 text-sm text-slate-500">Loading your profile…</p>}

          <form onSubmit={handleSave} className="space-y-5">
            {/* 1. Personal Details Card */}
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Personal details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
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
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Date of birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  />
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Home Address Card */}
            <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-[#0062F5] flex items-center justify-center">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <span>Home address</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Address line 1
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Address line 2 <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Flat 2, Riverside House"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                      City or town
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as "" | "NG" | "GB")}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:border-[#0062F5]"
              >
                <option value="">Select your country</option>
                <option value="GB">United Kingdom</option>
                <option value="NG">Nigeria</option>
              </select>
            </div>

            {/* Info Notice matching Figma */}
            <div className="p-3.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl flex items-center gap-2.5 text-xs text-[#0062F5]">
              <Info className="w-4 h-4 shrink-0" />
              <span>Your payer cannot see your clinical records.</span>
            </div>

            {/* Save Profile Button */}
            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="w-full bg-[#0062F5] hover:bg-[#0052cc] disabled:opacity-60 text-white font-medium py-3.5 rounded-[4px] transition-colors shadow-xs text-sm cursor-pointer"
            >
              {isSaving ? "Saving profile…" : "Save profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
