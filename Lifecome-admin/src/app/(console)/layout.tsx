import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

/**
 * The authenticated shell every console page renders inside: sidebar +
 * topbar + scrollable content area. No auth guard yet — see README.md
 * "Known gap: admin auth". Once it exists, this is where an
 * unauthenticated request gets redirected to `/login`.
 */
export default function ConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
