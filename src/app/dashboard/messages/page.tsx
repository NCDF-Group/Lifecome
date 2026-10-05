"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs font-semibold text-[#0667B8] hover:underline flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Care Team Messages</h1>
        <p className="text-xs text-slate-[#555] text-slate-500">Secure messaging with your dedicated healthcare team</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <MessageSquare className="size-6 text-[#0667B8]" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Dr. Adebayo Ogunlesi</h2>
            <p className="text-xs text-slate-500">"Your lab results have been reviewed and look great."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
