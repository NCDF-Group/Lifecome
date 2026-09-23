import { Bell } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * The bar above every console page: a mobile nav trigger (below `lg`,
 * where `AppSidebar` is hidden), a title slot, and the signed-in staff
 * member's menu. Global search (command palette) and the account menu
 * are not wired up yet.
 */
export function AppTopbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <span className="text-sm font-semibold text-ink">
          LifeCome Live — Operations console
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        {/* TODO: command palette trigger, staff avatar menu */}
        <Bell className="size-4" />
        <span className="hidden sm:inline">Signed in as —</span>
      </div>
    </header>
  );
}
