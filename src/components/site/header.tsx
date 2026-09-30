"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, utilityNav } from "@/content/nav";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { RegionSwitcher } from "./region-switcher";

/** Open state is tied to the pathname it was opened on, so it closes on navigation without an effect. */
interface OpenState {
  path: string;
  id: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}>
      <path d="m2 4.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [state, setState] = useState<OpenState | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openId = state && state.path === pathname ? state.id : null;

  const toggle = (id: string) => setState(openId === id ? null : { path: pathname, id });
  const close = () => setState(null);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setState(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  const mobileOpen = openId === "mobile";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav ref={navRef} aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={openId === item.label}
                      aria-controls={`menu-${item.label}`}
                      onClick={() => toggle(item.label)}
                      className="flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
                    >
                      {item.label}
                      <Chevron open={openId === item.label} />
                    </button>
                    {openId === item.label && (
                      <ul
                        id={`menu-${item.label}`}
                        className="absolute left-0 top-full mt-2 w-64 rounded-card border border-line bg-card p-2 shadow-xl shadow-ink/10"
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={close}
                              className="block rounded-control px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-link"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex min-h-11 items-center whitespace-nowrap rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Utility Nav */}
        <div className="hidden items-center gap-2 xl:flex">
          <RegionSwitcher />
          <Link href={utilityNav.help.href} className="rounded-control px-3 py-2 text-sm font-semibold text-ink hover:bg-surface">
            {utilityNav.help.label}
          </Link>
          {/* Get Care - background removed */}
          <Link
            href={utilityNav.getCare.href}
            className="rounded-control px-3.5 py-2 text-sm font-semibold text-link hover:bg-surface"
          >
            {utilityNav.getCare.label}
          </Link>
          {/* Get Started - CTA button */}
          <ButtonLink href="/sign-up" variant="primary">
            Get Started
          </ButtonLink>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href={utilityNav.getCare.href}
            className="px-3 py-3 text-sm font-semibold text-link hover:bg-surface rounded-control"
          >
            {utilityNav.getCare.label}
          </Link>
          <ButtonLink href="/sign-up" size="md" className="px-4">
            Get Started
          </ButtonLink>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => toggle("mobile")}
            className="grid size-11 place-items-center rounded-control border border-line text-ink hover:bg-surface"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          data-lenis-prevent
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-card xl:hidden"
        >
          <Container className="space-y-6 py-6">
            {primaryNav.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{item.label}</p>
                    <ul className="mt-2 space-y-0.5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={close} className="block rounded-control px-3 py-3 font-medium text-ink hover:bg-surface">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href!} onClick={close} className="block rounded-control px-3 py-3 font-semibold text-ink hover:bg-surface">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-line pt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-muted">Region</p>
              <RegionSwitcher variant="inline" />
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <ButtonLink href="/sign-up" variant="primary" onClick={close} className="w-full sm:w-auto">
                Get Started
              </ButtonLink>
              <ButtonLink href={utilityNav.getCare.href} variant="ghost" onClick={close}>
                {utilityNav.getCare.label}
              </ButtonLink>
              <ButtonLink href={utilityNav.help.href} variant="ghost" onClick={close}>
                {utilityNav.help.label}
              </ButtonLink>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
