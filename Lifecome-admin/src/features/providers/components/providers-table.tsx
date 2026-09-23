"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { DemoProvider } from "@/lib/demo/providers";
import { providersColumns } from "@/features/providers/components/providers-columns";

export function ProvidersTable({ providers }: { providers: DemoProvider[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={providersColumns}
      data={providers}
      searchPlaceholder="Search providers by name or specialty"
      onRowClick={(provider) => router.push(`/providers/${provider.id}`)}
    />
  );
}
