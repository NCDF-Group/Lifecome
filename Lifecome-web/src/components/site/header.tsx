"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, utilityNav } from "@/content/nav";
import { patientAppUrl } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

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
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
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
                      className="flex min-h-11 items-center gap-1.5 rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
                    >
                      {item.label}
                      <Chevron open={openId === item.label} />
                    </button>
                    {openId === item.label && (
                      <ul
                        id={`menu-${item.label}`}
                        className="absolute left-0 top-full mt-2 w-64 rounded-card border border-line bg-white p-2 shadow-xl shadow-ink/10"
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={close}
                              className="block rounded-control px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-blue"
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
                    className="flex min-h-11 items-center rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href={utilityNav.help.href} className="rounded-control px-3 py-2 text-sm font-semibold text-ink hover:bg-surface">
            {utilityNav.help.label}
          </Link>
          {patientAppUrl && (
            <a href={`${patientAppUrl}/sign-in`} className="rounded-control px-3 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Sign In
            </a>
          )}
          <ButtonLink href={utilityNav.getCare.href}>{utilityNav.getCare.label}</ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink href={utilityNav.getCare.href} size="md" className="px-4">
            {utilityNav.getCare.label}
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

      {mobileOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
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
            <div className="flex flex-wrap gap-3 border-t border-line pt-6">
              <ButtonLink href={utilityNav.help.href} variant="secondary" onClick={close}>
                {utilityNav.help.label}
              </ButtonLink>
              {patientAppUrl && (
                <a href={`${patientAppUrl}/sign-in`} className="inline-flex min-h-11 items-center rounded-control border-2 border-blue px-5 font-semibold text-blue">
                  Sign In
                </a>
              )}
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
