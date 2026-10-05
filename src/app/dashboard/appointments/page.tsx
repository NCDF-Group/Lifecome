"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Video, Clock, Plus, ArrowLeft } from "lucide-react";
import StatusChip from "@/components/ui/StatusChip";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs font-semibold text-[#0667B8] hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Appointments & Consultations</h1>
          <p className="text-xs text-slate-500">Manage video consultations and clinic bookings</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0667B8] px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="size-4" />
          Book New Consultation
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Upcoming Visit</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/50 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#0667B8] text-white">
              <Video className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dr. Adebayo Ogunlesi</p>
              <p className="text-xs text-slate-500">Consultant Cardiologist • Video Visit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusChip status="Booked" />
            <button className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#A2E10D] hover:bg-[#91c90b] rounded-xl shadow-xs">
              Join Waiting Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
