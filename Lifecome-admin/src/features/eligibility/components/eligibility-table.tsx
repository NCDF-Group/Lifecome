"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoEligibilityCheck } from "@/lib/demo/eligibility";
import { eligibilityColumns } from "@/features/eligibility/components/eligibility-columns";

export function EligibilityTable({
  checks,
}: {
  checks: DemoEligibilityCheck[];
}) {
  return (
    <DataTable
      columns={eligibilityColumns}
      data={checks}
      searchPlaceholder="Search by patient or payer"
    />
  );
}
