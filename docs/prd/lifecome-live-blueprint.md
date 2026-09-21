# LifeCome Live — Technology Development Blueprint

Version 1.0 | 16 September 2026
Scope: Mobile application, website, backend, frontend, data, security, DevOps, UI/UX.

**Purpose.** Production guide for engineering, product, UI/UX, QA, security and operations teams delivering LifeCome Live as a multi-payer digital healthcare and coordinated-care platform. It separates LifeCome Live from LifeCome HMO and supports participating HMOs, direct payment and future employer-sponsored access.

Detailed API specs, database schemas, clinical SOPs, payer-specific interface specs, threat models and sprint-level acceptance criteria are controlled subordinate documents.

---

## 1. Executive Summary

LifeCome Live is a modular digital healthcare platform, not a single telemedicine app. It supports public-website acquisition, authenticated care journeys on web and mobile, multi-HMO eligibility and authorisation, direct payments, online consultations, provider-network coordination, care plans, health records and secure messaging.

> **Critical operating principle.** LifeCome Live is the healthcare delivery and coordination platform. LifeCome HMO is a separate HMO business and is one participating payer within a multi-HMO architecture. Payer choice determines funding and authorisation; it must not fragment the clinical record or care pathway.

### 1.1 Digital estate

| Layer | Scope | Primary users |
|---|---|---|
| Public website | 36 core public pages | Patients, HMOs, providers, employers, partners |
| Authenticated patient app | 22 core views plus transactional states | Patients and dependants |
| Provider workspace | Role-based clinical/provider modules | Doctors, care coordinators, approved network providers |
| Operations console | Admin, payer, support, audit, content modules | LifeCome Live operations |
| Integration layer | HMO, payments, messaging, video, diagnostics, provider APIs | Systems and external partners |

### 1.2 Product outcomes

- A patient registers once and accesses care via a participating HMO, direct payment or future sponsored access.
- The clinical journey converges after payer/authorisation: same consultation, care-plan, record and follow-up framework for everyone.
- Authorised provider-network participants can contribute to the patient's record subject to permissions and role controls.
- Public website and authenticated apps share one design system, content model, identity service and analytics taxonomy.
- Every material clinical, payer, record-access and administrative action is auditable.

---

## 2. Product Scope and System Boundaries

### 2.1 In scope

- Patient registration, authentication, profile, dependant-ready identity model.
- Multi-HMO selection, membership verification, coverage display, service eligibility and authorisation.
- Direct-pay booking, payment, receipt, refund/cancellation state, transaction reconciliation.
- Doctor discovery, profile, availability, booking, reminders, waiting-room workflow.
- Secure video/audio consultation and consultation messaging.
- Clinical notes, visit summaries, care plans, prescriptions, referrals, results, follow-up.
- Provider-network records and controlled document upload.
- Patient support, care-team messaging, notifications, emergency guidance.
- Public content website, partner pages, help centre, governance and legal/privacy content.
- Admin, clinical ops, payer ops, provider ops, audit and reporting.

### 2.2 Explicit boundaries

- Not an HMO product catalogue; does not replicate LifeCome HMO's corporate website.
- Must not imply an HMO is accepted until commercial, operational and technical onboarding is complete.
- The health record is a LifeCome Live/provider-network longitudinal record, not a universal national EHR.
- Emergency care is outside the core telemedicine workflow; clear escalation guidance is required.
- HMO coverage shown in the UI is a payer-supplied or rules-configured decision, not a clinical guarantee.

### 2.3 Personas and roles

| Role | Core permissions |
|---|---|
| Patient | Book care, select payer, pay, consult, view records, message care team |
| Dependant / guardian | Manage authorised dependant journeys subject to consent/age rules |
| Doctor | Availability, consultation, notes, care plan, prescriptions, referrals |
| Care coordinator | Follow-up, provider coordination, messaging, case status |
| Network provider | Access assigned/authorised records, upload approved results |
| HMO operations | Eligibility/authorisation interface, reconciliation, limited payer data |
| Support agent | Account/booking support with restricted clinical-data access |
| Clinical administrator | Governance, clinician management, audit, escalation |
| Platform administrator | Configuration, content, roles, integrations, monitoring |

---

## 3. Experience Architecture

### 3.1 End-to-end patient journey

