"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getToken, clearToken, isAuthenticated } from "@/lib/auth/session";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/sign-in");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    clearToken();
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-ink-muted">
          <svg aria-hidden className="size-6 animate-spin text-blue" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/50 py-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-positive">Patient Portal</span>
            <h1 className="text-3xl font-extrabold text-ink sm:text-4xl mt-1">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Manage your healthcare, HMO coverage, and medical appointments.
            </p>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-control border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface active:scale-95"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Appointments */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:border-blue/40 hover:shadow-md">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">Appointments</h3>
            <p className="mt-1 text-sm text-ink-muted">Book consultations with top certified providers and view upcoming visits.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-sm font-semibold text-link hover:underline">
              Book a visit &rarr;
            </Link>
          </div>

          {/* Card 2: HMO & Eligibility */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:border-blue/40 hover:shadow-md">
            <div className="flex size-12 items-center justify-center rounded-xl bg-lime/20 text-ink">
              <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-positive" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">HMO Coverage</h3>
            <p className="mt-1 text-sm text-ink-muted">Verify member eligibility, active plans, and pre-authorisation status.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-sm font-semibold text-link hover:underline">
              Check eligibility &rarr;
            </Link>
          </div>

          {/* Card 3: Prescriptions & Records */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:border-blue/40 hover:shadow-md">
            <div className="flex size-12 items-center justify-center rounded-xl bg-cyan/20 text-ink">
              <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">Medical Records</h3>
            <p className="mt-1 text-sm text-ink-muted">Access clinical notes, diagnostic results, and electronic prescriptions.</p>
            <Link href="/" className="mt-4 inline-flex items-center text-sm font-semibold text-link hover:underline">
              View records &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
