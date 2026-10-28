"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  LayoutGrid,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { useAuth } from "@/context/AuthContext"

// Navigation stays within the patient session
const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/portal/dashboard" },
  { label: "Services", icon: LayoutGrid, href: "/portal/services" },
  { label: "Visit", icon: Calendar, href: "/portal/appointments" },
  { label: "Messages", icon: MessageSquare, href: "/portal/messages" },
  { label: "Profile", icon: User, href: "/portal/profile" },
]

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Left Sidebar matching Figma */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-8">
          <div className="pt-2">
            <BrandLogo variant="live" href="/portal/dashboard" size="md" />
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[#0062F5] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between md:justify-end gap-3">
          <div className="md:hidden">
            <BrandLogo variant="live" href="/portal/dashboard" size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full bg-white hover:border-slate-300 text-xs font-semibold text-slate-700"
            >
              <Image
                src="/images/uk-flag.svg"
                alt="United Kingdom flag"
                width={20}
                height={10}
                className="h-[10px] w-5"
              />
              <span>UK</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <Link
              href="/portal/notifications"
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <Bell className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden bg-white border-b border-slate-100 px-2 flex justify-between overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-[11px] font-medium border-b-2 ${
                  isActive(item.href)
                    ? "border-[#0062F5] text-[#0062F5]"
                    : "border-transparent text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