1. Discover LifeCome Live
2. Create / sign in to account
3. Complete patient profile
4. Choose how to pay
5. Select and verify HMO **or** select direct payment
6. Choose service
7. Check service eligibility (HMO-funded)
8. Find doctor
9. Choose date/time
10. Complete pre-visit information
11. Review booking
12. HMO authorisation **or** secure payment
13. Booking confirmation
14. Waiting room
15. Video/audio consultation
16. Care plan / visit summary
17. Health record
18. Follow-up / messaging / coordinated care

### 3.2 Payer convergence rule

> HMO and direct-pay journeys may branch for eligibility, authorisation and payment, but must converge **before clinical delivery**. Consultation, care-plan, health-record and follow-up services use the same clinical domain services and patient identity.

---

## 4. Mobile / Authenticated Application Views

| # | View | Domain | Notes |
|---|---|---|---|
| 01 | Sign In / Create Account | Identity | Registration, login, terms/privacy consent |
| 02 | Verify Mobile Number | Identity | OTP verification, anti-abuse controls |
| 03 | Patient Profile | Identity | Demographics, location, future dependant linkage |
| 04 | LifeCome Live Dashboard | Core | Upcoming visit, care plan, records, messages, payer status |
| 05 | Choose How to Pay | Payer | Use my HMO / Pay directly |
| 06 | Select Your HMO | Payer | Search participating HMOs; LifeCome HMO listed first (product decision) |
| 07 | Verify HMO Membership | Payer | Member ID, DOB/phone, payer verification |
| 08 | HMO Coverage & Benefits | Payer | Verified plan and LifeCome Live service coverage |
| 09 | Check Service Eligibility | Payer | Covered / authorisation / not-covered state per service |
| 10 | Choose a Service | Care | GP, follow-up, results review, referral advice, etc. |
| 11 | Find a Doctor | Care | Search, specialty, language, availability, payer-aware filtering |
| 12 | Doctor Profile | Care | Credentials, modes, services, fees, availability |
| 13 | Choose Appointment Time | Booking | Calendar, timezone, slots, consultation mode |
| 14 | Before Your Visit | Clinical intake | Concern, duration, location, uploads, consent |
| 15 | Review Booking & Payment | Transaction | Doctor, patient, service, payer, amount, consent |
| 16 | Payment / HMO Authorisation | Transaction | Dynamic direct-pay or payer-authorisation state |
| 17 | Booking Confirmation | Booking | Reference, reminders, calendar, preparation |
| 18 | Consultation Waiting Room | Clinical | Camera/mic/network check, support, readiness |
| 19 | Video / Audio Consultation | Clinical | Real-time consultation, controls, in-call chat |
| 20 | Care Plan & Visit Summary | Continuity | Summary, instructions, follow-up, referrals |
| 21 | Health Records | Records | Visit notes, results, care plans, approved documents |
| 22 | Care Team Messages | Continuity | Secure patient–care-team communication |

### 4.1 Required application states beyond the 22 views

| Workflow | Mandatory states |
|---|---|
| HMO verification | Loading; verified; not found; mismatch; expired; payer unavailable; manual review |
| Eligibility | Covered; co-pay; pre-authorisation; excluded; benefit limit reached; payer unavailable |
| Authorisation | Not required; pending; approved; declined; expired; additional information required |
| Payment | Initiated; pending; successful; failed; cancelled; refunded; partial refund |
| Booking | Slot held; confirmed; rescheduled; cancelled; doctor unavailable; patient no-show |
| Consultation | Waiting; clinician joining; connected; reconnecting; audio fallback; ended |
| Records | Draft; clinician-signed; available; awaiting review; amended; access revoked |

### 4.2 Mobile UX requirements

- iOS and Android with a shared component language, respecting native conventions.
- One persistent patient identity across payer changes.
- Payer branding lives inside payer-specific cards/states; LifeCome Live stays the dominant identity.
- Show coverage and payment consequences before final confirmation.
- Accessible touch targets, readable contrast, scalable type, explicit status labels in addition to colour.
- Approved palette: Logo Lime `#A2E10D`, Logo Cyan `#3DE5F8`, Logo Green `#45AF03`, Logo Blue `#0667B8`, Gold `#B58A35`, White `#FFFFFF`.

---

## 5. Public Website Information Architecture — 36 Pages

