import { ShieldQuestion } from "lucide-react";
import { demoEligibilityChecks } from "@/lib/demo/eligibility";
import { EligibilityTable } from "@/features/eligibility/components/eligibility-table";
import { PageHeader } from "@/components/shared/page-header";

export default function EligibilityPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldQuestion} title="Eligibility checks" />
      <EligibilityTable checks={demoEligibilityChecks} />
    </div>
  );
}
