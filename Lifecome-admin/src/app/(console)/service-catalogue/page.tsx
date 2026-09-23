import { Package } from "lucide-react";
import { demoServices } from "@/lib/demo/service-catalogue";
import { ServiceCatalogueTable } from "@/features/service-catalogue/components/service-catalogue-table";
import { PageHeader } from "@/components/shared/page-header";

export default function ServiceCataloguePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Package} title="Service catalogue" />
      <ServiceCatalogueTable services={demoServices} />
    </div>
  );
}
