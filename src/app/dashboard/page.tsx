"use client";

import Link from "next/link";
import {
  Calendar,
  Shield,
  FileText,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { usePatientProfile } from "@/components/dashboard/patient-provider";
import { patientEmail, patientName } from "@/lib/patient/profile";

export default function DashboardPage() {
  const { profile, loading, error, reload } = usePatientProfile();
  const name = patientName(profile);
  const firstName = name.split(/\s+/)[0];

  return (
    <div className="space-y-8">
      {/* ---------------- 1. HEADER & DEPENDANT SWITCHER ---------------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0667B8]">Patient Dashboard</p>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
            {loading ? "Loading your profile…" : `Welcome back, ${firstName} 👋`}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{patientEmail(profile) || "Your personal care overview"}</p>
        </div>
      </div>
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{error}</span>
          <button type="button" onClick={reload} className="font-semibold underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      {/* ---------------- 2. UPCOMING VISIT HERO CARD ---------------- */}
      <section aria-label="Upcoming Visit">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0667B8] via-blue-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -right-12 -top-12 size-64 rounded-full bg-[#A2E10D]/10 blur-3xl" />
          <div className="absolute right-1/3 -bottom-16 size-48 rounded-full bg-[#3DE5F8]/10 blur-2xl" />
          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Your next consultation</h2>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  Your upcoming appointments will appear here when they are available.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <Link
                href="/dashboard/appointments"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#A2E10D] px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg hover:bg-[#91c90b] transition-all transform active:scale-95 cursor-pointer"
              >
                <Calendar className="size-4" />
                View appointments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. QUICK CARE ACTIONS (4-COLUMN BENTO GRID) ---------------- */}
      <section aria-label="Quick Actions">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Care Actions</h2>
          <span className="text-xs text-slate-400 font-medium">Platform Services</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Book Consultation */}
          <Link
            href="/dashboard/appointments"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-[#0667B8]/40 hover:shadow-md"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#0667B8] group-hover:bg-[#0667B8] group-hover:text-white transition-colors">
                <Calendar className="size-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 group-hover:text-[#0667B8] transition-colors">
                Book Consultation
              </h3>
              <p className="mt-1 text-xs text-slate-500">Schedule video or in-person specialist visit</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0667B8]">
              <span>Book now</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: HMO Coverage */}
          <Link
            href="/dashboard/payer"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-[#0667B8]/40 hover:shadow-md"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-[#B58A35] group-hover:bg-[#B58A35] group-hover:text-white transition-colors">
                <Shield className="size-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 group-hover:text-[#B58A35] transition-colors">
                HMO Coverage
              </h3>
              <p className="mt-1 text-xs text-slate-500">Check eligibility, limits & linked payers</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#B58A35]">
              <span>View coverage</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Care Plans */}
          <Link
            href="/dashboard/records"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-[#0667B8]/40 hover:shadow-md"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-[#45AF03] group-hover:bg-[#45AF03] group-hover:text-white transition-colors">
                <FileText className="size-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 group-hover:text-[#45AF03] transition-colors">
                Care Plans
              </h3>
              <p className="mt-1 text-xs text-slate-500">Track treatment goals & diagnostic records</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#45AF03]">
              <span>Review records</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: Care Team */}
          <Link
            href="/dashboard/messages"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-[#0667B8]/40 hover:shadow-md"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Care Team
              </h3>
              <p className="mt-1 text-xs text-slate-500">Direct secure messaging with clinicians</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600">
              <span>Open messages</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* ---------------- 4. ACTIVE CARE PLAN SUMMARY CARD ---------------- */}
      <section aria-label="Active Care Plan">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0667B8]">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Care plan summary</h2>
                <p className="text-xs text-slate-500">Your care plan information will appear here when available.</p>
              </div>
            </div>
            <Link
              href="/dashboard/records"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0667B8] hover:underline"
            >
              <span>View Full Plan Details</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No care plan details are available for this account yet.
          </div>
        </div>
      </section>
    </div>
  );
}
