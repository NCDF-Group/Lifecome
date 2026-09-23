import type { ColumnDef } from "@tanstack/react-table";
import type { DemoService } from "@/lib/demo/service-catalogue";
import { StatusPill } from "@/components/shared/status-pill";

export const serviceCatalogueColumns: ColumnDef<DemoService, unknown>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "basePrice",
    header: "Price",
    cell: (info) => `₦${(info.getValue() as number).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "durationMinutes",
    header: "Duration",
    cell: (info) => `${info.getValue() as number} min`,
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: (info) => (
      <StatusPill
        tone={info.getValue() ? "success" : "neutral"}
        label={info.getValue() ? "Active" : "Inactive"}
      />
    ),
  },
];
