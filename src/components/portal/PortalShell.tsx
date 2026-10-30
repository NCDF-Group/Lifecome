"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, ChevronLeft, Home, LogOut, Menu, MessageSquare, Search, User, X } from "lucide-react"
import { BrandLogo, BrandMark } from "@/components/common/BrandLogo"
import { useAuth } from "@/context/AuthContext"
import { useMessageThreads } from "@/hooks/useMessages"
import { useAvatar } from "@/lib/avatar"
import { ROUTES } from "@/lib/constants"
import { createLocalStore } from "@/lib/local-store"
import { cn } from "@/lib/utils"
import { NotificationsLink, RegionBadge, UserMenu } from "./HeaderControls"
import { PortalSearch } from "./PortalSearch"
import { Avatar, FOCUS_RING } from "./ui"

// Navigation stays within the patient session
const NAV_ITEMS = [
  { label: "Home", icon: Home, href: ROUTES.PORTAL.DASHBOARD },
  { label: "Visit", icon: Calendar, href: ROUTES.PORTAL.APPOINTMENTS },
  { label: "Messages", icon: MessageSquare, href: ROUTES.PORTAL.MESSAGES },
  { label: "Profile", icon: User, href: ROUTES.PORTAL.PROFILE },
]

// Pages whose Back link should skip their parent, e.g. a cancelled appointment
// returns to the visits list rather than to the appointment it just closed
const BACK_OVERRIDES: { pattern: RegExp; href: string }[] = [
  { pattern: /^\/portal\/appointments\/[^/]+\/cancelled$/, href: ROUTES.PORTAL.APPOINTMENTS },
  // There's no Services page, as services are listed on Home, so a service returns there
  { pattern: /^\/portal\/services\/[^/]+$/, href: ROUTES.PORTAL.DASHBOARD },
  // There's no list of wellbeing sessions, so one session returns to the Wellbeing page
  { pattern: /^\/portal\/services\/wellbeing\/sessions\/[^/]+$/, href: ROUTES.PORTAL.WELLBEING },
]

/** Pages below a top-level section get a Back link to their parent. */
function getBackHref(pathname: string) {
  // Booking has its own Back, which steps through it, and neither a finished booking nor a call has one
  if (pathname === ROUTES.PORTAL.BOOK_ONLINE_GP || /^\/portal\/appointments\/[^/]+\/(booked|consultation)$/.test(pathname)) return null
  const override = BACK_OVERRIDES.find(({ pattern }) => pattern.test(pathname))
  if (override) return override.href
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length <= 2) return null
  return `/${segments.slice(0, -1).join("/")}`
}

// Matches Tailwind's `lg` breakpoint, where the sidebar replaces the drawer
const DESKTOP_QUERY = "(min-width: 1024px)"

type SidebarMode = "expanded" | "collapsed"
const sidebarStore = createLocalStore<SidebarMode>(
  "lifecome_sidebar",
  (value): value is SidebarMode => value === "expanded" || value === "collapsed",
  "expanded"
)

const ICON_BUTTON = cn(
  "w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0",
  FOCUS_RING
)

function NavLinks({
  isActive,
  unreadMessages,
  collapsed = false,
  onNavigate,
}: {
  isActive: (href: string) => boolean
  unreadMessages: number
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Main" className="space-y-1">
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = isActive(href)
        const badge = href === ROUTES.PORTAL.MESSAGES && unreadMessages > 0 ? unreadMessages : null
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center rounded-xl text-[15px] transition-colors",
              collapsed ? "w-12 h-12 mx-auto justify-center" : "w-full gap-3 px-3.5 py-2.5",
              active ? "bg-[#0062F5] text-white font-semibold shadow-sm shadow-blue-600/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              FOCUS_RING
            )}
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden />
            <span className={collapsed ? "sr-only" : "flex-1"}>{label}</span>
            {badge !== null &&
              (collapsed ? (
                <span aria-hidden className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              ) : (
                <span aria-hidden className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold flex items-center justify-center">
                  {badge > 99 ? "99+" : badge}
                </span>
              ))}
            {badge !== null && <span className="sr-only">, {badge} unread</span>}
          </Link>
        )
      })}
    </nav>
  )
}

function SignOutButton({ onClick, collapsed = false }: { onClick: () => void; collapsed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? "Sign out" : undefined}
      className={cn(
        "flex items-center text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer",
        collapsed ? "w-12 h-12 mx-auto justify-center" : "w-full gap-3 px-3.5 py-2.5",
        FOCUS_RING
      )}
    >
      <LogOut className="w-5 h-5" aria-hidden />
      <span className={collapsed ? "sr-only" : undefined}>Sign out</span>
    </button>
  )
}

