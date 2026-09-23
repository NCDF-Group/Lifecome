/**
 * Demo consent/access grants standing in for `GET /api/v1/consent`
 * (Lifecome-backend's `consent` module). Shapes match Lifecome-mobile's
 * `AccessGrant` model.
 */
export type DemoConsentGrant = {
  id: string;
  patientName: string;
  grantedTo: string;
  role: string;
  scope: string;
  grantedAt: string;
  status: "active" | "revoked";
};

export const demoConsentGrants: DemoConsentGrant[] = [
  {
    id: "consent-001",
    patientName: "Ngozi Adeyemi",
    grantedTo: "Dr. Adaeze Okonkwo",
    role: "Primary care doctor",
    scope: "Full record",
    grantedAt: "2026-02-24",
    status: "active",
  },
  {
    id: "consent-002",
    patientName: "Ngozi Adeyemi",
    grantedTo: "Dr. Tunde Bakare",
    role: "Cardiologist",
    scope: "Full record",
    grantedAt: "2026-08-22",
    status: "active",
  },
  {
    id: "consent-003",
    patientName: "Ngozi Adeyemi",
    grantedTo: "Reliance HMO",
    role: "Linked payer",
    scope: "Visit summaries and claims only",
    grantedAt: "2026-02-24",
    status: "active",
  },
  {
    id: "consent-004",
    patientName: "Ada Okonkwo",
    grantedTo: "Reliance HMO",
    role: "Linked payer",
    scope: "Visit summaries and claims only",
    grantedAt: "2025-11-01",
    status: "revoked",
  },
];
