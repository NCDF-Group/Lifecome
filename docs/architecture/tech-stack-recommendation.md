# Tech Stack Recommendation

Status: **Direction confirmed by product owner (web: Next.js, mobile: Flutter, backend: Node.js); library choices are proposals** to be ratified as ADRs in Phase 0. Source: [blueprint](../prd/lifecome-live-blueprint.md).

Items marked ⚠ are open decisions that depend on legal, commercial or clinical input, not just engineering preference.

## 1. Guiding constraints from the blueprint

- Mobile-first users in Nigeria: variable networks, mid-range Android, SMS/OTP heavy → small payloads, offline-tolerant UI, audio fallback, SMS as a first-class channel.
- Payer adapters must not contaminate the clinical domain (§9) → strict bounded contexts.
- Server-authoritative eligibility/authorisation/payment/record state (§6.2) → explicit state machines, no boolean flags.
- Immutable audit, append-only signed notes, idempotent payments (§7.1, §11, §13).
- Shared tokens/contracts across website, app, portals (§6, §22).

**Consequence of Flutter + Node:** the mobile app cannot import TypeScript types. The **OpenAPI spec is therefore the single contract**: the backend publishes it, and both a TS client (web) and a Dart client (Flutter) are generated from it in CI. Enums for state machines (booking, payment, authorisation, …) must live in the spec, not only in TS code.

## 2. Web (Next.js) — public site, patient web, provider portal, ops console

Goal: fast first load on 4G/mid-range phones, smooth navigation, accessible.

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (latest stable, App Router) with React 19 + **React Compiler** + Turbopack | Server Components by default keep client JS small; compiler removes manual memoisation |
| Rendering | Public pages: static/ISR, cache components / partial prerendering for dynamic bits. Authenticated apps: RSC shell + client islands | Fast TTFB for the 36 marketing pages; interactivity only where needed |
| Styling | Tailwind CSS v4 with tokens from the design system | Zero-runtime CSS; no CSS-in-JS cost |
| Components | shadcn/ui on Radix primitives (owned in `packages/design-system`) | Accessible primitives, no heavy component-library bundle |
| Forms/validation | react-hook-form + Zod (schemas derived from OpenAPI where possible) | Light, performant, shared validation rules |
| Server state | TanStack Query for client islands; RSC fetch + tags for server data | Explicit invalidation after payment/booking/authorisation (§6.2) |
| API client | `openapi-typescript` + `openapi-fetch` (generated, ~no runtime) | Typed, tiny, contract-first |
| Motion | `motion` (LazyMotion, only where valuable); prefer CSS transitions and View Transitions | Smooth without bundle bloat |
| Images/fonts | `next/image` (AVIF/WebP), `next/font` (self-hosted, subset) | LCP and layout stability |
| i18n | next-intl | Localisable copy deck (§19), future local-language support |
| CMS | Payload (self-hosted, Postgres, TS) or Sanity | Structured content for the 36 pages, versioned, preview mode |
| Real-time status | Server-Sent Events / polling with backoff for payment/authorisation status | Simpler and cheaper than WebSockets for one-way updates |
| Video (web) | RTC vendor's JS SDK, lazy-loaded only on the consultation route | Keeps it out of every other bundle |
| Analytics / errors | PostHog (governed event dictionary), Sentry | §18; no clinical data in events |
| Testing | Vitest + Testing Library, Playwright (E2E + a11y with axe), Storybook | §17 |
| Perf guardrails | Lighthouse CI + bundle-size budgets in CI; target LCP < 2.5 s and INP < 200 ms on throttled 4G, mid-range Android | Fast stays fast |
| Delivery | CDN with African PoPs (e.g. Cloudflare, which has a Lagos PoP) in front of the Next.js host; self-host or OpenNext ⚠ | Latency matters more than framework choice |

Avoid: heavy UI kits (MUI/Ant), moment.js, lodash (full), large chart libs on public pages, client-side fetching for content that can be server-rendered.

## 3. Mobile (Flutter) — patient app

