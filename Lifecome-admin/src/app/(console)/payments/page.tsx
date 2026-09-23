import { CreditCard } from "lucide-react";
import { demoTransactions } from "@/lib/demo/payments";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { PageHeader } from "@/components/shared/page-header";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CreditCard} title="Payments" />
      <PaymentsTable transactions={demoTransactions} />
    </div>
  );
}
