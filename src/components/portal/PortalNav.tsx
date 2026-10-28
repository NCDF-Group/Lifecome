"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  MessageSquare,
  FileText,
  HeartHandshake,
  User,
  LogOut,
  Bell,
  ShieldCheck,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function PortalNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const tabs = [
    { label: "Visits & Appointments", href: "/portal/dashboard", icon: Calendar },
    { label: "Medical Records", href: "/portal/records", icon: FileText },
    { label: "Care Plans", href: "/portal/care-plans", icon: HeartHandshake },
  ]

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image
              src="/brand/lifecomeH.png"
              alt="LifeCome Health"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            LifeCome <span className="text-[#0062F5]">Portal</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
            Encrypted Patient Session
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0062F5] flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || "PT"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || "Patient"}</p>
              <p className="text-[11px] text-slate-400 capitalize">{user?.role || "patient"}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Sign out of patient session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-[#0062F5] text-[#0062F5] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