| # | Page | Group | Purpose |
|---|---|---|---|
| 01 | Home | Core | Primary acquisition, trust, care entry |
| 02 | How LifeCome Live Works | Core | Access → consultation → care plan → follow-up |
| 03 | Online Healthcare Services | Services | Master service directory |
| 04 | Online GP Consultations | Services | New/general health concerns |
| 05 | Online Follow-up Care | Services | Continuity after initial consultation |
| 06 | Test & Diagnostic Results Review | Services | Clinician review of results |
| 07 | Referrals & Coordinated Care | Services | Onward care through provider network |
| 08 | Laboratory Tests & Diagnostics | Services | Diagnostics coordination |
| 09 | Prescriptions & Medicines | Services | Prescribing and pharmacy coordination |
| 10 | Ways to Access LifeCome Live | Access | HMO, direct pay, future sponsored access |
| 11 | Access LifeCome Live With Your HMO | Access | Multi-HMO access explanation |
| 12 | HMOs Accepted by LifeCome Live | Access | Participating payer directory |
| 13 | Check Your HMO Eligibility & Cover | Access | Secure eligibility gateway |
| 14 | Using Your Health Insurance on LifeCome Live | Access | Authorisation, exclusions, co-payments |
| 15 | Pay Directly for Healthcare | Access | Self-pay pathway |
| 16 | Consultation Pricing & Payments | Access | Pricing, payment, receipts, refunds |
| 17 | Find a LifeCome Live Doctor | Care | Doctor discovery |
| 18 | Book an Online Consultation | Care | Booking gateway |
| 19 | Prepare for Your Online Consultation | Care | Pre-visit guidance |
| 20 | Your LifeCome Live Consultation | Care | During-visit expectations |
| 21 | What Happens After Your Consultation | Care | Summary, referrals, prescriptions, follow-up |
| 22 | Your LifeCome Live Care Plan | Records | Personalised next steps |
| 23 | Your LifeCome Live Health Records | Records | Longitudinal platform record |
| 24 | Who Can Access Your Health Records? | Records | Permissions and sharing |
| 25 | LifeCome Live Healthcare Provider Network | Network | Doctors, labs, pharmacies, clinics, hospitals |
| 26 | Join the LifeCome Live Provider Network | Partners | Provider proposition |
| 27 | Partner With LifeCome Live — HMOs & Health Plans | Partners | Payer integration proposition |
| 28 | Digital Healthcare for Organisations | Partners | Employer/sponsored access |
| 29 | About LifeCome Live | Trust | Mission and operating model |
| 30 | Our Doctors & Clinical Team | Trust | Credentials and clinical leadership |
| 31 | Clinical Governance & Patient Safety | Trust | Quality, safeguarding, escalation |
| 32 | Security, Privacy & Data Protection | Trust | Security and privacy-by-design |
| 33 | LifeCome Live Help Centre | Support | Searchable support and FAQs |
| 34 | Patient Support, Feedback & Complaints | Support | Support and complaints |
| 35 | Emergency & Urgent Care Guidance | Safety | Emergency boundary and escalation |
| 36 | LifeCome Live Legal & Privacy Centre | Legal | Terms, privacy, cookies, consent, accessibility |

### 5.1 Website navigation

| Top-level | Children |
|---|---|
| How It Works | How LifeCome Live Works |
| Services | GP; Follow-up; Results Review; Referrals; Tests & Diagnostics; Prescriptions |
| Access Care | Ways to Access; Use Your HMO; Participating HMOs; Check Cover; Pay Directly; Pricing |
| Health Records | Care Plan; Health Records; Record Access; Provider Network |
| Partners | Healthcare Providers; HMOs & Health Plans; Employers & Organisations |
| About | About; Doctors; Clinical Governance; Security & Data Protection |
| Utility | Help; Sign In; Get Care |

---

## 6. Frontend Architecture

| Surface | Approach | Notes |
|---|---|---|
| Public website | SSR/SSG-capable modern web framework | SEO, performance, structured content, accessibility |
| Authenticated web app | Component-based SPA/hybrid | Secure patient workflows, shared design system |
| Mobile apps | Cross-platform or native, shared API contracts | Push, secure storage, camera/mic, video SDK |
| Provider/ops portals | Responsive web apps | Role-based workflows and operational data |
| Design system | Tokenised component library | Colour, type, spacing, forms, status, cards, tables, nav |

### 6.1 Frontend module boundaries

Identity & account · Patient profile & dependants · Payer & eligibility · Service catalogue · Doctor discovery · Scheduling · Pre-visit intake · Payment & authorisation · Consultation & waiting room · Care plan & records · Messaging & notifications · Help, safety and legal.