export function BackLink({ href, onNavigate }: { href: string; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (!onNavigate) return
        event.preventDefault()
        onNavigate()
      }}
      className={cn("inline-flex items-center gap-1 rounded-lg mb-3 sm:mb-4 -ml-1 text-[15px] font-medium text-[#0062F5] hover:text-[#0050C7]", FOCUS_RING)}
    >
      <ChevronLeft className="w-5 h-5" aria-hidden />
      Back
    </Link>
  )
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const avatarSrc = useAvatar(user?.id) ?? user?.avatarUrl
  const threads = useMessageThreads()
  const sidebarMode = sidebarStore.useValue()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const collapsed = sidebarMode === "collapsed"
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const backHref = getBackHref(pathname)
  const hasName = Boolean(user?.name) && !user?.name.includes("@")
  const unreadMessages = threads.data?.filter((thread) => thread.unreadCount > 0).length ?? 0

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
      {/* Desktop sidebar; collapses to an icon rail to give the page more room */}
      <aside
        id="portal-sidebar"
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-r border-slate-100 bg-white sticky top-0 h-screen transition-[width] duration-200 ease-out motion-reduce:transition-none",
          collapsed ? "w-[76px]" : "w-60 xl:w-64"
        )}
      >
        <div className={cn("h-[72px] flex items-center shrink-0", collapsed ? "justify-center" : "px-5")}>
          {collapsed ? <BrandMark href={ROUTES.PORTAL.DASHBOARD} /> : <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="lg" />}
        </div>
        <div className={cn("flex-1 overflow-y-auto pt-4", collapsed ? "px-2" : "px-3")}>
          <NavLinks isActive={isActive} unreadMessages={unreadMessages} collapsed={collapsed} />
        </div>
        <div className={cn("border-t border-slate-100 py-4", collapsed ? "px-2" : "px-3")}>
          <SignOutButton onClick={logout} collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile and tablet drawer */}
      <div className={cn("lg:hidden fixed inset-0 z-50", isDrawerOpen ? "visible" : "invisible pointer-events-none")} inert={!isDrawerOpen}>
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
            "absolute inset-y-0 left-0 w-[85%] max-w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between pl-4 pr-3 h-16 border-b border-slate-100">
            <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="sm" />
            <button ref={closeButtonRef} type="button" onClick={closeDrawer} aria-label="Close menu" className={ICON_BUTTON}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {user && (
            <Link
              href={ROUTES.PORTAL.PROFILE}
              onClick={() => setIsDrawerOpen(false)}
              className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
            >
              <Avatar name={hasName ? user.name : user.email} src={avatarSrc} size="md" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 truncate">{hasName ? user.name : "Your account"}</span>
                <span className="block text-xs text-slate-500 truncate">{user.email}</span>
              </span>
            </Link>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <NavLinks isActive={isActive} unreadMessages={unreadMessages} onNavigate={() => setIsDrawerOpen(false)} />
          </div>

          <div className="border-t border-slate-100 px-3 pt-3 pb-5 space-y-2">
            <RegionBadge fullWidth className="sm:hidden" />
            <SignOutButton onClick={logout} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0" inert={isDrawerOpen}>
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-100">
          <div className="h-16 lg:h-[72px] px-3 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-3">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              aria-controls="portal-drawer"
              className={cn(ICON_BUTTON, "lg:hidden -ml-1")}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => sidebarStore.set(collapsed ? "expanded" : "collapsed")}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              aria-controls="portal-sidebar"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(ICON_BUTTON, "hidden lg:flex -ml-2")}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="lg:hidden min-w-0">
              <BrandLogo variant="live" href={ROUTES.PORTAL.DASHBOARD} size="sm" />
            </div>

            <PortalSearch className="hidden md:block flex-1 max-w-md lg:max-w-lg" />

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen((open) => !open)}
                aria-label={isMobileSearchOpen ? "Close search" : "Search"}
                aria-expanded={isMobileSearchOpen}
                className={cn(ICON_BUTTON, "md:hidden")}
              >
                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <RegionBadge className="hidden sm:flex" />
              <NotificationsLink />
              <UserMenu />
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="md:hidden px-3 sm:px-6 pb-3">
              <PortalSearch autoFocus onNavigate={() => setIsMobileSearchOpen(false)} />
            </div>
          )}
        </header>

        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-10 sm:pt-6 lg:pt-8 lg:pb-12">
          {backHref && <BackLink href={backHref} />}
          {children}
        </main>
      </div>
    </div>
  )
}
