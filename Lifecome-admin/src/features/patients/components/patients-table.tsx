"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { DemoPatient } from "@/lib/demo/patients";
import { patientsColumns } from "@/features/patients/components/patients-columns";

export function PatientsTable({ patients }: { patients: DemoPatient[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={patientsColumns}
      data={patients}
      searchPlaceholder="Search patients by name, email or phone"
      onRowClick={(patient) => router.push(`/patients/${patient.id}`)}
    />
  );
}