### 6.2 State management

Separate server state from local UI state. Clinical, payer, booking and transaction records are server-authoritative. Cache carefully; invalidate after authorisation, payment, booking, consultation completion and record updates. Client state is never proof of coverage, payment or clinical-record status.

### 6.3 Design-system tokens

| Token | Value / rule | Usage |
|---|---|---|
| Brand Lime | `#A2E10D` | Brand emphasis, selected accents |
| Brand Cyan | `#3DE5F8` | Graphic accents, information highlights |
| Brand Green | `#45AF03` | Positive states, supporting graphics |
| Brand Blue | `#0667B8` | Readable actions, links, primary controls |
| Gold | `#B58A35` | Attention, premium, authorisation accent |
| White | `#FFFFFF` | Primary background, reversed artwork |
| Typography | Accessible modern sans-serif | Semantic scale, dynamic type |
| Spacing | 4/8px base rhythm | Consistent spacing |
| Radius | 8–20px by hierarchy | Cards, inputs, banners, buttons |

---

## 7. Backend Architecture

```
CLIENTS
Public Web | Patient Web | iOS/Android | Provider Portal | Operations Console
        |
API Gateway / BFF Layer
        |
Identity | Patient | Payer | Eligibility | Service Catalogue | Provider Directory
Scheduling | Booking | Payment | Authorisation | Consultation | Clinical Records
Care Coordination | Messaging | Notifications | Documents | Consent | Audit
        |
Integration / Event Layer
        |
HMO APIs | Payment Gateway | Video/RTC | SMS/Email/Push | Labs/Providers
        |
Operational DB | Clinical Record Store | Object Storage | Audit Log | Analytics
```

| Service | Responsibility |
|---|---|
| Identity & Access | Accounts, sessions, OTP/MFA, roles, session controls |
| Patient | Profile, demographics, dependants, preferences |
| Payer | Participating HMO registry, membership linkage, coverage metadata |
| Eligibility | Service-level eligibility decisions and evidence |
| Authorisation | Pre-authorisation requests, decisions, expiry |
| Service Catalogue | Services, modes, prices, payer mappings |
| Provider Directory | Clinicians, credentials, specialties, languages, network status |
| Scheduling | Availability, slot holds, time zones, calendars |
| Booking | Appointment lifecycle, rescheduling, cancellation |
| Payment | Intent, confirmation, refund, receipt, reconciliation |
| Consultation | Waiting room and RTC session orchestration |
| Clinical Records | Notes, summaries, care plans, results, prescriptions, referrals |
| Care Coordination | Tasks, follow-ups, provider handoffs |
| Messaging | Secure patient–care-team threads |
| Notifications | SMS, email, push, in-app |
| Documents | Secure uploads, metadata, object references |
| Consent | Versioned terms, clinical and record-sharing consent |
| Audit | Immutable security, clinical, admin audit events |
| Reporting | Operational metrics, de-identified analytics |

### 7.1 API principles

- Version externally consumed APIs and preserve compatibility.
- Idempotency keys for payment, authorisation, booking and notification requests.
- Correlation IDs across client, API, event and integration layers.
- Explicit workflow status transitions, not overloaded booleans.
- Machine-readable error codes plus patient-safe display messages.
- Signed short-lived URLs for protected documents.
- Field-level data minimisation for payer and provider integrations.

---

## 8. Core Data Model

| Entity | Purpose |
|---|---|
| UserAccount | Authentication identity, status, contact channels |
| Patient | Clinical identity and demographics |
| DependantRelationship | Guardian/dependant relationship and authority |
| Payer | HMO or sponsored payer |
| Membership | Patient–payer linkage |
| CoveragePlan | Plan metadata and service rules |
| EligibilityCheck | Point-in-time service eligibility result |
| Authorisation | Pre-authorisation request and decision |
| ClinicalService | Service catalogue item |
| Provider | Clinician/provider organisation |
| ProviderCredential | Licence/credential metadata and verification |
| AvailabilitySlot | Bookable time interval |
| Appointment | Patient–provider booking |
| PaymentTransaction | Direct-pay financial transaction |
| ConsultationSession | RTC/session metadata |
| Encounter | Clinical encounter record |
| ClinicalNote | Clinician-authored note |
| CarePlan | Patient next steps and goals |
| Prescription | Medication instruction record |
| Referral | Onward-care request |
| DiagnosticOrder | Test/diagnostic request |
| DiagnosticResult | Result metadata and clinician-review state |
| Document | Secure uploaded/generated document |
| MessageThread | Secure care-team conversation |
| ConsentRecord | Versioned consent/legal acceptance |
| AuditEvent | Immutable action/security trail |

