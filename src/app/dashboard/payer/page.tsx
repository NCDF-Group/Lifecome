"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Building2, ArrowLeft } from "lucide-react";
import StatusChip from "@/components/ui/StatusChip";

export default function PayerPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[#0667B8] hover:underline flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">HMO & Health Coverage</h1>
        <p className="text-xs text-slate-500">View participating payers, policy limits, and authorizations</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#B58A35] text-white font-bold text-sm">
              HMO
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">LifeCome HMO</h2>
              <p className="text-xs text-slate-500 font-mono">Policy ID: LC-894029-X</p>
            </div>
          </div>
          <StatusChip status="Approved" />
        </div>
      </div>
    </div>
  );
}
