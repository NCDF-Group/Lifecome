"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, utilityNav } from "@/content/nav";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { RegionSwitcher } from "./region-switcher";
import { normalizePatientProfile, patientEmail, patientName } from "@/lib/patient/profile";

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
  const router = useRouter();

  const [state, setState] = useState<OpenState | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openId = state && state.path === pathname ? state.id : null;

  // Auth state
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Patient");
  const [userEmail, setUserEmail] = useState("");
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState("");

  const toggle = (id: string) => setState(openId === id ? null : { path: pathname, id });
  const close = () => setState(null);

  // Resolve the server-managed session and profile on mount and route change.
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/patient", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!active) return;

        let body: unknown = null;
        try {
          body = await response.json();
        } catch {
          body = null;
        }

        if (response.status === 401) {
          setLoggedIn(false);
          setUserName("Patient");
          setUserEmail("");
          setAuthError("");
          return;
        }

        setLoggedIn(true);
        if (!response.ok) {
          const message =
            typeof body === "object" && body !== null && "message" in body &&
            typeof body.message === "string"
              ? body.message
              : "Unable to verify your account session.";
          setAuthError(message);
          return;
        }

        const profile = normalizePatientProfile(body);
        if (!active) return;
        if (!profile) {
          setAuthError("The patient profile response was not in the expected format.");
          return;
        }
        setAuthError("");
        setUserName(patientName(profile));
        setUserEmail(patientEmail(profile));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (active) {
          setLoggedIn(false);
          setUserName("Patient");
          setUserEmail("");
          setAuthError("Unable to verify your account session. Please try again.");
        }
      }
    }

    void loadSession();
    return () => {
      active = false;
      controller.abort();
    };
  }, [pathname]);

  // Click outside & Escape listeners
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

  const handleSignOut = async () => {
    setSignOutError("");
    setSigningOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to sign out. Please try again.");
      setLoggedIn(false);
      close();
      router.replace("/sign-in");
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  const mobileOpen = openId === "mobile";

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Primary Navigation */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {loggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  className={`flex min-h-11 items-center whitespace-nowrap rounded-control px-3 text-[0.92rem] font-semibold ${
                    pathname === "/dashboard" ? "bg-surface text-link" : "text-ink hover:bg-surface"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}

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
        <div className="hidden items-center gap-3 xl:flex">
          <RegionSwitcher />

          {/* Help Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openId === "Help"}
              aria-controls="menu-Help"
              onClick={() => toggle("Help")}
              className="flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
            >
              Help
              <Chevron open={openId === "Help"} />
            </button>
            {openId === "Help" && (
              <ul
                id="menu-Help"
                className="absolute right-0 top-full mt-2 w-48 rounded-card border border-line bg-card p-2 shadow-xl shadow-ink/10"
              >
                <li>
                  <Link
                    href={utilityNav.help.href}
                    onClick={close}
                    className="block rounded-control px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-link"
                  >
                    {utilityNav.help.label}
                  </Link>
                </li>
                <li>
                  <Link
                    href={utilityNav.getCare.href}
                    onClick={close}
                    className="block rounded-control px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface hover:text-link"
                  >
                    {utilityNav.getCare.label}
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* User Auth Controls */}
          {loggedIn ? (
            /* Logged-in User Profile Dropdown */
            <div className="relative">
              <button
                type="button"
                aria-expanded={openId === "user-menu"}
                onClick={() => toggle("user-menu")}
                className="flex items-center gap-2.5 rounded-full border border-line bg-card py-1.5 pl-2 pr-3 transition hover:border-blue/40 hover:bg-surface"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-ink">{userName}</span>
                <Chevron open={openId === "user-menu"} />
              </button>

              {openId === "user-menu" && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-xl shadow-ink/10">
                  <div className="border-b border-line px-3 py-2.5">
                    <p className="text-xs font-bold text-ink">{userName}</p>
                    {userEmail && <p className="text-xs text-ink-muted truncate">{userEmail}</p>}
                  </div>

                  <ul className="py-1">
                    <li>
                      <Link
                        href="/dashboard"
                        onClick={close}
                        className="flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
                      >
                        <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-blue" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        onClick={close}
                        className="flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
                      >
                        <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-positive" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        My Profile
                      </Link>
                    </li>
                  </ul>

                  <div className="border-t border-line pt-1">
                    {signOutError && <p role="alert" className="px-3 py-2 text-xs text-red-700">{signOutError}</p>}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="flex min-h-11 items-center whitespace-nowrap rounded-control px-3 text-[0.92rem] font-semibold text-ink hover:bg-surface"
              >
                Sign In
              </Link>
              <ButtonLink href="/sign-up" variant="primary">
                Get Started
              </ButtonLink>
            </div>
          )}
        </div>

        {/* Mobile Action Bar */}
        <div className="flex items-center gap-2 xl:hidden">
          {loggedIn ? (
            <Link
              href="/profile"
              className="flex size-9 items-center justify-center rounded-full bg-blue text-xs font-bold text-white"
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <ButtonLink href="/sign-up" size="md" className="px-4">
              Get Started
            </ButtonLink>
          )}

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

      {authError && (
        <Container>
          <p role="alert" className="pb-3 text-sm text-red-700">{authError}</p>
        </Container>
      )}

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          data-lenis-prevent
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-card xl:hidden"
        >
          <Container className="space-y-6 py-6">
            {loggedIn && (
              <div className="rounded-2xl border border-line bg-surface/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{userName}</p>
                    {userEmail && <p className="text-xs text-ink-muted">{userEmail}</p>}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                  <Link
                    href="/dashboard"
                    onClick={close}
                    className="flex items-center justify-center gap-1.5 rounded-control bg-card border border-line py-2 text-xs font-semibold text-ink"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={close}
                    className="flex items-center justify-center gap-1.5 rounded-control bg-card border border-line py-2 text-xs font-semibold text-ink"
                  >
                    My Profile
                  </Link>
                </div>
              </div>
            )}

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

            <div className="border-t border-line pt-6">
              {loggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-control border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <ButtonLink href="/sign-up" variant="primary" onClick={close} className="w-full">
                    Get Started
                  </ButtonLink>
                  <Link
                    href="/sign-in"
                    onClick={close}
                    className="flex w-full items-center justify-center rounded-control border border-line py-3 text-sm font-semibold text-ink hover:bg-surface"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
