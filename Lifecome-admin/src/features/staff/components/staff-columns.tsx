import type { ColumnDef } from "@tanstack/react-table";
import { staffRoleLabel, type DemoStaffMember } from "@/lib/demo/staff";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<DemoStaffMember["status"], string> = {
  active: "Active",
  invited: "Invited",
  disabled: "Disabled",
};

const statusTone: Record<
  DemoStaffMember["status"],
  "success" | "warning" | "neutral"
> = {
  active: "success",
  invited: "warning",
  disabled: "neutral",
};

export const staffColumns: ColumnDef<DemoStaffMember, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => staffRoleLabel[info.getValue() as DemoStaffMember["role"]],
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as DemoStaffMember["status"];
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
