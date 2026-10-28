"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    {
      label: "GP services",
      href: "/gp-care",
      isActive:
        pathname === "/gp-care" ||
        pathname === "/gp-services" ||
        pathname === "/clinic-appointments",
    },
    {
      label: "Wellbeing",
      href: "/wellbeing",
      isActive: pathname === "/wellbeing",
    },
    {
      label: "Professional Care",
      href: "/professional-care",
      isActive: pathname === "/professional-care",
    },
    {
      label: "Insurance",
      href: "/insurance",
      isActive: pathname === "/insurance",
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo using brand file */}
        <BrandLogo variant="health" href="/" size="md" />

        {/* Center Navigation Links with active indicator matching Figma */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative h-full flex items-center text-sm font-medium transition-colors ${
                link.isActive
                  ? "text-[#0062F5] font-semibold"
                  : "text-slate-700 hover:text-[#0062F5]"
              }`}
            >
              {link.label}
              {link.isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0062F5] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA Area matching Figma (Profile is never visible from landing page) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Region Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-full bg-white">
            <Image
              src="/images/uk-flag.svg"
              alt="United Kingdom flag"
              width={20}
              height={10}
              className="h-[10px] w-5"
            />
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Log in Button */}
          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-5 py-2 border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors"
          >
            Log in
          </Link>

          {/* Primary Action Button: "Book a GP >" */}
          <Link
            href="/auth/register"
            className="flex items-center gap-1 bg-[#0062F5] hover:bg-[#0052cc] text-white text-sm font-medium px-5 py-2 rounded-[4px] transition-all group"
          >
            <span>Book a GP</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Image
            src="/images/uk-flag.svg"
            alt="United Kingdom flag"
            width={20}
            height={10}
            className="h-[10px] w-5"
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium ${
                link.isActive ? "text-[#0062F5] font-semibold" : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 border border-slate-200 text-slate-700 font-medium rounded-[4px]"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 bg-[#0062F5] text-white font-medium rounded-[4px]"
            >
              Book a GP
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

