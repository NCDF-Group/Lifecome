"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  ShieldCheck,
  FileText,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { PatientProvider, usePatientProfile } from "@/components/dashboard/patient-provider";
import { patientEmail, patientInitials, patientName } from "@/lib/patient/profile";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patient Profile", href: "/dashboard/profile", icon: User },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "HMO & Coverage", href: "/dashboard/payer", icon: ShieldCheck },
  { name: "Care Plans & Records", href: "/dashboard/records", icon: FileText },
  { name: "Care Team Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientProvider>
      <DashboardShell>{children}</DashboardShell>
    </PatientProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const { profile, loading } = usePatientProfile();

  const handleSignOut = async () => {
    setSignOutError("");
    setSigningOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to sign out. Please try again.");
      }
      router.replace("/sign-in");
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  const isNavActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="dashboard-theme min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
      {/* ---------------- MOBILE OVERLAY & DRAWER ---------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <Link
                href="/dashboard"
                aria-label="LifeCome Live dashboard"
                className="flex min-w-0 items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/brand/lifecome-live-logo.svg"
                  alt="LifeCome Live"
                  width={916}
                  height={164}
                  unoptimized
                  className="h-7 w-auto max-w-full"
                />
              </Link>
              <button
                type="button"
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
              {navigationItems.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-50 text-[#0667B8] font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`size-5 ${active ? "text-[#0667B8]" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Card Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#0667B8] text-white font-bold text-sm shadow-sm">
                  {loading ? "…" : patientInitials(profile)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {loading ? "Loading profile…" : patientName(profile)}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{patientEmail(profile) || "Patient account"}</p>
                </div>
              </div>
              {signOutError && <p role="alert" className="mb-2 text-xs text-rose-700">{signOutError}</p>}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
              >
                <LogOut className="size-3.5" />
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DESKTOP PERSISTENT SIDEBAR ---------------- */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col border-r border-slate-200 bg-white">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200">
          <Link
            href="/dashboard"
            aria-label="LifeCome Live dashboard"
            className="flex min-w-0 items-center"
          >
            <Image
              src="/brand/lifecome-live-logo.svg"
              alt="LifeCome Live"
              width={916}
              height={164}
              unoptimized
              className="h-7 w-auto max-w-full"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {navigationItems.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-[#0667B8] font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`size-5 ${active ? "text-[#0667B8]" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Card */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#0667B8] text-white font-bold text-sm shadow-sm">
              {loading ? "…" : patientInitials(profile)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {loading ? "Loading profile…" : patientName(profile)}
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">{patientEmail(profile) || "Patient account"}</p>
            </div>
          </div>
          {signOutError && <p role="alert" className="mb-2 text-xs text-rose-700">{signOutError}</p>}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
          >
            <LogOut className="size-3.5" />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Global Header Top-Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
          {/* Left: Mobile hamburger menu toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="size-6" />
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patient Portal
            </span>
          </div>

          {/* Right: Payer verification status pill & Profile quick link */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Patient account status */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-[#45AF03]">
              <CheckCircle2 className="size-3.5 text-[#45AF03]" />
              <span className="truncate">Patient Portal</span>
            </div>

            {/* Profile Avatar Quick Link */}
            <Link
              href="/dashboard/profile"
              className="flex size-9 items-center justify-center rounded-full bg-[#0667B8] text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-[#0667B8]/30 transition"
              title="View Profile"
            >
              {loading ? "…" : patientInitials(profile)}
            </Link>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
