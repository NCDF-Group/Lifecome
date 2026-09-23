"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoStaffMember } from "@/lib/demo/staff";
import { staffColumns } from "@/features/staff/components/staff-columns";

export function StaffTable({ staff }: { staff: DemoStaffMember[] }) {
  return (
    <DataTable
      columns={staffColumns}
      data={staff}
      searchPlaceholder="Search staff by name or email"
    />
  );
}
