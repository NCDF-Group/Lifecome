This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Regions (Nigeria and the UK)

LifeCome Live is available in Nigeria and the United Kingdom. A popup asks **"Are you in Nigeria or
the UK?"** (with each country's flag). Choosing the UK finishes there; choosing Nigeria continues to
**"Choose your language"** - Yorùbá, Igbo, Hausa or English. **It appears on every page load** (a
reload or a fresh visit, not when clicking around the site) **until the visitor ticks "Don't show
this again"**, so their region and language are always one tap away.

How it works, so the pages themselves stay statically rendered:

1. `src/proxy.ts` reads the country from the host's geo header (`x-vercel-ip-country` on Vercel,
   `cf-ipcountry` behind Cloudflare) and stores it in a `lc_geo` cookie. On any other host there is
   no header, so nothing is detected and the visitor is simply asked to choose.
2. `RegionPrompt` (mounted in `(site)/layout.tsx`) is the popup. Answers are saved for a year in
   `lc_region` and `lc_lang` cookies and apply to the site straight away. The popup is **not**
   tied to having answered: it stays away only if the visitor ticked "Don't show this again", which
   sets a separate `lc_popup=off` cookie. Pressing Escape closes it for that visit only (and
   honours the checkbox). A reload the site triggers itself - applying a translation - is flagged in
   `sessionStorage` so it doesn't reopen the popup they just answered.
3. `RegionSwitcher` (the flag button in the header, and the mobile menu) changes region - and, in
   Nigeria, language - at any time, including after opting out of the popup.

To make anything region-specific, call `useRegion()` from `src/lib/use-region.ts` in a client
component; it returns `region` (`"ng"` or `"uk"`, defaulting to `"ng"` until the visitor chooses)
and `language` (`"en"`, `"yo"`, `"ig"` or `"ha"`, defaulting to `"en"`). Regions, languages and
the country-to-region mapping live in `src/lib/region.ts`; the flags are inline SVGs in
`src/components/ui/flag.tsx` (emoji flags don't render on Windows).

The popup's **"Use my current location"** button asks the browser for the visitor's position (the
browser shows its own permission prompt). If they allow it and it matches Nigeria or the UK, that
region is applied and the popup closes on its own (Nigeria keeps a language they'd already picked,
otherwise English - the header menu changes it). If they refuse, it can't be found, or it's
outside both markets, a message says so and they choose manually. It's a button, not an automatic
request on load, because browsers ignore or penalise location prompts nobody asked for. `src/lib/locate.ts` maps coordinates to a region with rough
bounding boxes (`regionForCoordinates` in `src/lib/region.ts`), so nothing is sent to a third
party and the coordinates are never stored - only the resulting region is kept. It's approximate on
purpose (Dublin, for instance, falls inside the UK box), so treat it as a convenience: the manual
buttons are always the precise route, and the header menu corrects a wrong guess.
Geolocation only works on `https` (or `localhost`).

**Re-testing the popup:** it shows on every load unless "Don't show this again" was ticked. If it
was, visit `/?region=reset` (any path works) to clear the saved region, language and opt-out and see
it again, or use a private window.

### What changes for the UK

Choosing the UK switches the page immediately, with no reload and no flash. `<html data-region>` is
set before first paint by a tiny inline script (`regionInitScript` in `src/lib/region.ts`, mounted
in `app/layout.tsx`), and `ForRegion` (`src/components/ui/for-region.tsx`) puts both versions of a
piece of copy in the static HTML while CSS shows the visitor's - so pages stay statically rendered.
For the UK today:

- `<html lang>` becomes `en-GB` (Nigeria: `en-NG`).
- Home page: the hero, the payment section ("Simple, upfront payment", a single Pay directly card
  - the UK has no HMOs), the how-it-works step, and the booking-card chip.
- Footer: the HMO disclaimer becomes "available in Nigeria and the United Kingdom", and the
  emergency note says "Call 999 or go to your nearest A&E department".

**Not yet UK-aware:** the navigation (its "Use Your HMO" / "Participating HMOs" links), and the
~36 content pages, which are all written for Nigeria. Those need real UK product decisions (which
payment routes exist, which regulators and insurers apply) before anyone writes copy for them - wrap
each Nigeria-specific passage in `ForRegion` as it gets a UK counterpart.

### Yoruba, Igbo and Hausa

Choosing one of these actually translates the whole site. It uses **Google's website translator**
(`src/components/site/translation-loader.tsx`, with the logic in `src/lib/translate.ts`), driven by
our own language picker - Google's default widget UI is hidden. It is **machine translation**: the
popup says so, wording won't always be perfect, and English is one tap away in the header menu.
Replace it with professionally translated copy per page whenever that exists (this is a healthcare
site - consent, privacy and emergency pages in particular deserve a native-speaker review).

- **Only loaded on demand.** The Google script is added only for visitors who chose one of these
  languages; everyone else (English, and all of the UK) never touches it. It does send the page's
  public text to Google to translate it.
- **How it works.** Picking a language saves `lc_lang` (a year) and sets the translator's `googtrans`
  cookie, then reloads once. English clears the cookie and reloads, which fully restores the page.
  The translator's cookie is a session cookie, so `TranslationLoader` re-sets it on every visit from
  `lc_lang`.
- **A "Translating to ..." pill** shows until the first translated text appears, because Google's
  response time varies (typically a second or two; longer on a slow connection, and it waits while
  the tab is in the background). After 60 seconds it says translation isn't available and the site
  stays in English.
- **React compatibility.** The translator rewrites text nodes behind React's back, which can make
  React throw when it later removes or moves them. `protectReactFromTranslator` (in `translate.ts`)
  is the standard guard against that. Language names and the status pill are marked
  `translate="no"` so they stay readable.
- **`<html lang>`** is set to `yo`/`ig`/`ha` by the translator once the text has actually been
  translated, and is `en-NG`/`en-GB` otherwise.
- **Not translated:** the browser tab title after a client-side navigation (Next.js resets it).

**If the popup or translation doesn't work in `npm run dev`:** Next's dev server refuses to serve its
client scripts to any origin other than `localhost` (for example `127.0.0.1`, or your computer's
network address when testing on a phone) and prints "Blocked cross-origin request" - so nothing that
needs JavaScript runs. Use `http://localhost:3000`, or list the other origin in `allowedDevOrigins`
in `next.config.ts`. Production builds are unaffected.

To try it locally (there is no geo header on `localhost`), add `?geo=GB` or `?geo=NG` to any URL,
clearing the `lc_region` cookie first if you have already chosen. That override only works outside
production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