| Concern | Choice | Why |
|---|---|---|
| Framework | Flutter stable, Dart 3, Impeller renderer | Consistent, smooth UI on iOS and Android |
| State | Riverpod (`flutter_riverpod` + `riverpod_generator`) | Compile-safe, testable, good for server-authoritative async state |
| Navigation | `go_router` (deep links for booking/payment returns/reminders) | |
| Models | `freezed` + `json_serializable` | Immutable models and sealed state unions map cleanly to the workflow states in §4.1 |
| API client | Generated from OpenAPI (`swagger_parser` or `openapi-generator` dart-dio) on `dio` with interceptors for auth refresh, correlation IDs, idempotency keys | Contract-first |
| Auth | OIDC + PKCE via `flutter_appauth` (or the IdP's SDK); tokens in `flutter_secure_storage`; `local_auth` for biometric unlock | §12 |
| Local cache | `drift` (SQLite) only for non-sensitive cacheable data; never treat as proof of coverage/payment (§6.2) | |
| Video | Vendor Flutter SDK (e.g. `livekit_client`, or Agora/Daily) ⚠ | Must support audio-only fallback |
| Push / local notifications | `firebase_messaging` + `flutter_local_notifications` | Reminders, authorisation updates |
| Payments | Gateway hosted checkout in secure webview/custom tab (Paystack/Flutterwave SDK) ⚠ | Keeps card data out of app scope |
| i18n | `flutter_localizations` + ARB | |
| Observability | `sentry_flutter`, `posthog_flutter` | |
| Security hardening | Code obfuscation + `--split-debug-info`, certificate pinning, `freerasp` root/jailbreak signals, block screenshots on consultation and records screens | |
| Testing | `flutter_test`, golden tests, `integration_test`/Patrol for E2E, contract tests against the OpenAPI mock | |
| Build/release | Melos (workspace), Fastlane or Codemagic, **Shorebird** for OTA code patches | Fast fixes without store review where store policy allows |
| Performance guardrails | Test on low-end Android devices; app-size budget; avoid rebuild storms (`select`, `const`); lazy-init heavy SDKs (video) | |

Flutter Web is **not** used; the web experience is Next.js.

## 4. Backend (Node.js)

| Concern | Choice | Why |
|---|---|---|
| Runtime | Node.js current LTS, TypeScript strict | |
| Framework | **NestJS on Fastify** (modular monolith first) | Enforced module boundaries map to the blueprint's ~19 services; DI, guards, interceptors suit audit/RBAC; extractable later |
| Contracts | Zod schemas (`nestjs-zod`) → generated OpenAPI 3.1 published from CI; breaking-change check (oasdiff) | Single contract for web + Flutter |
| Database | PostgreSQL, schema per bounded context; **Drizzle ORM** (SQL-first, good for row-level security and complex queries) + `drizzle-kit` migrations | Strong transactions for payment/booking; RLS for assignment-based access |
| Clinical vs payer data | Separate schemas with separate KMS keys from day one | §12.1; keeps a local-hosting option open |
| Audit | Append-only table, hash-chained, streamed to WORM object storage | §12 |
| Async | Transactional outbox → BullMQ (Redis/Valkey) for jobs; consider **Temporal** later for long-running flows (payer authorisation SLA timers, refunds, reconciliation) | Reliable retries, idempotency |
| Slot holds / rate limits | Redis with TTL keys; `@fastify/rate-limit` | |
| Identity | **Keycloak** (self-hosted, OIDC) for patients, providers and staff; phone-OTP via custom authenticator; MFA for staff/providers ⚠ | Mature, self-hostable (data residency), one IdP for all clients. Lighter alternative for a small team: Better Auth in-app |
| Authorisation | RBAC + assignment/relationship-based checks via Cerbos or OpenFGA; Postgres RLS as defence in depth | "Assigned, minimum-necessary" (§11) |
| Bot/abuse | Cloudflare Turnstile + OTP throttling + device signals | §12 |
| Files | S3-compatible presigned URLs, AV scanning (ClamAV) on upload, metadata in Postgres | §7.1 |
| Clinical data shape | FHIR-aligned resource naming/structure (Encounter, CarePlan, MedicationRequest, ServiceRequest, DiagnosticReport) even if not exposing FHIR APIs yet | Eases lab/hospital/provider integrations later |
| Realtime | SSE for status streams; RTC vendor for media | |
| Logging/tracing | `pino` with PII/PHI redaction + OpenTelemetry (traces/metrics) → Grafana/Datadog | §16 |
| Testing | Vitest, Testcontainers (real Postgres/Redis), Pact for payer/payment/video adapter contracts, k6 for load | §17 |
| Infra | Docker, Terraform, GitHub Actions; Kubernetes only if/when needed (start on managed containers) ⚠ | Avoid premature complexity |

## 5. Shared pipeline (bridging Node, Next.js and Flutter)

```
Zod schemas ──► NestJS ──► openapi.json (versioned artifact)
                              ├──► openapi-typescript ──► packages/api-client (web)
                              └──► swagger_parser / openapi-generator ──► apps/patient-mobile (Dart client)

design tokens (JSON) ──► Style Dictionary ──► CSS variables / Tailwind theme (web)
                                          └──► Dart ThemeExtension (Flutter)
```

- Repo tooling: pnpm + Turborepo for JS/TS, **Melos** for Dart packages, both in one repo.
- CI regenerates both clients and fails on unexpected contract drift.
- Fake-payer simulator and an OpenAPI mock server let mobile and web build ahead of real integrations.

## 6. Hosting and data-residency (⚠ needs decision early)

Health data falls under the Nigeria Data Protection Act; counsel should confirm residency, cross-border transfer and DPIA obligations before infrastructure is chosen. Options:

1. Hyperscaler region closest to users (e.g. AWS `af-south-1`) with encryption and KMS — best tooling, data leaves Nigeria.
2. Nigerian data centre / local cloud for the clinical store, hyperscaler for stateless tiers — best residency posture, more ops burden.
3. Hybrid: clinical + payer data local, everything else hyperscaler.

Recommendation: keep storage behind clear boundaries now (separate clinical schema/keys) so option 2 or 3 stays possible whichever way legal lands.

## 7. Payer adapter design

```
services/payer/
  core/           PayerAdapter interface, registry, result types, audit hooks
  adapters/
    rest-realtime/   OAuth/mTLS client, schema mapper, retry, circuit breaker
    batch-file/      SFTP ingest, checksum, reconciliation, expiry
    ops-portal/      Work queue + SLA timers for manual HMO review
    rules-engine/    Versioned, effective-dated benefit rules
```

- Interface mirrors §9.1 (`verifyMember`, `checkEligibility`, `requestAuthorisation`, …).
- Payers are **data** (registry rows + adapter config), not code branches. LifeCome HMO's "listed first" is a `displayOrder` value, never a default in code.
- Every adapter call is recorded as an `EligibilityCheck`/`Authorisation` with source metadata and raw-response evidence, and emits audit events.
- Adapter contract tests (Pact) plus a fake-payer simulator for local dev and E2E.

## 8. State machines to model explicitly

Typed transition tables enforced server-side, each transition emitting an audit event, and exposed as enums in the OpenAPI spec so Flutter and Next.js render the same states: `HmoVerification`, `Eligibility`, `Authorisation`, `Payment`, `Booking`, `Consultation` (§10.1), `ClinicalRecord` lifecycle (§4.1). Property-based tests for illegal transitions.

## 9. Key ADRs to write in Phase 0

1. Modular monolith vs services
2. Hosting region and data residency ⚠
3. Identity provider (Keycloak vs alternatives)
4. RTC vendor and its Flutter/web SDK support ⚠
5. Payment gateway(s) ⚠
6. Clinical record schema, FHIR alignment and amendment model
7. Audit log design and retention
8. Payer adapter contract and onboarding process
9. OpenAPI contract governance and codegen pipeline (Node ↔ Next.js ↔ Flutter)
10. CMS choice and content model for the 36 pages
11. OTA update policy (Shorebird) for the Flutter app

## 10. Risks

| Risk | Mitigation |
|---|---|
| HMO API availability/quality varies widely | Adapter modes incl. ops portal and rules; manual-review state is first-class |
| Video quality on poor networks | Audio fallback, adaptive bitrate, device/network pre-check, vendor with regional presence and a solid Flutter SDK |
| Contract drift between Node, web and Flutter | Contract-first OpenAPI, generated clients, CI drift checks, mock server |
| Two client codebases (web + Flutter) duplicate logic | Keep business rules on the server; clients render server-decided state only; shared tokens via codegen |
| Regulatory scope (health data, telemedicine practice rules) ⚠ | Legal review in Phase 0; DPIA; clinical governance SOPs before launch |
| Scope size (36 pages + 22 views + 3 portals) | Approved launch subset (§21), phased delivery |
| Payer logic leaking into clinical domain | Module-boundary lint rules and architecture tests |
