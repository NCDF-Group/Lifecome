# Phased Backlog

Derived from blueprint §20 (phases), §4 (22 views), §5 (36 pages), §21 (acceptance checklist). Stack assumptions are in [tech-stack-recommendation](../architecture/tech-stack-recommendation.md). Epics are sized S/M/L/XL as a rough relative guide, not a commitment.

Cross-cutting **Definition of Done** on every item (§17.1): acceptance criteria, analytics events, audit events, error states, accessibility, security controls, automated tests, runbook, rollback path.

## Phase 0 — Discovery & architecture

Exit: approved architecture and backlog.

| ID | Epic | Size | Notes |
|---|---|---|---|
| P0-1 | Ratify ADRs (see stack doc §6) | M | Includes ⚠ decisions: hosting, RTC, payments, SMS |
| P0-2 | Legal/regulatory review and DPIA | L | Health data, telemedicine practice, consent model, retention schedule |
| P0-3 | Clinical governance SOPs (draft) | L | Escalation, emergency boundary, prescribing, safeguarding, record amendment |
| P0-4 | Payer discovery: LifeCome HMO + first external HMOs | L | Which integration mode each supports; sample data; SLAs |
| P0-5 | Domain model and state-machine specs | M | Entities from §8; transition tables from §5 of stack doc |
| P0-6 | OpenAPI skeleton and error-code catalogue | M | Machine-readable codes + patient-safe messages |
| P0-7 | Design system: tokens, component inventory, status chips | L | Palette §6.3; contrast audit — Lime `#A2E10D` and Cyan `#3DE5F8` fail text contrast on white, so use only as accents |
| P0-8 | Event dictionary for analytics | S | §18; no clinical data |
| P0-9 | Launch-subset decision for the 36 pages | S | Product call |
| P0-10 | Threat model v1 | M | |

## Phase 1 — Foundation

Exit: secure base platform.

| ID | Epic | Size |
|---|---|---|
| P1-1 | Monorepo scaffold, CI/CD, IaC, environments, secrets | L |
| P1-2 | Design-system package (tokens → CSS/Tailwind for web + Dart theme for Flutter via Style Dictionary), Storybook | L |
| P1-2b | OpenAPI contract pipeline: Zod → OpenAPI → generated TS and Dart clients, drift check in CI, mock server | M |
| P1-3 | Identity: sign-up/in, OTP with anti-abuse, sessions, staff MFA (views 01–02) | XL |
| P1-4 | RBAC + assignment-based access framework | L |
| P1-5 | Audit service (append-only, hash-chained) | M |
| P1-6 | Consent service (versioned terms/privacy) | M |
| P1-7 | Patient profile + dependant-ready model (view 03) | M |
| P1-8 | Provider directory + credential metadata | L |
| P1-9 | Scheduling: availability, slot holds, timezones | L |
| P1-10 | Public website shell + CMS content model + nav (§5.1) | L |
| P1-11 | Notifications service (templates, versioning, SMS/email/push) | L |
| P1-12 | Observability baseline (logs, traces, metrics, correlation IDs) | M |

## Phase 2 — Care access

Exit: end-to-end booking works (HMO and direct-pay).

| ID | Epic | Size |
|---|---|---|
| P2-1 | Payer registry + adapter framework + fake-payer simulator | L |
| P2-2 | Payer selector, Choose How to Pay (views 05–06) | M |
| P2-3 | HMO membership verification + all §4.1 states (view 07) | L |
| P2-4 | Coverage & benefits, service eligibility (views 08–09) | L |
| P2-5 | First real payer adapter (LifeCome HMO), via listed integration mode | L |
| P2-6 | Service catalogue + payer mappings + pricing (view 10) | M |
| P2-7 | Doctor discovery + profile (views 11–12), payer-aware filtering | L |
| P2-8 | Appointment time selection + slot hold (view 13) | M |
| P2-9 | Pre-visit intake + uploads (view 14) | M |
| P2-10 | Booking review (view 15), booking state machine | L |
| P2-11 | Payment service: intents, gateway abstraction, idempotency, webhooks, receipts (view 16) | XL |
| P2-12 | Authorisation service: request/status/expiry/exceptions (view 16) | L |
| P2-13 | Booking confirmation, reminders, calendar (view 17) | M |
| P2-14 | Patient dashboard (view 04) | M |
| P2-15 | Website: Access, Services, Booking-gateway pages (01–18) | L |
| P2-16 | Ops console v1: payer config, exception queues, booking ops | L |

