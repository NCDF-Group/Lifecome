import type { ColumnDef } from "@tanstack/react-table";
import type { DemoPatient } from "@/lib/demo/patients";
import { StatusPill } from "@/components/shared/status-pill";

export const patientsColumns: ColumnDef<DemoPatient, unknown>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phoneNumber", header: "Phone" },
  {
    accessorKey: "payerName",
    header: "Payer",
    cell: (info) => (info.getValue() as string | null) ?? "—",
  },
  {
    accessorKey: "memberSince",
    header: "Member since",
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
        label={info.getValue() === "active" ? "Active" : "Inactive"}
      />
    ),
  },
];
