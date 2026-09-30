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
