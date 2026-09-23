import type { ColumnDef } from "@tanstack/react-table";
import type { DemoPayer } from "@/lib/demo/payers";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<DemoPayer["integrationStatus"], string> = {
  connected: "Connected",
  degraded: "Degraded",
  not_connected: "Not connected",
};

const statusTone: Record<
  DemoPayer["integrationStatus"],
  "success" | "warning" | "neutral"
> = {
  connected: "success",
  degraded: "warning",
  not_connected: "neutral",
};

export const payersColumns: ColumnDef<DemoPayer, unknown>[] = [
  {
    accessorKey: "name",
    header: "Payer",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "shortCode", header: "Code" },
  { accessorKey: "supportPhone", header: "Support line" },
  {
    accessorKey: "activeMembers",
    header: "Active members",
    cell: (info) => (info.getValue() as number).toLocaleString("en-NG"),
  },
  {
    accessorKey: "integrationStatus",
    header: "Integration",
    cell: (info) => {
      const status = info.getValue() as DemoPayer["integrationStatus"];
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
