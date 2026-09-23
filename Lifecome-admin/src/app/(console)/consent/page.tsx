import { ShieldCheck } from "lucide-react";
import { demoConsentGrants } from "@/lib/demo/consent";
import { ConsentTable } from "@/features/consent/components/consent-table";
import { PageHeader } from "@/components/shared/page-header";

export default function ConsentPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldCheck} title="Consent records" />
      <ConsentTable grants={demoConsentGrants} />
    </div>
  );
}
