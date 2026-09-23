"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoConsentGrant } from "@/lib/demo/consent";
import { consentColumns } from "@/features/consent/components/consent-columns";

export function ConsentTable({ grants }: { grants: DemoConsentGrant[] }) {
  return (
    <DataTable
      columns={consentColumns}
      data={grants}
      searchPlaceholder="Search by patient or who they granted access to"
    />
  );
}
