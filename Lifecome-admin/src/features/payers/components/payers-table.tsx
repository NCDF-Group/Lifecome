"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { DemoPayer } from "@/lib/demo/payers";
import { payersColumns } from "@/features/payers/components/payers-columns";

export function PayersTable({ payers }: { payers: DemoPayer[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={payersColumns}
      data={payers}
      searchPlaceholder="Search payers by name"
      onRowClick={(payer) => router.push(`/payers/${payer.id}`)}
    />
  );
}
