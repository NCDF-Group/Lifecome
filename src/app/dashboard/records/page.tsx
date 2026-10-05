"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[#0667B8] hover:underline flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Care Plans & Health Records</h1>
        <p className="text-xs text-slate-500">Access longitudinal health records and lab diagnostics</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <FileText className="size-6 text-[#0667B8]" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Care Plan v2.4</h2>
            <p className="text-xs text-slate-500">Hypertension & Preventive Health Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
