import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { requireStaffSession } from "@/lib/auth/guards";

export default async function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { claims } = await requireStaffSession();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar email={claims.email} role={claims.role} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
