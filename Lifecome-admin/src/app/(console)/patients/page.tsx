import { Users } from "lucide-react";
import { demoPatients } from "@/lib/demo/patients";
import { PatientsTable } from "@/features/patients/components/patients-table";
import { PageHeader } from "@/components/shared/page-header";

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Users} title="Patients" />
      <PatientsTable patients={demoPatients} />
    </div>
  );
}
