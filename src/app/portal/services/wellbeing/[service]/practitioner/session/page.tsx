import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChooseSession } from "@/components/portal/services/wellbeing/ChooseSession"
import { isWellbeingService } from "@/lib/wellbeing"

export const metadata: Metadata = { title: "Choose wellbeing session | LifeCome Health" }

export default async function ChooseSessionPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params
  if (!isWellbeingService(service)) notFound()
  return <ChooseSession serviceId={service} />
}
