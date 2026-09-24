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

LifeCome Live is available in Nigeria and the United Kingdom. On a visitor's first visit, a popup
asks **"Are you in Nigeria or the UK?"** (with each country's flag), leading with the one their
location points to. Choosing the UK finishes there; choosing Nigeria continues to **"Choose your
language"** - Yorùbá, Igbo, Hausa or English. The popup shows once, then never again.

How it works, so the pages themselves stay statically rendered:

1. `src/proxy.ts` reads the country from the host's geo header (`x-vercel-ip-country` on Vercel,
   `cf-ipcountry` behind Cloudflare) and stores it in a `lc_geo` cookie. On any other host there is
   no header, so nothing is detected and the visitor is simply asked to choose.
2. `RegionPrompt` (mounted in `(site)/layout.tsx`) is the popup. The answers are saved for a year
   in `lc_region` and `lc_lang` cookies, and having `lc_region` is what stops it showing again.
   Pressing Escape counts as an answer (their detected region, in English) so it can't reappear.
3. `RegionSwitcher` (the flag button in the header, and the mobile menu) changes region - and, in
   Nigeria, language - later, since the popup won't come back.

To make anything region-specific, call `useRegion()` from `src/lib/use-region.ts` in a client
component; it returns `region` (`"ng"` or `"uk"`, defaulting to `"ng"` until the visitor chooses)
and `language` (`"en"`, `"yo"`, `"ig"` or `"ha"`, defaulting to `"en"`). Regions, languages and
the country-to-region mapping live in `src/lib/region.ts`; the flags are inline SVGs in
`src/components/ui/flag.tsx` (emoji flags don't render on Windows).

The popup's **"Use my current location"** button asks the browser for the visitor's position (the
browser shows its own permission prompt) and *suggests* a region from it - the visitor still
confirms. It's a button, not an automatic request on load, because browsers ignore or penalise
location prompts nobody asked for. `src/lib/locate.ts` maps coordinates to a region with rough
bounding boxes (`regionForCoordinates` in `src/lib/region.ts`), so nothing is sent to a third
party and the coordinates are never stored - only the resulting region is kept. It's approximate on
purpose (Dublin, for instance, falls inside the UK box) which is why it never answers for them.
Geolocation only works on `https` (or `localhost`).

**Re-testing the popup:** the answer is remembered for a year, so it won't show again in a browser
that has already answered. Visit `/?region=reset` (any path works) to clear it and see the popup
again, or use a private window.

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

There are no Yoruba, Igbo or Hausa translations - the language step says so, and the site stays in
English. The preference is stored (`useRegion().language`) and ready to use once translations exist.
`<html lang>` deliberately never becomes `yo`/`ig`/`ha`: that over English text would mislead screen
readers and trigger browser translation prompts.

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
