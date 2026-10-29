"use client"

import Link from "next/link"
import { Info } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { PageContainer, PageHeader } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"


// No membership plans are on sale yet, so this explains what membership will cover
// and lets the patient ask about it, without taking a payment or activating anything
const PLAN_DETAILS = [
  { label: "Status", value: "Not yet available" },
  { label: "Online GP", value: "Included appointments, where available" },
  { label: "Wellbeing", value: "Member resources" },
  { label: "Care & insurance", value: "Separate service arrangements" },
  { label: "Price", value: "Shown before you join" },
]

export default function LifeComeMembershipPage() {
  return (
    <PageContainer className="space-y-6">
      <PageHeader title="LifeCome membership" description="Membership plans are coming soon." />

      <dl className="divide-y divide-slate-100">
        {PLAN_DETAILS.map(({ label, value }) => (
          <div key={label} className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-0.5 min-[420px]:gap-4 py-3">
            <dt className="text-sm text-slate-400">{label}</dt>
            <dd className="text-[15px] text-slate-900 min-[420px]:text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <Notice icon={Info}>Membership terms will be shown here once they&apos;re approved. No payment is taken on this page.</Notice>

      <Link
        href={`${ROUTES.PORTAL.NEW_MESSAGE}?team=support&topic=booking_payments`}
        className="flex items-center justify-center w-full min-h-[52px] rounded-xl bg-[#0062F5] hover:bg-[#0052cc] text-white text-base sm:text-[17px] font-semibold shadow-sm shadow-blue-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0062F5] focus-visible:ring-offset-2"
      >
        Ask about membership
      </Link>
    </PageContainer>
  )
}