### 8.1 Source-of-truth rules

- LifeCome Live owns platform patient identity and the platform encounter record.
- HMO membership and eligibility decisions are payer-originated or payer-configured and retain source metadata.
- Clinicians are authoritative authors of signed notes and care plans.
- Payment providers are authoritative for settlement status; LifeCome Live stores reconciled state.
- Provider-network results retain originating provider, timestamp, provenance and review status.

---

## 9. Multi-HMO Integration Architecture

Adapter architecture: each HMO integrates through its available mechanism without contaminating the core clinical domain.

| Mode | Use case | Controls |
|---|---|---|
| Real-time API | HMO supports member/eligibility/authorisation APIs | OAuth/mTLS, schema mapping, retries, circuit breaker |
| Secure batch/file | Periodic membership/benefit files | Encryption, checksum, reconciliation, expiry rules |
| Operations portal | No API; HMO operator reviews requests | RBAC, SLA timers, full audit |
| Rules configuration | Contracted benefit rules configured in LifeCome Live | Versioning, approval workflow, effective dates |

### 9.1 Payer adapter contract

- `verifyMember(patient, payer, membershipData)`
- `checkEligibility(member, service, provider, date)`
- `requestAuthorisation(member, service, provider, appointment)`
- `getAuthorisationStatus(authorisationId)`
- `submitUtilisationOrClaimData(...)` where contractually required
- `reconcileAuthorisationsAndPayments(...)`

> **Default listing vs technical default.** LifeCome HMO may be listed first in the selector as a product decision. The backend must not hard-code LifeCome HMO as the default payer or create LifeCome-HMO-specific clinical logic.

---

## 10. Consultation and Real-Time Communications

- WebRTC-compatible RTC layer with performance suited to Nigerian users.
- Create rooms server-side; issue short-lived participant tokens.
- Camera, microphone and network checks plus audio-only fallback.
- Do not record consultations by default. Any future recording needs separate governance, consent, retention and security design.
- Persist session metadata rather than unnecessary media content.
- Implement reconnect, clinician late-join, patient no-show and support-escalation states.
- Define retention rules for in-call text chat.

### 10.1 Waiting-room state machine

```
BOOKED → CHECK_IN_OPEN → DEVICE_CHECK → WAITING → CLINICIAN_JOINING → CONNECTED → ENDED
                         ↘ SUPPORT / RECONNECT / AUDIO_FALLBACK ↗
```

---

## 11. Clinical Records and Provider-Network Model

A longitudinal record of care delivered or coordinated through the platform: consultation summaries, care plans, prescriptions, referrals, diagnostic orders/results, approved provider uploads.

| Actor | Default access | Additional conditions |
|---|---|---|
| Patient | Own available records | Age/guardian rules for dependants |
| Treating doctor | Records required for active care | Assignment, minimum-necessary access |
| Care coordinator | Coordination data and approved clinical context | Case assignment |
| Lab/diagnostic provider | Order and relevant context | Specific order, time-bounded access |
| Clinic/hospital partner | Relevant referral/care-plan context | Assignment, consent, contract rules |
| HMO | Coverage/authorisation/utilisation data only | No broad clinical-record access by default |
| Support agent | Minimal account/booking data | Clinical data masked unless workflow requires |

### 11.1 Clinical record controls

- Signed clinical notes are append-only; corrections create amendments.
- Every record view, download and share action is auditable.
- Diagnostic results carry explicit clinician-review status.
- Care plans are versioned and linked to encounters.
- Provider uploads require provenance, document type, patient linkage and review state.

---

## 12. Security, Privacy and Access Control

- Encrypt in transit and at rest.
- Secrets in a managed secrets system; never in source control or client apps.
- Least-privilege RBAC and assignment-based access controls.
- MFA for privileged staff and provider accounts.
- Short-lived access tokens; secure refresh-token/session rotation.
- Immutable audit trails for privileged, clinical, payer and record-access events.
- Rate limiting, bot protection, input validation, API abuse monitoring.
- Secure mobile storage for tokens; no sensitive clinical data in unprotected local storage.
- Retention and deletion schedules by data class.
- Threat modelling, dependency scanning, SAST/DAST and penetration testing before production.

