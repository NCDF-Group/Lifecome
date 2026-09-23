/**
 * Demo eligibility checks standing in for `GET /api/v1/eligibility`
 * (Lifecome-backend's `eligibility` module).
 */
export type DemoEligibilityCheck = {
  id: string;
  patientName: string;
  payerName: string;
  serviceType: string;
  checkedAt: string;
  result: "eligible" | "not_eligible" | "pending";
  turnaroundSeconds: number;
};

export const demoEligibilityChecks: DemoEligibilityCheck[] = [
  {
    id: "elig-001",
    patientName: "Ngozi Adeyemi",
    payerName: "Reliance HMO",
    serviceType: "General consultation",
    checkedAt: "2026-09-23T09:12:00+01:00",
    result: "eligible",
    turnaroundSeconds: 2,
  },
  {
    id: "elig-002",
    patientName: "Ada Okonkwo",
    payerName: "Reliance HMO",
    serviceType: "Specialist consultation",
    checkedAt: "2026-09-22T14:03:00+01:00",
    result: "eligible",
    turnaroundSeconds: 3,
  },
  {
    id: "elig-003",
    patientName: "Folasade Ogunleye",
    payerName: "AVON HMO",
    serviceType: "Laboratory test",
    checkedAt: "2026-09-21T10:45:00+01:00",
    result: "not_eligible",
    turnaroundSeconds: 4,
  },
  {
    id: "elig-004",
    patientName: "Chika Eze",
    payerName: "Hygeia HMO",
    serviceType: "General consultation",
    checkedAt: "2026-09-20T16:30:00+01:00",
    result: "pending",
    turnaroundSeconds: 0,
  },
];
