"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoBooking } from "@/lib/demo/bookings";
import { bookingsColumns } from "@/features/bookings/components/bookings-columns";

export function BookingsTable({ bookings }: { bookings: DemoBooking[] }) {
  return (
    <DataTable
      columns={bookingsColumns}
      data={bookings}
      searchPlaceholder="Search bookings by patient or doctor"
    />
  );
}
