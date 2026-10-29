"use client"

import React, { useRef, useState } from "react"
import {
  Accessibility,
  Bell,
  Camera,
  CircleHelp,
  CreditCard,
  HeartPulse,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react"
import { ActionRow, Avatar, FOCUS_RING, PageContainer, PageHeader, type ActionItem } from "@/components/portal/ui"
import { useAuth } from "@/context/AuthContext"
import { getApiErrorMessage } from "@/lib/api-client"
import { ACCEPTED_AVATAR_TYPES, removeAvatar, uploadAvatar, useAvatar } from "@/lib/avatar"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const PROFILE = ROUTES.PORTAL.PROFILE

const SECTIONS: ActionItem[] = [
  { title: "Personal details", description: "Contact information and address", href: `${PROFILE}/personal-details`, icon: User, tone: "blue" },
  { title: "Health profile", description: "Blood group and genotype", href: `${PROFILE}/health`, icon: HeartPulse, tone: "blue" },
  { title: "Membership & benefits", description: "Membership, employer access and cover", href: `${PROFILE}/membership`, icon: ShieldCheck, tone: "blue" },
  { title: "Payment methods", description: "Cards and billing", href: `${PROFILE}/payment-methods`, icon: CreditCard, tone: "blue" },
  { title: "Privacy & permissions", description: "Control sharing and preferences", href: `${PROFILE}/privacy`, icon: Lock, tone: "blue" },
  { title: "Notifications", description: "How you hear from us", href: `${PROFILE}/notifications`, icon: Bell, tone: "blue" },
  { title: "Help & support", description: "Get assistance or share feedback", href: `${ROUTES.PORTAL.NEW_MESSAGE}?team=support`, icon: CircleHelp, tone: "blue" },
  { title: "Accessibility", description: "Display and reading preferences", href: `${PROFILE}/accessibility`, icon: Accessibility, tone: "blue" },
]

function ProfilePhoto({ ownerId, name }: { ownerId: string | undefined; name: string | null | undefined }) {
  const avatarSrc = useAvatar(ownerId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<"uploading" | "removing" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Clear the input so choosing the same file again still triggers a change
    event.target.value = ""
    if (!file || !ownerId) return
    setError(null)
    setBusy("uploading")
    try {
      await uploadAvatar(ownerId, file)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "We couldn't update your photo. Please try again."))
    } finally {
      setBusy(null)
    }
  }

  const handleRemove = async () => {
    if (!ownerId) return
    setError(null)
    setBusy("removing")
    try {
      await removeAvatar(ownerId)
    } catch (cause) {
      setError(getApiErrorMessage(cause, "We couldn't remove your photo. Please try again."))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar name={name} src={avatarSrc} tone="blue" className={cn("w-20 h-20 text-2xl", busy && "opacity-60")} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!ownerId || busy !== null}
          aria-label={avatarSrc ? "Change profile photo" : "Add profile photo"}
          className={cn(
            "absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0062F5] hover:bg-[#0052cc] text-white flex items-center justify-center ring-4 ring-[#F3F7FC] cursor-pointer disabled:opacity-60",
            FOCUS_RING
          )}
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED_AVATAR_TYPES.join(",")} onChange={handleFile} className="sr-only" tabIndex={-1} aria-hidden />
      <p role="status" className="sr-only">
        {busy === "uploading" ? "Uploading photo" : busy === "removing" ? "Removing photo" : ""}
      </p>
      {avatarSrc && !busy && (
        <button type="button" onClick={handleRemove} className="mt-3 text-xs font-medium text-slate-500 hover:text-red-600 hover:underline cursor-pointer">
          Remove photo
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const hasName = Boolean(user?.name) && !user?.name.includes("@")

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader title="My Profile" description="Your details and preferences." />

      <section aria-label="Your account" className="rounded-2xl border border-[#E3EAF5] bg-[#F3F7FC] px-4 py-6 sm:py-7 text-center">
        <ProfilePhoto ownerId={user?.id} name={hasName ? user?.name : user?.email} />
        <p className="mt-3 text-lg sm:text-xl font-semibold text-slate-900 break-words">{hasName ? user!.name : "Your account"}</p>
        {user?.email && <p className="text-sm text-slate-500 break-all">{user.email}</p>}
      </section>

      <nav aria-label="Profile sections">
        <ul className="space-y-3">
          {SECTIONS.map((item) => (
            <li key={item.title}>
              <ActionRow item={item} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={logout}
          className={cn("rounded-lg px-4 py-2 text-base sm:text-lg font-semibold text-[#0062F5] hover:text-[#0050C7] hover:underline cursor-pointer", FOCUS_RING)}
        >
          Log out
        </button>
      </div>
    </PageContainer>
  )
}
