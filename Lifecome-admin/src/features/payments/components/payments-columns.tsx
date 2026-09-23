import type { ColumnDef } from "@tanstack/react-table";
import type { DemoTransaction, PaymentStatus } from "@/lib/demo/payments";
import { StatusPill } from "@/components/shared/status-pill";

const statusTone: Record<
  PaymentStatus,
  "success" | "warning" | "destructive" | "neutral"
> = {
  successful: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "neutral",
};

export const paymentsColumns: ColumnDef<DemoTransaction, unknown>[] = [
  { accessorKey: "reference", header: "Reference" },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "method", header: "Method" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => `₦${(info.getValue() as number).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "date",
    header: "Date",
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
    cell: (info) => {
      const status = info.getValue() as PaymentStatus;
      return (
        <StatusPill
          tone={statusTone[status]}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      );
    },
  },
];
