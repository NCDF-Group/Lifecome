"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[#0667B8] hover:underline flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Help & Support</h1>
        <p className="text-xs text-slate-500 font-medium">Platform guides, FAQs, and 24/7 patient support</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="size-6 text-[#0667B8]" />
          <div>
            <h2 className="text-base font-bold text-slate-900">LifeCome Live Patient Caredesk</h2>
            <p className="text-xs text-slate-500">Need help with HMO verification or booking an emergency consultation?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
