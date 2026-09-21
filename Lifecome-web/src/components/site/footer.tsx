import Link from "next/link";
import { footerLegalLinks, primaryNav } from "@/content/nav";
import { siteName } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

export function Footer() {
  const columns = primaryNav.filter((g) => g.children);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2.7fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm font-semibold text-ink">A Healthier You, Brighter Tomorrow</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {siteName} is a healthcare delivery and coordination platform. Cover and authorisation for HMO-funded care are decided by
              your HMO and your plan.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-bold text-ink">{group.label}</h2>
                <ul className="mt-3 space-y-2">
                  {group.children!.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ink-muted hover:text-link hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 rounded-card border border-gold/50 bg-card p-4 text-sm text-ink">
          <strong className="font-bold">In an emergency, do not use {siteName}.</strong> Go to the nearest emergency facility or call your
          local emergency number.{" "}
          <Link href="/emergency" className="font-semibold text-link underline underline-offset-2">
            Emergency &amp; urgent care guidance
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-link hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
