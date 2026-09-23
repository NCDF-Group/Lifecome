/**
 * Demo audit events standing in for `GET /api/v1/audit` (Lifecome-
 * backend's `audit` module). Per the blueprint (§7), audit needs to cover
 * clinical, payer, record-access and admin actions — the `category`
 * field below mirrors that split.
 */
export type AuditCategory = "clinical" | "payer" | "record_access" | "admin";
export type AuditSeverity = "info" | "warning" | "critical";

export type DemoAuditEvent = {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  entity: string;
  category: AuditCategory;
  severity: AuditSeverity;
};

export const demoAuditEvents: DemoAuditEvent[] = [
  {
    id: "audit-001",
    occurredAt: "2026-09-23T08:12:00+01:00",
    actor: "Dr. Tunde Bakare",
    action: "Viewed clinical record",
    entity: "Patient: Ngozi Adeyemi",
    category: "record_access",
    severity: "info",
  },
  {
    id: "audit-002",
    occurredAt: "2026-09-23T07:44:00+01:00",
    actor: "system",
    action: "Payer authorisation expired without a claim",
    entity: "Reliance HMO — auth-4821",
    category: "payer",
    severity: "critical",
  },
  {
    id: "audit-003",
    occurredAt: "2026-09-23T06:59:00+01:00",
    actor: "provider-account",
    action: "3 failed sign-in attempts",
    entity: "Dr. Chika Eze",
    category: "admin",
    severity: "warning",
  },
  {
    id: "audit-004",
    occurredAt: "2026-09-22T21:30:00+01:00",
    actor: "Ada Okonkwo",
    action: "Revoked record access grant",
    entity: "Grant: Reliance HMO",
    category: "record_access",
    severity: "info",
  },
  {
    id: "audit-005",
    occurredAt: "2026-09-22T18:05:00+01:00",
    actor: "Dr. Adaeze Okonkwo",
    action: "Prescribed medication",
    entity: "Patient: Ngozi Adeyemi — Lisinopril 10mg",
    category: "clinical",
    severity: "info",
  },
  {
    id: "audit-006",
    occurredAt: "2026-09-22T15:20:00+01:00",
    actor: "platform-admin: yemi.adisa@lifecomelive.com",
    action: "Suspended provider from network",
    entity: "Dr. Emeka Nwosu",
    category: "admin",
    severity: "warning",
  },
];