## Phase 3 — Virtual care

Exit: clinical consultation works.

| ID | Epic | Size |
|---|---|---|
| P3-1 | Consultation service: room creation, short-lived tokens | L |
| P3-2 | Waiting room + device/network check + state machine (view 18) | L |
| P3-3 | Video/audio consultation, in-call chat, reconnect, audio fallback (view 19) | XL |
| P3-4 | No-show, late-join and support-escalation handling | M |
| P3-5 | Provider workspace: dashboard, calendar, pre-visit summary, launch | L |
| P3-6 | Encounter creation + clinical note authoring and signing | L |
| P3-7 | Load test for concurrent consultations | M |
| P3-8 | Clinical UAT round 1 | M |

## Phase 4 — Continuity

Exit: post-visit care works.

| ID | Epic | Size |
|---|---|---|
| P4-1 | Clinical records service: append-only notes, amendments, lifecycle states | XL |
| P4-2 | Care plan (versioned, linked to encounter) + visit summary (view 20) | L |
| P4-3 | Prescriptions, referrals, diagnostic orders | L |
| P4-4 | Results: provider uploads, provenance, clinician-review status | L |
| P4-5 | Health records view + record access controls + revocation (view 21) | L |
| P4-6 | Secure messaging (view 22) + care-team inbox | L |
| P4-7 | Care coordination tasks and provider handoffs | M |
| P4-8 | Network provider access (time-bounded, order-scoped) | L |
| P4-9 | Website: care plan, records, access, provider network pages (19–25) | M |

## Phase 5 — Operations & scale

Exit: production operational readiness.

| ID | Epic | Size |
|---|---|---|
| P5-1 | Payment and payer reconciliation (daily reports) | L |
| P5-2 | Refund policy engine and refund states | M |
| P5-3 | Ops console complete: provider onboarding, credential verification, governance queues, audit viewer | XL |
| P5-4 | Analytics pipeline and operational dashboards | M |
| P5-5 | Alerts, runbooks, on-call | M |
| P5-6 | Backup/restore drills; DR exercise (define RTO/RPO) | M |
| P5-7 | Security: pen test, SAST/DAST, privileged-access review | L |
| P5-8 | Accessibility audit (web + mobile) | M |
| P5-9 | Remaining public pages: partners, trust, help, legal, emergency (26–36) | L |
| P5-10 | Cross-device QA, performance budgets | M |
| P5-11 | Walk the §21 acceptance checklist; go-live readiness review | M |

## Phase 6 — Expansion

Exit: repeatable partner onboarding.

- Onboarding playbook and self-serve config for new HMOs (adapter/config path).
- Additional payer adapters (batch/file, ops-portal, rules-config modes).
- Employer / sponsored-access payer type.
- Additional provider integrations (labs, pharmacies, clinics/hospitals).
- Dependant/guardian journeys at full scope.

## Open questions for the product owner

1. Which HMOs, beyond LifeCome HMO, are contracted for launch, and what integration modes do they support?
2. Which launch subset of the 36 pages is required for go-live?
3. Is prescribing (and any controlled-medicine handling) in launch scope, and under what clinical/regulatory rules?
4. Are patients under 18 or dependants supported at launch, or only "dependant-ready" data model?
5. Target launch date and team size (these drive phase parallelism).
6. Any existing brand assets, Figma files or logo files to build the design system from?
