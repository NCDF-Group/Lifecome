import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getDemoPayer } from "@/lib/demo/payers";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel = {
  connected: "Connected",
  degraded: "Degraded",
  not_connected: "Not connected",
} as const;

const statusTone = {
  connected: "success",
  degraded: "warning",
  not_connected: "neutral",
} as const;

export default async function PayerDetailPage({
  params,
}: PageProps<"/payers/[payerId]">) {
  const { payerId } = await params;
  const payer = getDemoPayer(payerId);

  if (!payer) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/payers"
          className="flex items-center gap-1 text-sm font-medium text-blue"
        >
          <ChevronLeft className="size-4" />
          Payers
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue/10 text-sm font-bold text-blue-strong">
            {payer.shortCode}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              {payer.name}
            </h1>
            <p className="text-sm text-ink-muted">{payer.supportPhone}</p>
          </div>
        </div>
        <StatusPill
          tone={statusTone[payer.integrationStatus]}
          label={statusLabel[payer.integrationStatus]}
        />
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-card border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Active members</dt>
          <dd className="mt-1 font-medium text-ink">
            {payer.activeMembers.toLocaleString("en-NG")}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Payer ID</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{payer.id}</dd>
        </div>
      </dl>

      <div className="rounded-card border border-dashed border-line p-5 text-sm text-ink-muted">
        Plan benefit rules, claims reconciliation and eligibility check
        history for this payer go here once `payer` and `eligibility` are
        wired up — see README.md.
      </div>
    </div>
  );
}
