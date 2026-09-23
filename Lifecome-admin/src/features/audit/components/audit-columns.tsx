import type { ColumnDef } from "@tanstack/react-table";
import type { AuditSeverity, DemoAuditEvent } from "@/lib/demo/audit";
import { StatusPill } from "@/components/shared/status-pill";

const severityTone: Record<AuditSeverity, "info" | "warning" | "destructive"> = {
  info: "info",
  warning: "warning",
  critical: "destructive",
};

const categoryLabel: Record<DemoAuditEvent["category"], string> = {
  clinical: "Clinical",
  payer: "Payer",
  record_access: "Record access",
  admin: "Admin",
};

export const auditColumns: ColumnDef<DemoAuditEvent, unknown>[] = [
  {
    accessorKey: "occurredAt",
    header: "When",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "entity", header: "Entity" },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => categoryLabel[info.getValue() as DemoAuditEvent["category"]],
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: (info) => {
      const severity = info.getValue() as AuditSeverity;
      return (
        <StatusPill
          tone={severityTone[severity]}
          label={severity.charAt(0).toUpperCase() + severity.slice(1)}
        />
      );
    },
  },
];
