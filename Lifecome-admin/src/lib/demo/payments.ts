/**
 * Demo transactions standing in for `GET /api/v1/payments` (Lifecome-
 * backend's `payment` module). Shapes match Lifecome-mobile's
 * `PaymentTransaction`/`PaymentStatus` models.
 */
export type PaymentStatus = "successful" | "pending" | "failed" | "refunded";

export type DemoTransaction = {
  id: string;
  patientName: string;
  description: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  reference: string;
  date: string;
};

export const demoTransactions: DemoTransaction[] = [
  {
    id: "txn-001",
    patientName: "Ngozi Adeyemi",
    description: "General consultation — Dr. Adaeze Okonkwo",
    amount: 8000,
    method: "HMO / Insurance",
    status: "successful",
    reference: "LC-TX-88231",
    date: "2026-09-22",
  },
  {
    id: "txn-002",
    patientName: "Emeka Nwosu",
    description: "Specialist consultation — Dr. Tunde Bakare",
    amount: 15000,
    method: "Debit card",
    status: "successful",
    reference: "LC-TX-88012",
    date: "2026-09-14",
  },
  {
    id: "txn-003",
    patientName: "Chika Eze",
    description: "Lab test — LifeCome Live Lab Partner",
    amount: 18500,
    method: "Bank transfer",
    status: "pending",
    reference: "LC-TX-87801",
    date: "2026-09-10",
  },
  {
    id: "txn-004",
    patientName: "Folasade Ogunleye",
    description: "Cardiology consultation — Dr. Tunde Bakare",
    amount: 15000,
    method: "Wallet balance",
    status: "refunded",
    reference: "LC-TX-84210",
    date: "2026-08-08",
  },
];
