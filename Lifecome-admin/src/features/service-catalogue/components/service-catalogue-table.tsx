"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoService } from "@/lib/demo/service-catalogue";
import { serviceCatalogueColumns } from "@/features/service-catalogue/components/service-catalogue-columns";

export function ServiceCatalogueTable({
  services,
}: {
  services: DemoService[];
}) {
  return (
    <DataTable
      columns={serviceCatalogueColumns}
      data={services}
      searchPlaceholder="Search services"
    />
  );
}
