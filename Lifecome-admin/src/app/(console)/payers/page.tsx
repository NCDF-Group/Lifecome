import { Building2 } from "lucide-react";
import { demoPayers } from "@/lib/demo/payers";
import { PayersTable } from "@/features/payers/components/payers-table";
import { PageHeader } from "@/components/shared/page-header";

export default function PayersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Building2} title="Payers" />
      <PayersTable payers={demoPayers} />
    </div>
  );
}
