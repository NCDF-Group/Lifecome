import type { ColumnDef } from "@tanstack/react-table";
import type { DemoEligibilityCheck } from "@/lib/demo/eligibility";
import { StatusPill } from "@/components/shared/status-pill";

const resultLabel: Record<DemoEligibilityCheck["result"], string> = {
  eligible: "Eligible",
  not_eligible: "Not eligible",
  pending: "Pending",
};

const resultTone: Record<
  DemoEligibilityCheck["result"],
  "success" | "destructive" | "warning"
> = {
  eligible: "success",
  not_eligible: "destructive",
  pending: "warning",
};

export const eligibilityColumns: ColumnDef<DemoEligibilityCheck, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "payerName", header: "Payer" },
  { accessorKey: "serviceType", header: "Service" },
  {
    accessorKey: "checkedAt",
    header: "Checked",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "turnaroundSeconds",
    header: "Turnaround",
    cell: (info) => {
      const seconds = info.getValue() as number;
      return seconds > 0 ? `${seconds}s` : "—";
    },
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: (info) => {
      const result = info.getValue() as DemoEligibilityCheck["result"];
      return <StatusPill tone={resultTone[result]} label={resultLabel[result]} />;
    },
  },
];
