import { ShieldAlert } from "lucide-react";
import { demoAuditEvents } from "@/lib/demo/audit";
import { AuditTable } from "@/features/audit/components/audit-table";
import { PageHeader } from "@/components/shared/page-header";

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldAlert} title="Audit log" />
      <AuditTable events={demoAuditEvents} />
    </div>
  );
}
