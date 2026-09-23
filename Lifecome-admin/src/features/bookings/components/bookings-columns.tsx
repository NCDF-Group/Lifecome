import type { ColumnDef } from "@tanstack/react-table";
import type { BookingStatus, DemoBooking } from "@/lib/demo/bookings";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<BookingStatus, string> = {
  pending_payment: "Awaiting payment",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusTone: Record<
  BookingStatus,
  "success" | "warning" | "destructive" | "neutral"
> = {
  pending_payment: "warning",
  confirmed: "success",
  completed: "neutral",
  cancelled: "destructive",
};

export const bookingsColumns: ColumnDef<DemoBooking, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "doctorName", header: "Doctor" },
  { accessorKey: "service", header: "Service" },
  {
    accessorKey: "scheduledAt",
    header: "Scheduled",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: (info) => `₦${(info.getValue() as number).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as BookingStatus;
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
