import React from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/common/BrandLogo"

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-sm text-slate-600">
          {/* Logo matching Figma */}
          <BrandLogo variant="health" href="/" size="sm" />

          {/* Links matching Figma */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600">
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
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#0062F5] transition-colors">
              Accessibility
            </Link>
          </div>

          {/* Right Preview text matching Figma */}
          <div className="text-xs text-slate-400">
            <span>Website design preview</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
