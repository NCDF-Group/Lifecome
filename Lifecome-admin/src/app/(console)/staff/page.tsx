import { UserPlus, Users } from "lucide-react";
import { demoStaff } from "@/lib/demo/staff";
import { StaffTable } from "@/features/staff/components/staff-table";
import { PageHeader } from "@/components/shared/page-header";

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Users}
        title="Staff accounts"
        action={
          <button
            type="button"
            disabled
            title="Not wired up yet — see README.md, Known gap: admin auth"
            className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-white opacity-60 disabled:cursor-not-allowed"
          >
            <UserPlus className="size-4" />
            Invite staff member
          </button>
        }
      />
      <StaffTable staff={demoStaff} />
    </div>
  );
}
