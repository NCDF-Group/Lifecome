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

LifeCome Live is available in Nigeria and the United Kingdom, and the site detects which one a
visitor is in and asks them to confirm: **"Stay in Nigeria"** or **"Go to UK"**, leading with the
one their location points to. They can change it any time from the globe button in the header.

How it works, so the pages themselves stay statically rendered:

1. `src/proxy.ts` reads the country from the host's geo header (`x-vercel-ip-country` on Vercel,
   `cf-ipcountry` behind Cloudflare) and stores it in a `lc_geo` cookie. On any other host there is
   no header, so nothing is detected and the visitor is simply asked to choose.
2. `RegionPrompt` (mounted in `(site)/layout.tsx`) shows the choice once. The answer is saved in a
   `lc_region` cookie for a year, and the prompt never shows again.
3. `RegionSwitcher` (in the header, and in the mobile menu) changes it later.

To make anything region-specific, call `useRegion()` from `src/lib/use-region.ts` in a client
component; it returns `region` (`"ng"` or `"uk"`, defaulting to `"ng"` until the visitor chooses).
Regions and the country-to-region mapping live in `src/lib/region.ts`. **Choosing a region does not
change any page content yet** - the copy is the same for both until UK-specific content exists.

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
