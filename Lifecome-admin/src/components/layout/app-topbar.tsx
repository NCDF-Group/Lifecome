"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";

/**
 * The bar above every console page: a sidebar hamburger (the persistent
 * `lg`+ sidebar below `lg`, `MobileNav`'s drawer above), a title slot,
 * and the signed-in staff member's identity + sign-out. Global search
 * (command palette) is not wired up yet.
 */
export function AppTopbar({ email, role }: { email: string; role: StaffRole }) {
  const { toggle } = useSidebar();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="hidden size-9 items-center justify-center rounded-control text-ink hover:bg-surface lg:flex"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-sm font-semibold text-ink">
          LifeCome Live - Operations console
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        {/* TODO: command palette trigger */}
        <Bell className="size-4" />
        <span className="hidden sm:flex sm:flex-col sm:items-end sm:leading-tight">
          <span className="text-ink">{email}</span>
          <span className="text-xs">{staffRoleLabel[role]}</span>
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Sign out"
          className="flex size-9 items-center justify-center rounded-control text-ink hover:bg-surface disabled:opacity-60"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
