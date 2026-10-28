"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Clock } from "lucide-react"

// Any portal page that has not been built yet lands here, inside the signed-in shell,
// instead of a 404 or the public site
function toTitle(pathname: string) {
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? ""
  const words = lastSegment.replace(/[-_]+/g, " ").trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "This page"
}

export default function PortalComingSoonPage() {
  const pathname = usePathname()

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#0062F5] flex items-center justify-center">
        <Clock className="w-7 h-7" />
      </div>
      <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {toTitle(pathname)}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Coming soon</h1>
      <p className="mt-3 text-sm text-slate-500 leading-relaxed">
        We&apos;re still building this part of your account. Check back soon.
      </p>
      <Link
        href="/portal/dashboard"
        className="mt-8 inline-flex items-center gap-1.5 bg-[#0062F5] hover:bg-[#0052cc] text-white text-sm font-medium px-6 py-3 rounded-[4px] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </Link>
    </div>
  )
}
