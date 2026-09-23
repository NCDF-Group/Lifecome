import type { ColumnDef } from "@tanstack/react-table";
import type { DemoConsentGrant } from "@/lib/demo/consent";
import { StatusPill } from "@/components/shared/status-pill";

export const consentColumns: ColumnDef<DemoConsentGrant, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "grantedTo", header: "Granted to" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "scope", header: "Scope" },
  {
    accessorKey: "grantedAt",
    header: "Granted",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <StatusPill
        tone={info.getValue() === "active" ? "success" : "neutral"}
        label={info.getValue() === "active" ? "Active" : "Revoked"}
      />
    ),
  },
];
