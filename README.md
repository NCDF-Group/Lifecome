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
| Patient app (Flutter) | Planned |
| Backend services (Node.js) | Planned |
| Provider portal and operations console | Planned |

See the [phased backlog](docs/planning/phased-backlog.md) for the delivery plan.

## What the website includes

- **36 approved pages:** services, access and payment, the care journey, health records, provider network, partners, trust, help, emergency guidance and legal, all driven by structured content in `src/content/`.
- **Light, fast and smooth:** statically generated pages, Manrope typography, inertial smooth scrolling, scroll-reveal animation, animated buttons and cards, and a back-to-top button. Motion respects the visitor's reduced-motion setting.
- **Brand system:** the approved palette as design tokens, accessible text colours, and logo variants for light and dark backgrounds.
- **Safe by default:** no invented HMO logos, prices or statistics. Participating HMOs appear only once onboarded.
- **Accessible:** skip link, keyboard-friendly navigation, visible focus states, semantic landmarks and status chips that never rely on colour alone.

## Tech stack

**Website:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lenis smooth scroll.

**Planned:** Flutter for the patient app and Node.js (NestJS) with PostgreSQL for the backend. See the [tech stack recommendation](docs/architecture/tech-stack-recommendation.md).

## Repository structure

```
.
├── Lifecome-web/        Next.js public website
│   ├── public/          Images and brand assets
│   └── src/
│       ├── app/         Routes, layout and global styles
│       ├── components/  UI primitives, site chrome and the page renderer
│       ├── content/     Page registry, navigation and page content
│       └── lib/         Site configuration and helpers
├── brand/logo/          LifeCome Live logo (SVG and PNG, colour and white)
└── docs/
    ├── prd/             Product and technology blueprint
    ├── architecture/    Tech stack recommendation
    └── planning/        Phased backlog
```

## Getting started

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

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata, the sitemap and robots |
| `NEXT_PUBLIC_PATIENT_APP_URL` | Patient app URL. Sign-in links stay hidden while this is unset |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Enquiry email for partner and support calls to action |

## Editing content

Page copy lives in `Lifecome-web/src/content/bodies/`, grouped by section. Each page is a plain object made of typed blocks (text, cards, steps, checklists, tables, FAQs and callouts), so wording can change without touching layout code.

- **Add or rename a page:** edit the registry in `src/content/pages.ts` and add its content to `src/content/bodies/`.
- **Add a header photo:** drop the image in `public/images/` and set `image` on the page (`src`, `alt`, and an optional `fade` and `position`).
- **List a participating HMO:** add it to `src/content/payers.ts` once its onboarding is complete.

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

## Important notes

- LifeCome Live is not for emergencies. The site directs people to urgent in-person care.
- Legal documents, clinical safety copy and security statements need review by the appropriate owners before go-live.

## License

To be confirmed.
