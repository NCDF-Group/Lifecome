import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User } from "lucide-react";
import { getDemoPatient } from "@/lib/demo/patients";
import { StatusPill } from "@/components/shared/status-pill";

export default async function PatientDetailPage({
  params,
}: PageProps<"/patients/[patientId]">) {
  const { patientId } = await params;
  const patient = getDemoPatient(patientId);

  if (!patient) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/patients"
          className="flex items-center gap-1 text-sm font-medium text-blue"
        >
          <ChevronLeft className="size-4" />
          Patients
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
            <User className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              {patient.fullName}
            </h1>
            <p className="text-sm text-ink-muted">{patient.email}</p>
          </div>
        </div>
        <StatusPill
          tone={patient.status === "active" ? "success" : "neutral"}
          label={patient.status === "active" ? "Active" : "Inactive"}
        />
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-card border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Phone</dt>
          <dd className="mt-1 font-medium text-ink">{patient.phoneNumber}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Payer</dt>
          <dd className="mt-1 font-medium text-ink">
            {patient.payerName ?? "None linked"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Member since</dt>
          <dd className="mt-1 font-medium text-ink">
            {new Date(patient.memberSince).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Patient ID</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{patient.id}</dd>
        </div>
      </dl>

      <div className="rounded-card border border-dashed border-line p-5 text-sm text-ink-muted">
        Bookings, clinical records and consent settings for this patient go
        here once the corresponding backend modules are wired up — see
        README.md.
      </div>
    </div>
  );
}
