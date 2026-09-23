import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, Stethoscope } from "lucide-react";
import { getDemoProvider } from "@/lib/demo/providers";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel = {
  active: "Active",
  suspended: "Suspended",
  pending_review: "Pending review",
} as const;

const statusTone = {
  active: "success",
  suspended: "destructive",
  pending_review: "warning",
} as const;

export default async function ProviderDetailPage({
  params,
}: PageProps<"/providers/[providerId]">) {
  const { providerId } = await params;
  const provider = getDemoProvider(providerId);

  if (!provider) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/providers"
          className="flex items-center gap-1 text-sm font-medium text-blue"
        >
          <ChevronLeft className="size-4" />
          Providers
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue">
            <Stethoscope className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              {provider.name}
            </h1>
            <p className="text-sm text-ink-muted">
              {provider.specialty} · {provider.qualifications}
            </p>
          </div>
        </div>
        <StatusPill
          tone={statusTone[provider.status]}
          label={statusLabel[provider.status]}
        />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-ink">
        <Star className="size-4 fill-gold text-gold" />
        <span className="font-semibold">{provider.rating}</span>
        <span className="text-ink-muted">
          ({provider.reviewCount} reviews)
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-card border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Clinic</dt>
          <dd className="mt-1 font-medium text-ink">{provider.clinicName}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Experience</dt>
          <dd className="mt-1 font-medium text-ink">
            {provider.yearsOfExperience} years
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Provider ID</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{provider.id}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          title="Not wired up yet — needs a backend write endpoint"
          className="rounded-control border border-line px-4 py-2 text-sm font-semibold text-ink opacity-50 disabled:cursor-not-allowed"
        >
          Suspend from network
        </button>
        <button
          type="button"
          disabled
          title="Not wired up yet — needs a backend write endpoint"
          className="rounded-control border border-line px-4 py-2 text-sm font-semibold text-ink opacity-50 disabled:cursor-not-allowed"
        >
          Edit credentials
        </button>
      </div>

      <div className="rounded-card border border-dashed border-line p-5 text-sm text-ink-muted">
        Availability, consultation history and credential documents for this
        provider go here once `provider-directory` and `documents` are wired
        up — see README.md.
      </div>
    </div>
  );
}
