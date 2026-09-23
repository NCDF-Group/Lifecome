<p align="center">
  <img src="brand/logo/lifecome-live-logo.svg" alt="LifeCome Live" width="420" />
</p>


# LifeCome Live

LifeCome Live is a digital healthcare and coordinated-care platform. People can see a doctor by video or audio, leave with a clear care plan, and keep their health records in one place, whether they use a participating HMO or pay directly.

LifeCome Live is the healthcare delivery and coordination platform. It is separate from LifeCome HMO, which is one HMO that may participate alongside others. Choosing how to pay decides how a visit is funded. It never splits a patient's identity, care or record.

## Status

| Area | State |
|---|---|
| Public website (`Lifecome-web`) | Built: home page plus the full 36-page site map, with content, images and animation |
| Backend API (`Lifecome-backend`) | Built: 22 domain modules (identity, staff/auth, payer, eligibility, booking, payment, clinical records and more), a 31-table database schema, a working payer-adapter pattern, and a guarded `/admin/*` API (staff JWT + roles) backing the operations console — patients, providers, bookings, payments, eligibility, audit log, consent, notifications, staff, plus cross-module dashboard/locations aggregates |
| Patient app (Flutter) | Built: the auth flow (splash, onboarding, sign in/up, email verification, password reset). The rest of the 22 views are scaffolded — folders and files, no code yet. See [`Lifecome-mobile/README.md`](Lifecome-mobile/README.md) and [Building the mobile app](#building-the-mobile-app) |
| Operations console (`Lifecome-admin`) | Wired to the real backend: staff sign-in, a guarded `(console)` layout, and Dashboard, Patients, Providers, Bookings, Payments, Payers, Eligibility, Audit log, Consent, Notifications, Service catalogue, Staff & roles and Locations all fetch live data - no demo data remains. The rest (Scheduling, Consultations, Clinical records, Documents, Care coordination, Authorisations, Messaging, Settings) are labelled placeholders, since the backend has no admin endpoints for those modules yet. See [`Lifecome-admin/README.md`](Lifecome-admin/README.md) |
| Provider portal | Planned |

See the [phased backlog](docs/planning/phased-backlog.md) for the delivery plan.

## What the website includes

- **36 approved pages:** services, access and payment, the care journey, health records, provider network, partners, trust, help, emergency guidance and legal, all driven by structured content in `src/content/`.
- **Light, fast and smooth:** statically generated pages, Manrope typography, inertial smooth scrolling, scroll-reveal animation, animated buttons and cards, and a back-to-top button. Motion respects the visitor's reduced-motion setting.
- **Brand system:** the approved palette as design tokens, accessible text colours, and logo variants for light and dark backgrounds.
- **Safe by default:** no invented HMO logos, prices or statistics. Participating HMOs appear only once onboarded.
- **Accessible:** skip link, keyboard-friendly navigation, visible focus states, semantic landmarks and status chips that never rely on colour alone.

## Tech stack

**Website:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lenis smooth scroll.

**Operations console:** the same Next.js/React/TypeScript/Tailwind stack as the website, plus
TanStack Table/Query for data grids and server state, Recharts for the dashboard, and Radix UI
primitives styled by hand (the shadcn/ui pattern) rather than a full component library. See
[`Lifecome-admin/README.md`](Lifecome-admin/README.md) for the full reasoning.

**Backend:** Node.js 20+ and **TypeScript**, on [NestJS](https://nestjs.com) with the **Fastify** adapter (faster than the
Express adapter NestJS defaults to) and the **SWC** builder instead of `tsc` (rebuilds in ~150ms instead of several
seconds). Data lives in **PostgreSQL**, accessed through **Drizzle ORM** (SQL-first, fully typed, no decorator-magic
entities). Background jobs (notifications, reconciliation) run on **BullMQ** over **Redis**. Requests are validated with
**Zod**. See [`Lifecome-backend/README.md`](Lifecome-backend/README.md) for the full reasoning and every module.

**Scaffolded, not built:** Flutter for the patient app — `Lifecome-mobile/` has the intended folder structure and an
empty file for every screen and widget, mapped to the blueprint's 22 views in
[its README](Lifecome-mobile/README.md), but no Dart code yet. See [Building the mobile app](#building-the-mobile-app)
below before writing any — there are real prerequisites (a Mac, developer-program accounts) worth knowing about first.

The full comparison of options considered is in the [tech stack recommendation](docs/architecture/tech-stack-recommendation.md).

## Repository structure

```
.
├── Lifecome-mobile/     Flutter patient app (auth flow built; the rest is scaffold only)
├── Lifecome-admin/      Next.js operations console (staff admin, payer ops, support, audit)
│   ├── public/          Brand assets, copied from brand/logo/
│   └── src/
│       ├── app/         Routes: (auth)/login, (console)/<one folder per backend module>
│       ├── components/  Shared shell, DataTable, charts, status/stat primitives
│       ├── features/    One folder per backend module: types, API hooks, feature UI
│       ├── lib/         API client, demo data, auth placeholders
│       └── config/      Env validation and the sidebar's navigation map
├── Lifecome-web/        Next.js public website
│   ├── public/          Images and brand assets
│   └── src/
│       ├── app/         Routes, layout and global styles
│       ├── components/  UI primitives, site chrome and the page renderer
│       ├── content/     Page registry, navigation and page content
│       └── lib/         Site configuration and helpers
├── Lifecome-backend/    NestJS API
│   ├── src/
│   │   ├── main.ts      Fastify bootstrap: helmet, CORS, Swagger, graceful shutdown
│   │   ├── app.module.ts
│   │   ├── common/      Config, error handling, validation, idempotency
│   │   ├── db/          Drizzle schema (29 tables) and the database client
│   │   ├── queue/       Redis connection and BullMQ registration
│   │   └── modules/     One folder per domain: identity, payer, booking, payment, ...
│   └── drizzle/         Generated SQL migrations
├── brand/logo/          LifeCome Live logo (SVG and PNG, colour and white)
└── docs/
    ├── prd/             Product and technology blueprint
    ├── architecture/    Tech stack recommendation
    └── planning/        Phased backlog
```

## Getting started

### Website

You need Node.js 20 or later and npm.

```bash
cd Lifecome-web
npm install
cp .env.example .env.local
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

#### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata, the sitemap and robots |
| `NEXT_PUBLIC_PATIENT_APP_URL` | Patient app URL. Sign-in links stay hidden while this is unset |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Enquiry email for partner and support calls to action |

### Backend

You need Node.js 20+, npm, and Docker (for a local Postgres and Redis — install
[Docker Desktop](https://www.docker.com/products/docker-desktop/) if you don't have it).

**1. Start Postgres and Redis.** This runs them in containers so you don't install either directly:

```bash
cd Lifecome-backend
docker compose up -d
```

**2. Copy the environment file** and leave the defaults — they match the containers from step 1:

```bash
cp .env.example .env
```

**3. Install dependencies:**

```bash
npm install
```

**4. Create the database tables.** The SQL migration is already generated and committed
(`drizzle/0000_overconfident_nekra.sql`); this just applies it:

```bash
npm run db:migrate
```

**5. Start the API in watch mode:**

```bash
npm run dev
```

**6. Check it's up.** In a browser or with curl:

- `http://localhost:3001/api/v1/health/live` → `{"status":"ok"}` — the process is running
- `http://localhost:3001/api/v1/health/ready` → confirms it can reach Postgres and Redis
- `http://localhost:3001/api/docs` → interactive API docs (Swagger UI), every route

| Command | What it does |
|---|---|
| `npm run dev` | Start the API in watch mode |
| `npm run build` | Production build (`dist/`) |
| `npm run test` | Unit tests — no database needed |
| `npm run test:e2e` | End-to-end tests — needs steps 1 and 4 done first |
| `npm run lint` / `npm run typecheck` | ESLint / full TypeScript check |
| `npm run db:generate` | Generate a new migration after changing `src/db/schema/` |
| `npm run db:studio` | Open Drizzle Studio — a browser UI to view/edit the local database |

Full command reference and the module-by-module layout: [`Lifecome-backend/README.md`](Lifecome-backend/README.md).

## Editing content

Page copy lives in `Lifecome-web/src/content/bodies/`, grouped by section. Each page is a plain object made of typed blocks (text, cards, steps, checklists, tables, FAQs and callouts), so wording can change without touching layout code.

- **Add or rename a page:** edit the registry in `src/content/pages.ts` and add its content to `src/content/bodies/`.
- **Add a header photo:** drop the image in `public/images/` and set `image` on the page (`src`, `alt`, and an optional `fade` and `position`).
- **List a participating HMO:** add it to `src/content/payers.ts` once its onboarding is complete.

## Sign-ups and accounts you'll need

Nothing here is needed to run the website or backend locally — everything above works with no
external accounts. These are for connecting real integrations and, eventually, going live.

### For the backend

| Account | Why | When you need it |
|---|---|---|
| A payment gateway — [Paystack](https://paystack.com) or [Flutterwave](https://flutterwave.com) | Processes direct-pay card/transfer payments | Before `PaymentModule` can take a real payment. Test/sandbox keys are free and instant; **live keys need a registered business (CAC certificate) and bank details**, which takes a few days to verify |
| An SMS provider — [Termii](https://termii.com) or [Africa's Talking](https://africastalking.com) | Delivers the real OTP code by SMS | Before phone verification works outside development (right now, OTPs are only logged to the console) |
| A video/RTC vendor — [LiveKit](https://livekit.io) (self-host or Cloud), or Daily/Agora | Powers the actual video/audio call | Before `ConsultationModule` can host a real consultation — this is currently a placeholder, see the tech stack recommendation §4 |
| A cloud/hosting account — e.g. AWS, or a simpler PaaS | Runs Postgres, Redis and the API in production | Whenever you're ready to deploy somewhere other than your own machine. `docker-compose.yml` is enough for local development and demos |
| A domain registrar | A real domain for the site and API | Before going live publicly |

Not needed yet, each is its own open decision documented in the
[tech stack recommendation](docs/architecture/tech-stack-recommendation.md#9-key-adrs-to-write-in-phase-0): an identity
provider (Keycloak can be self-hosted, no account needed), error tracking (e.g. Sentry), and product analytics (e.g.
PostHog).

### For the mobile app

See [Building the mobile app](#building-the-mobile-app) below — summarised here for reference once you decide to build it:

| Account | Cost | Why |
|---|---|---|
| Apple Developer Program | $99/year | Required to test on a physical iPhone beyond a few days, and to publish to the App Store |
| Google Play Console | $25 once | Required to publish to the Play Store (not needed to test on Android) |
| Firebase project | Free | Push notifications (FCM) on both platforms |

## Building the mobile app

The Flutter app hasn't been started. Before committing to it, here's what building and shipping
one actually involves — read this, then decide how you want to proceed.

**A Mac is required for iOS.** Xcode only runs on macOS, and Xcode is required to build, sign or
publish anything for iPhone — there's no way around this, even though Flutter itself is
cross-platform. If you're developing on Windows or Linux, you can still build the **Android** app
there, but iOS work needs a Mac somewhere (yours, a teammate's, or a cloud Mac service like
MacStadium or GitHub Actions' macOS runners for CI builds).

**Two developer-program accounts, each with its own friction:**
- **Apple Developer Program** ($99/year) — sign-up needs identity verification that can take a
  few days for an individual, longer for an organisation (it needs a D-U-N-S number). You can
  develop and test in the iOS Simulator without it; you need it to install on a real iPhone for
  more than 7 days, and to submit to the App Store.
- **Google Play Console** ($25 one-time) — faster to get, but Google's review for a **health app**
  asks for more than a typical app: a privacy policy URL, a data-safety declaration, and
  sometimes evidence of clinical/regulatory compliance. Build this time into your launch plan.

**Testing needs real devices, not just simulators, for this specific app.** Camera/microphone
behaviour, push notification delivery, and performance on a mid-range Android phone (which is
most of the target market — see the blueprint's device assumptions) all differ from what a
simulator shows you. Budget for at least one real mid-range Android phone and one iPhone.

**Three things worth deciding before scaffolding starts:**
1. **Android first, or both platforms from day one?** Starting Android-only avoids the Apple
   account and Mac requirement until later, at the cost of testing only one platform's quirks
   early. Given the target market, this is a reasonable way to move faster.
2. **Who holds the developer accounts?** They should be under the business's own Apple/Google
   accounts, not a personal one — moving an app between accounts later is painful.
3. **Push notifications and the video call SDK are still open** (see the sign-ups table above) —
   the RTC vendor choice in particular affects which Flutter package the app depends on, so it's
   worth settling before the consultation screens are built.

Tell me how you'd like to proceed — for example, Android-only to start, or both platforms, and
whether you already have (or plan to set up) the Apple and Google accounts yourself.

## Brand

| Token | Value |
|---|---|
| Logo Lime | `#A2E10D` |
| Logo Cyan | `#3DE5F8` |
| Logo Green | `#45AF03` |
| Logo Blue | `#0667B8` |
| Gold | `#B58A35` |
| White | `#FFFFFF` |

Lime, Cyan and Gold do not have enough contrast for text on white, so they are used for fills and accents. Blue is used for actions and links. Logo files are in [`brand/logo`](brand/logo).

## Documentation

- [Product and technology blueprint](docs/prd/lifecome-live-blueprint.md)
- [Tech stack recommendation](docs/architecture/tech-stack-recommendation.md)
- [Phased backlog](docs/planning/phased-backlog.md)
- [Backend README](Lifecome-backend/README.md) — module layout, the payer-adapter pattern, conventions
- [Mobile app README](Lifecome-mobile/README.md) — the full screen map, shared widgets, animation and font plan

## Important notes

- LifeCome Live is not for emergencies. The site directs people to urgent in-person care.
- Legal documents, clinical safety copy and security statements need review by the appropriate owners before go-live.
- The backend's payment, SMS and video integrations are stubbed pending the sign-ups above — see "What is
  intentionally not here yet" in the [backend README](Lifecome-backend/README.md#what-is-intentionally-not-here-yet).

## License

To be confirmed.
