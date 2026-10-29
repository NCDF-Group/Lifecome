"use client"

import { Building2, Clock, ShieldCheck, Star } from "lucide-react"
import { Notice } from "@/components/portal/messages/shared"
import { ActionRow, PageContainer, PageHeader, type ActionItem } from "@/components/portal/ui"
import { ROUTES } from "@/lib/constants"


const MEMBERSHIP = `${ROUTES.PORTAL.PROFILE}/membership`

const OPTIONS: ActionItem[] = [
  { title: "LifeCome membership", description: "Explore membership options", href: `${MEMBERSHIP}/lifecome`, icon: Star, tone: "blue" },
  { title: "Employer access", description: "Activate a benefit from your employer", href: `${MEMBERSHIP}/employer`, icon: Building2, tone: "blue" },
  { title: "Insurance cover", description: "Link a policy and check service cover", href: `${MEMBERSHIP}/insurance`, icon: ShieldCheck, tone: "blue" },
]

export default function MembershipPage() {
  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PageHeader title="Membership & benefits" description="Understand how you can access each service." />
      <ul className="space-y-3">
        {OPTIONS.map((item) => (
          <li key={item.href}>
            <ActionRow item={item} />
          </li>
        ))}
      </ul>
      <Notice icon={Clock}>
        Membership benefits and insurance cover are managed separately. Eligibility is checked for the service you choose.
      </Notice>
    </PageContainer>
  )
}