### 12.1 Privacy by design

- Collect only data necessary for the stated workflow.
- Separate clinical data from payer data wherever practical.
- Record consent purpose, version, timestamp and channel.
- Mask sensitive fields in logs, analytics and support tooling.
- Provide access, correction and account/privacy workflows consistent with applicable policy and law.

---

## 13. Payments, Billing and Reconciliation

| Capability | Requirement |
|---|---|
| Payment intent | Server-created amount and service reference; never trust client amount |
| Payment methods | Gateway abstraction for cards, bank transfer, supported methods |
| Confirmation | Webhook/server verification before booking is marked paid |
| Receipts | Immutable receipt number linked to transaction and appointment |
| Refunds | Policy-driven full/partial refund states with audit |
| HMO-covered visits | No patient payment unless co-pay/shortfall applies |
| Reconciliation | Daily gateway and payer reconciliation reports |
| Failure handling | Retry-safe, idempotent, patient-readable recovery |

---

## 14. Provider and Operations Portals

### 14.1 Provider workspace

Dashboard and today's appointments · Availability/calendar · Patient pre-visit summary · Waiting room and consultation launch · Clinical note and visit summary · Care plan, prescription, referral, diagnostic order · Results review and follow-up tasks · Secure messaging · Credential/profile management.

### 14.2 Operations console

Patient/account support with data minimisation · HMO configuration and adapter status · Eligibility/authorisation exception queues · Provider onboarding, credential verification, network status · Booking operations and rescheduling · Payment/refund/reconciliation views · Clinical governance and escalation queues · Content/CMS · Audit, security, access review · Operational analytics and SLA reporting.

---

## 15. Notifications and Communications

| Event | Channels | Examples |
|---|---|---|
| Account verification | SMS / email | OTP, verification result |
| Booking | Push / SMS / email | Confirmation, reschedule, cancellation |
| Appointment reminders | Push / SMS / email | 24-hour and 1-hour |
| Authorisation | Push / in-app / email | Pending, approved, declined |
| Payment | In-app / email | Success, failure, receipt, refund |
| Clinical continuity | Push / in-app | Care plan available, result reviewed, follow-up due |
| Support | In-app / email | Care-team response, support update |

Templates are versioned, localisable, testable and linked to event IDs. No unnecessary clinical detail in SMS or push.

---

## 16. DevOps, Environments and Observability

| Area | Minimum standard |
|---|---|
| Environments | Local/dev, test, staging/UAT, production with separated credentials/data |
| CI/CD | Automated build, tests, security checks, deploy, rollback |
| Infrastructure | Infrastructure-as-code, repeatable configuration |
| Secrets | Managed secret store and rotation |
| Monitoring | Availability, latency, error rates, queue depth, integration health |
| Logging | Structured logs with correlation IDs and PII/PHI masking |
| Tracing | Distributed tracing across API, event, integration calls |
| Backups | Encrypted, tested backups with documented restore |
| DR | Defined RTO/RPO; scheduled DR exercises |
| Feature release | Feature flags and progressive rollout for high-risk workflows |

---

## 17. Testing and Quality Assurance

- Unit tests for domain rules and state transitions.
- Contract tests for HMO, payment, video and messaging adapters.
- Integration tests for payer → booking → authorisation/payment → confirmation.
- E2E tests for all 22 patient views and critical error states.
- Clinical workflow UAT with doctors and care coordinators.
- Accessibility testing for web and mobile.
- Performance/load testing for booking peaks and concurrent consultations.
- Security testing, penetration testing, privileged-access review.
- Cross-browser and representative Android/iOS device testing.
- Data migration/reconciliation tests before onboarding live payers/providers.

### 17.1 Definition of done

> A feature is not complete until acceptance criteria, analytics, audit events, error states, accessibility, security controls, automated tests, operational runbook and rollback path are complete.

---

## 18. Analytics and Product Telemetry

| Funnel | Key events |
|---|---|
| Acquisition | page_view, service_view, get_care_click |
| Account | signup_started, otp_verified, profile_completed |
| Payer | payment_path_selected, hmo_selected, membership_verified |
| Eligibility | eligibility_checked, covered, authorisation_required, not_covered |
| Booking | doctor_viewed, slot_selected, booking_reviewed, booking_confirmed |
| Transaction | payment_started, payment_success, payment_failed, authorisation_status |
| Consultation | waiting_room_entered, consultation_connected, consultation_ended |
| Continuity | care_plan_viewed, result_viewed, followup_booked, message_sent |

