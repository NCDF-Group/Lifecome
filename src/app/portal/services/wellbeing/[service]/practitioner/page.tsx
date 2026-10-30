import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WellbeingPractitioner } from "@/components/portal/services/wellbeing/WellbeingPractitioner"
import { isWellbeingService } from "@/lib/wellbeing"

export const metadata: Metadata = { title: "Wellbeing practitioner | LifeCome Health" }

export default async function WellbeingPractitionerPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params
  if (!isWellbeingService(service)) notFound()
  return <WellbeingPractitioner serviceId={service} />
}
