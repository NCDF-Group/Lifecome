# LifeCome Live — Backend

The API for [LifeCome Live](../README.md): a modular-monolith service that owns identity, patient
records, payer/eligibility/authorisation, scheduling and booking, payments, consultations,
clinical records, messaging, notifications and audit — one deployable app with hard module
boundaries, so pieces can be split into their own services later without a rewrite. See the
[tech stack recommendation](../docs/architecture/tech-stack-recommendation.md) for the reasoning.

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | [NestJS](https://nestjs.com) on [Fastify](https://fastify.dev) | Structured DI and module boundaries; Fastify is markedly faster than Express |
| Build | Nest CLI with the **SWC** builder | Near-instant rebuilds in watch mode instead of `tsc`'s multi-second recompiles |
| Validation | [Zod](https://zod.dev) via `nestjs-zod` | One schema for validation, types and OpenAPI — no separate DTO classes |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) | SQL-first, fully typed, no decorator-magic entities, fast cold start |
| Jobs / queues | [BullMQ](https://docs.bullmq.io) on Redis | Reliable retries for notifications, reconciliation, SLA timers |
| Logging | `nestjs-pino` (pino) | Structured JSON logs, negligible overhead, request correlation built in |
| API docs | `@nestjs/swagger` (generated from the Zod schemas) | Published OpenAPI contract for the web and mobile clients to codegen from |
| Tests | Vitest | Fast, Jest-compatible API, native ESM |

## Getting started

You need Node.js 20+, Docker (for local Postgres/Redis) and npm.

```bash
cp .env.example .env
docker compose up -d          # Postgres on :5432, Redis on :6379
npm install
npm run db:migrate            # applies the SQL migrations in drizzle/
npm run dev                   # API at http://localhost:3001/api/v1, Swagger UI at /api/docs
```

Every route is served under `/api/v1` (a global prefix plus URI versioning, so the API can add a
`v2` later without breaking `v1` clients — blueprint §7.1). `/api/docs` is disabled in production.

| Command | What it does |
|---|---|
| `npm run dev` | Start the API in watch mode (SWC) |
| `npm run build` | Production build to `dist/` |
| `npm run start` | Run the built app |
| `npm run typecheck` | Full `tsc` type check (the dev/build loop only does a fast SWC transpile) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests against a real Postgres/Redis |
| `npm run db:generate` | Generate a SQL migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio against the local database |

## Layout

```
src/
  main.ts                 Fastify bootstrap: helmet, compression, CORS, Swagger, graceful shutdown
  app.module.ts            Wires every domain module together
  common/
    config/                 Env schema (Zod) + typed AppConfigService
    errors/                 AppException — machine-readable code + patient-safe message
    filters/                Global exception filter → consistent JSON error shape
    interceptors/           Idempotency-key handling, response shaping
    middleware/             Correlation-id propagation
  db/
    schema/                 Drizzle table definitions, one file per bounded context
    client.ts               DrizzleModule — injectable DRIZZLE provider
    migrate.ts               Standalone migration runner (npm run db:migrate)
  queue/                    BullMQ connection + queue registration
  modules/
    health/                 Liveness + readiness (checks DB and Redis)
    identity/                Accounts, OTP verification
    patient/                 Patient profile
    payer/                   Payer registry + the adapter pattern (see below)
    eligibility/              Eligibility checks
    authorisation/            Pre-authorisation requests and status
    scheduling/               Availability slots, slot holds
    booking/                  Appointment lifecycle
    payment/                  Payment intents, webhook verification, idempotent by design
    consultation/             Waiting-room / RTC session orchestration (stubbed pending a vendor)
    clinical-records/         Encounters, signed notes, care plans, prescriptions, referrals, results
    care-coordination/        Follow-up tasks and provider handoffs
    messaging/                Secure patient–care-team threads
    notifications/            Queue producer + a worked BullMQ processor example
    documents/                Signed-URL-backed document metadata
    consent/                  Versioned consent records
    audit/                    Append-only audit event log
test/
  *.e2e-spec.ts             Boots the real app against Postgres/Redis
```

Every domain module (`modules/*`) follows the same shape: `*.module.ts`, `*.controller.ts`,
`*.service.ts`, `dto/*.ts` (Zod schemas). This is a **scaffold** — each module has real,
working plumbing (routing, validation, database access) but intentionally thin business logic,
so a team can fill in the actual rules without fighting the wiring.

## The payer adapter pattern

`modules/payer/adapters/` defines a `PayerAdapter` interface
(`verifyMember` / `checkEligibility` / `requestAuthorisation` / `getAuthorisationStatus`) and a
registry keyed by payer code. `fake-payer.adapter.ts` is a working in-memory implementation used
in development and tests, so booking → eligibility → authorisation flows can be built end-to-end
before a real HMO integration exists. **A new payer is config, not a code branch** — see
[the blueprint, §9](../docs/prd/lifecome-live-blueprint.md#9-multi-hmo-integration-architecture).

## Conventions

- **No path aliases.** The Nest CLI's SWC builder does not rewrite `tsconfig` path aliases at
  runtime, so all intra-project imports are relative.
- **Errors** are thrown as `AppException(code, message, httpStatus)` and rendered by the global
  filter as `{ error: { code, message }, correlationId }` — a stable machine-readable code plus a
  message that is safe to show a patient (blueprint §7.1).
- **Idempotency.** Handlers that create money-moving or booking side effects are annotated
  `@Idempotent()`; the interceptor requires an `Idempotency-Key` header and replays the stored
  response for a repeated key instead of re-running the handler.
- **Correlation IDs.** Every request gets an `x-correlation-id` (from the caller, or generated),
  echoed on the response and attached to every log line for that request.

## What is intentionally not here yet

Authentication against a real identity provider, the real payer/payment/video integrations, and
row-level security policies are open decisions in the
[tech stack recommendation](../docs/architecture/tech-stack-recommendation.md#9-key-adrs-to-write-in-phase-0).
This scaffold stubs them behind interfaces so those decisions do not block building the rest of
the service.
