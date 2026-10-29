"use client"

import React, { useCallback, useId, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, Calendar, Check, ChevronDown, LogOut, MessageSquare, User as UserIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useDismiss } from "@/hooks/useDismiss"
import { useAvatar } from "@/lib/avatar"
import { ROUTES } from "@/lib/constants"
import { REGIONS, setRegion, useRegion, type RegionCode } from "@/lib/region"
import { cn } from "@/lib/utils"
import { Avatar, FOCUS_RING } from "./ui"

export function RegionFlag({ code }: { code: RegionCode }) {
  if (code === "GB") {
    return <Image src="/images/uk-flag.svg" alt="" width={20} height={10} className="h-[10px] w-5 shrink-0" />
  }
  return (
    <span aria-hidden className="flex h-[10px] w-5 shrink-0 overflow-hidden rounded-[1px]">
      <span className="flex-1 bg-[#008751]" />
      <span className="flex-1 bg-white border-y border-slate-200" />
      <span className="flex-1 bg-[#008751]" />
    </span>
  )
}

export function RegionSelect({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  const region = useRegion()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  const current = REGIONS.find((option) => option.code === region) ?? REGIONS[0]

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`Region: ${current.name}`}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-2 h-10 pl-3 pr-2.5 rounded-full bg-slate-50 border border-slate-100 hover:border-slate-200 text-sm font-semibold text-slate-800 transition-colors cursor-pointer",
          fullWidth ? "w-full" : "min-w-[96px]",
          FOCUS_RING
        )}
      >
        <RegionFlag code={current.code} />
        <span className="flex-1 text-left">{fullWidth ? current.name : current.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          role="listbox"
          aria-label="Choose your region"
          className={cn(
            "absolute z-50 mt-2 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-900/5",
            fullWidth ? "inset-x-0" : "right-0 w-52"
          )}
        >
          {REGIONS.map((option) => {
            const isSelected = option.code === region
            return (
              <li key={option.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setRegion(option.code)
                    close()
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RegionFlag code={option.code} />
                  <span className="flex-1 text-left">{option.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#0062F5]" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
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
