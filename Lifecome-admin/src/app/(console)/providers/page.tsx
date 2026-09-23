import { Stethoscope } from "lucide-react";
import { demoProviders } from "@/lib/demo/providers";
import { ProvidersTable } from "@/features/providers/components/providers-table";
import { PageHeader } from "@/components/shared/page-header";

export default function ProvidersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Stethoscope} title="Providers" />
      <ProvidersTable providers={demoProviders} />
    </div>
  );
}
