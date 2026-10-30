"use client"

import React, { useCallback, useId, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, Calendar, ChevronDown, LogOut, MessageSquare, User as UserIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useDismiss } from "@/hooks/useDismiss"
import { useAvatar } from "@/lib/avatar"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Avatar, FOCUS_RING } from "./ui"

/** The service only runs in the UK for now, so this states the region rather than offering a choice. */
export function RegionBadge({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  return (
    <div
      aria-label="Region: United Kingdom"
      className={cn(
        "flex items-center gap-2 h-10 px-3 rounded-full bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-800",
        fullWidth && "w-full",
        className
      )}
    >
      <Image src="/images/uk-flag.svg" alt="" width={20} height={10} className="h-[10px] w-5 shrink-0" />
      <span>{fullWidth ? "United Kingdom" : "UK"}</span>
    </div>
  )
}

export function NotificationsLink({ hasUnread = true }: { hasUnread?: boolean }) {
  return (
    <Link
      href={ROUTES.PORTAL.NOTIFICATIONS}
      aria-label={hasUnread ? "Notifications, you have unread notifications" : "Notifications"}
      className={cn(
        "relative w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shrink-0",
        FOCUS_RING
      )}
    >
      <Bell className="w-5 h-5" />
      {hasUnread && <span aria-hidden className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0062F5] ring-2 ring-white" />}
    </Link>
  )
}

const USER_MENU_LINKS = [
  { label: "Your profile", href: ROUTES.PORTAL.PROFILE, icon: UserIcon },
  { label: "Your visits", href: ROUTES.PORTAL.APPOINTMENTS, icon: Calendar },
  { label: "Messages", href: ROUTES.PORTAL.MESSAGES, icon: MessageSquare },
]

/** The signed-in patient's profile picture, which opens their account menu. */
export function UserMenu() {
  const { user, logout } = useAuth()
  const avatarSrc = useAvatar(user?.id) ?? user?.avatarUrl
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  // Before the profile is filled in, the API falls back to the email as the name
  const hasName = Boolean(user?.name) && !user?.name.includes("@")
  const displayName = hasName ? user!.name : "Your account"
  const firstName = hasName ? user!.name.split(" ")[0] : null

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Open account menu"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-2 h-10 rounded-full p-0.5 sm:pr-2.5 sm:border sm:border-slate-100 sm:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer",
          FOCUS_RING
        )}
      >
        <Avatar name={hasName ? user!.name : user?.email} src={avatarSrc} size="sm" className="w-9 h-9" />
        {firstName && <span className="hidden md:block max-w-[110px] truncate text-sm font-semibold text-slate-800">{firstName}</span>}
        <ChevronDown className={cn("hidden sm:block w-4 h-4 text-slate-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-900/10"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={hasName ? user!.name : user?.email} src={avatarSrc} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              {user?.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
            </div>
          </div>
          <div className="my-1 border-t border-slate-100" />
          {USER_MENU_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon className="w-4 h-4 text-slate-400" aria-hidden />
              {label}
            </Link>
          ))}
          <div className="my-1 border-t border-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close()
              logout()
            }}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
