"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"

interface AuthLayoutProps {
  children: React.ReactNode
  leftContent: React.ReactNode
}

export function AuthLayout({ children, leftContent }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Auth Header matching Figma */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <BrandLogo variant="live" href="/" />

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/gp-care" className="hover:text-[#0062F5] transition-colors">
              GP services
            </Link>
            <Link href="/wellbeing" className="hover:text-[#0062F5] transition-colors">
              Wellbeing
            </Link>
            <Link href="/professional-care" className="hover:text-[#0062F5] transition-colors">
              Professional Care
            </Link>
            <Link href="/insurance" className="hover:text-[#0062F5] transition-colors">
              Insurance
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full bg-white hover:border-slate-300"
            >
              <Image
                src="/images/uk-flag.svg"
                alt="United Kingdom flag"
                width={20}
                height={10}
                className="h-[10px] w-5"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Help
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl lg:max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Decorative & Info Column */}
          <div className="hidden lg:col-span-5 lg:flex bg-gradient-to-b from-[#F0FDF4]/90 via-[#ECFDF5]/50 to-[#F0F9FF]/90 p-8 flex-col justify-between relative border-r border-slate-100">
            {leftContent}
          </div>

          {/* Right Interactive Form Column */}
          <div className="col-span-1 lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            {children}
          </div>
        </div>
      </main>

      {/* Auth Footer matching Figma */}
      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <BrandLogo variant="live" href="/" size="sm" />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/gp-care" className="hover:text-[#0062F5]">
              GP services
            </Link>
            <Link href="/wellbeing" className="hover:text-[#0062F5]">
              Wellbeing
            </Link>
            <Link href="/professional-care" className="hover:text-[#0062F5]">
              Professional Care
            </Link>
            <Link href="/insurance" className="hover:text-[#0062F5]">
              Insurance
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-[#0062F5]">
              Contact
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#0062F5]">
              Accessibility
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