Analytics must not leak clinical details or sensitive identifiers. Use pseudonymous product identifiers and a governed event dictionary.

---

## 19. UI/UX Delivery Standards

- Figma design system with tokens matching production code.
- Desktop, tablet and mobile breakpoints for public pages.
- Normal, loading, empty, error, disabled, success and permission-denied states for components.
- Annotate every payer-aware screen with source-of-truth and fallback behaviour.
- Reusable status chips: Covered, Requires Authorisation, Not Covered, Pending, Approved, Paid, Available, Reviewed.
- Copy deck and error-message catalogue for engineering.
- Consistent LifeCome Live brand hierarchy; HMO logos are contextual payer marks.
- Accessibility designed into components, not retrofitted.

---

## 20. Development Phases

| Phase | Focus | Exit criteria |
|---|---|---|
| 0. Discovery & architecture | Requirements, clinical governance, payer contracts, data model, design system | Approved architecture and backlog |
| 1. Foundation | Identity, profile, CMS website shell, provider directory, scheduling | Secure base platform |
| 2. Care access | Payer selector, HMO verification, eligibility, direct pay, booking | End-to-end booking works |
| 3. Virtual care | Waiting room, RTC consultation, provider workspace | Clinical consultation works |
| 4. Continuity | Care plan, records, results, messaging, provider-network workflows | Post-visit care works |
| 5. Operations & scale | Admin, reconciliation, analytics, observability, DR | Production operational readiness |
| 6. Expansion | More HMOs, employer access, additional provider integrations | Repeatable partner onboarding |

### 20.1 Workstreams

Product & clinical design · UI/UX and design system · Web frontend · Mobile frontend · Backend/domain services · Integrations and payer engineering · RTC/video · Data and analytics · Security/privacy · QA/automation · DevOps/SRE · Clinical/provider operations.

---

## 21. Developer Acceptance Checklist

- [ ] LifeCome Live and LifeCome HMO are technically and visually separated.
- [ ] LifeCome HMO can be listed first without being hard-coded as the only/default payer.
- [ ] A new HMO can be onboarded through an adapter/configuration path.
- [ ] Direct payment remains available where permitted when HMO coverage fails.
- [ ] Eligibility and authorisation are server-authoritative and auditable.
- [ ] All payment operations are idempotent and webhook-verified.
- [ ] All clinical records have provenance, author and lifecycle status.
- [ ] Provider access is assignment-based and minimum-necessary.
- [ ] Audit logs cover record access, clinical changes, payer decisions and admin actions.
- [ ] Public website implements all 36 approved pages or approved launch subset.
- [ ] Authenticated application implements all 22 core views and required error states.
- [ ] Responsive/accessibility QA has passed.
- [ ] Security testing and recovery procedures have passed.
- [ ] Operational dashboards, alerts and runbooks exist before go-live.

---

## 22. Recommended Repository and Team Structure

```
lifecome-live/
  apps/
    public-web/  patient-web/  patient-mobile/  provider-portal/  operations-console/
  packages/
    design-system/  api-client/  domain-types/  analytics/  security-utils/
  services/
    identity/ patient/ payer/ eligibility/ scheduling/ booking/ payment/
    authorisation/ consultation/ clinical-records/ messaging/ notifications/
  infrastructure/
  docs/
    architecture/  api/  runbooks/  ui-ux/
```

A monorepo is optional, but shared contracts, design tokens and API schemas should be governed centrally regardless.

---

## 23. Final Architecture Principles

| Principle | Meaning |
|---|---|
| Platform first | LifeCome Live is the clinical and coordination platform; payers are replaceable integrations. |
| One patient identity | Payer changes must not create fragmented accounts or records. |
| Clinical continuity | Every completed encounter flows into care plan, record and follow-up. |
| Explicit workflow states | Coverage, authorisation, payment and records require auditable state machines. |
| Security by design | Minimum necessary access, encryption, consent, audit and privacy are architectural requirements. |
| Integration ready | HMOs, payments, video and provider systems connect through adapters and stable contracts. |
| Operationally observable | Every critical workflow has metrics, logs, tracing, alerts and runbooks. |
| Design-system discipline | Website, app and portals share one governed component and brand system. |
