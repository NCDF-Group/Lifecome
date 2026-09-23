"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoTransaction } from "@/lib/demo/payments";
import { paymentsColumns } from "@/features/payments/components/payments-columns";

export function PaymentsTable({
  transactions,
}: {
  transactions: DemoTransaction[];
}) {
  return (
    <DataTable
      columns={paymentsColumns}
      data={transactions}
      searchPlaceholder="Search payments by patient or reference"
    />
  );
}
