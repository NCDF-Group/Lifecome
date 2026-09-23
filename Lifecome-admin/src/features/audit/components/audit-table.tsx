"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoAuditEvent } from "@/lib/demo/audit";
import { auditColumns } from "@/features/audit/components/audit-columns";

export function AuditTable({ events }: { events: DemoAuditEvent[] }) {
  return (
    <DataTable
      columns={auditColumns}
      data={events}
      searchPlaceholder="Search audit events by actor, action or entity"
    />
  );
}
