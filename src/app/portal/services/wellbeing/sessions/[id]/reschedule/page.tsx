import type { Metadata } from "next"
import { RescheduleSession } from "@/components/portal/services/wellbeing/RescheduleSession"

export const metadata: Metadata = { title: "Reschedule wellbeing session | LifeCome Health" }

export default async function RescheduleSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RescheduleSession id={id} />
}
