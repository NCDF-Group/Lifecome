import type { ColumnDef } from "@tanstack/react-table";
import type { DemoProvider } from "@/lib/demo/providers";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<DemoProvider["status"], string> = {
  active: "Active",
  suspended: "Suspended",
  pending_review: "Pending review",
};

const statusTone: Record<
  DemoProvider["status"],
  "success" | "warning" | "destructive"
> = {
  active: "success",
  suspended: "destructive",
  pending_review: "warning",
};

export const providersColumns: ColumnDef<DemoProvider, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "specialty", header: "Specialty" },
  { accessorKey: "clinicName", header: "Clinic" },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: (info) => {
      const row = info.row.original;
      return `${row.rating} (${row.reviewCount})`;
    },
  },
  {
    accessorKey: "yearsOfExperience",
    header: "Experience",
    cell: (info) => `${info.getValue() as number} yrs`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as DemoProvider["status"];
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
