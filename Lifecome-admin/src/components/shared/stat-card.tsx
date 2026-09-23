import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { DashboardStat } from "@/lib/demo/dashboard";
import { cn } from "@/lib/utils";

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
} as const;

const trendColor = {
  up: "text-positive",
  down: "text-destructive",
  flat: "text-ink-muted",
} as const;

export function StatCard({ label, value, delta, trend, icon: Icon }: DashboardStat) {
  const TrendIcon = trendIcon[trend];

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-control bg-blue/10 text-blue">
          <Icon className="size-4" />
        </div>
      </div>
      <span className="text-3xl font-bold text-ink">{value}</span>
      <span
        className={cn(
          "flex items-center gap-1 text-xs font-semibold",
          trendColor[trend],
        )}
      >
        <TrendIcon className="size-3.5" />
        {delta}
      </span>
    </div>
  );
}
