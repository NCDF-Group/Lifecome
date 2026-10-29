"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, ChevronLeft, Home, LayoutGrid, LogOut, Menu, MessageSquare, User, X } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { useAuth } from "@/context/AuthContext"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { NotificationsLink, RegionSelect, UserMenu } from "./HeaderControls"
import { Avatar, FOCUS_RING } from "./ui"

// Navigation stays within the patient session
const NAV_ITEMS = [
  { label: "Home", icon: Home, href: ROUTES.PORTAL.DASHBOARD },
  { label: "Services", icon: LayoutGrid, href: ROUTES.PORTAL.SERVICES },
  { label: "Visit", icon: Calendar, href: ROUTES.PORTAL.APPOINTMENTS },
  { label: "Messages", icon: MessageSquare, href: ROUTES.PORTAL.MESSAGES },
  { label: "Profile", icon: User, href: ROUTES.PORTAL.PROFILE },
]

// Pages whose Back link should skip their parent, e.g. a cancelled appointment
// returns to the visits list rather than to the appointment it just closed
const BACK_OVERRIDES: { pattern: RegExp; href: string }[] = [
  { pattern: /^\/portal\/appointments\/[^/]+\/cancelled$/, href: ROUTES.PORTAL.APPOINTMENTS },
]

/** Pages below a top-level section get a Back link to their parent. */
function getBackHref(pathname: string) {
  const override = BACK_OVERRIDES.find(({ pattern }) => pattern.test(pathname))
  if (override) return override.href
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length <= 2) return null
  return `/${segments.slice(0, -1).join("/")}`
}

// Matches Tailwind's `lg` breakpoint, where the sidebar replaces the drawer
const DESKTOP_QUERY = "(min-width: 1024px)"

function NavLinks({ isActive, onNavigate }: { isActive: (href: string) => boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="space-y-1.5">
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[17px] transition-colors",
              active ? "bg-[#0062F5] text-white font-semibold shadow-sm shadow-blue-600/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              FOCUS_RING
            )}
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function SignOutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer",
        FOCUS_RING
      )}
    >
      <LogOut className="w-4 h-4" aria-hidden />
      <span>Sign out</span>
    </button>
  )
}

function BackLink({ href, className }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-1.5 rounded-lg text-[17px] font-medium text-[#0062F5] hover:text-[#0050C7]", FOCUS_RING, className)}
    >
      <ChevronLeft className="w-5 h-5" aria-hidden />
      Back
    </Link>
  )
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const backHref = getBackHref(pathname)
  const hasName = Boolean(user?.name) && !user?.name.includes("@")

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  // While the drawer is open: lock page scroll, move focus into it, close on Escape,
  // and close it if the window grows to desktop width where the sidebar takes over
  useEffect(() => {
    if (!isDrawerOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer()
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const handleResize = () => {
      if (desktop.matches) setIsDrawerOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    desktop.addEventListener("change", handleResize)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKey)
      desktop.removeEventListener("change", handleResize)
    }
  }, [isDrawerOpen, closeDrawer])

  return (
    <div className="min-h-screen w-full bg-white flex font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 xl:w-[300px] 2xl:w-[340px] shrink-0 flex-col justify-between border-r border-slate-100 bg-white px-2 pt-10 pb-6 sticky top-0 h-screen">
        <div className="space-y-10">
          <div className="px-6">
            <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="lg" />
          </div>
          <NavLinks isActive={isActive} />
        </div>
        <div className="pt-6 border-t border-slate-100">
          <SignOutButton onClick={logout} />
        </div>
      </aside>

      {/* Mobile and tablet drawer */}
      <div
        className={cn("lg:hidden fixed inset-0 z-50", isDrawerOpen ? "visible" : "invisible pointer-events-none")}
        inert={!isDrawerOpen}
      >
        <div
          aria-hidden
          onClick={closeDrawer}
          className={cn("absolute inset-0 bg-slate-900/40 transition-opacity duration-300", isDrawerOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          id="portal-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
            <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="sm" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDrawer}
              aria-label="Close menu"
              className={cn("w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer", FOCUS_RING)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user && (
            <Link
              href={ROUTES.PORTAL.PROFILE}
              onClick={() => setIsDrawerOpen(false)}
              className="mx-3 mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
            >
              <Avatar name={hasName ? user.name : user.email} src={user.avatarUrl} size="lg" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 truncate">{hasName ? user.name : "Your account"}</span>
                <span className="block text-xs text-slate-500 truncate">{user.email}</span>
              </span>
            </Link>
          )}

          <div className="flex-1 overflow-y-auto px-2 py-4">
            <NavLinks isActive={isActive} onNavigate={() => setIsDrawerOpen(false)} />
          </div>

          <div className="border-t border-slate-100 px-3 pt-4 pb-6 space-y-3">
            <RegionSelect fullWidth className="sm:hidden" />
            <SignOutButton onClick={logout} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0" inert={isDrawerOpen}>
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-100 shadow-[0_1px_8px_rgba(15,23,42,0.03)]">
          <div className="h-16 lg:h-[100px] px-3 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
                aria-controls="portal-drawer"
                className={cn("lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0", FOCUS_RING)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="lg:hidden">
                <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="sm" />
              </div>
              {backHref && <BackLink href={backHref} className="hidden lg:inline-flex" />}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <RegionSelect className="hidden sm:block" />
              <NotificationsLink />
              <UserMenu />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 pt-5 pb-12 sm:pt-8 lg:pt-12 lg:pb-16">
          {backHref && <BackLink href={backHref} className="lg:hidden mb-4 -ml-1" />}
          {children}
        </main>
      </div>
    </div>
  )
}
