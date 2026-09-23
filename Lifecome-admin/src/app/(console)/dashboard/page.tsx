import { AlertTriangle, Info, LayoutDashboard, ShieldAlert } from "lucide-react";
import { BookingsOverviewChart } from "@/components/charts/overview-chart";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  bookingsLast7Days,
  dashboardStats,
  payerMix,
  recentAuditAlerts,
  type AuditAlert,
} from "@/lib/demo/dashboard";
import { cn } from "@/lib/utils";

const severityIcon: Record<AuditAlert["severity"], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

const severityColor: Record<AuditAlert["severity"], string> = {
  info: "text-blue",
  warning: "text-warning",
  critical: "text-destructive",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={LayoutDashboard} title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">
            Bookings, last 7 days
          </h2>
          <BookingsOverviewChart data={bookingsLast7Days} />
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
          <h2 className="text-sm font-semibold text-ink">Payer mix</h2>
          <ul className="flex flex-col gap-3">
            {payerMix.map((entry) => (
              <li key={entry.payer} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span>{entry.payer}</span>
                  <span className="font-semibold text-ink">
                    {entry.share}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-blue"
                    style={{ width: `${entry.share}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">
          Recent audit alerts
        </h2>
        <ul className="flex flex-col divide-y divide-line">
          {recentAuditAlerts.map((alert) => {
            const Icon = severityIcon[alert.severity];
            return (
              <li key={alert.id} className="flex items-start gap-3 py-3">
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    severityColor[alert.severity],
                  )}
                />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm text-ink">{alert.message}</span>
                  <span className="text-xs text-ink-muted">
                    {alert.occurredAt}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
