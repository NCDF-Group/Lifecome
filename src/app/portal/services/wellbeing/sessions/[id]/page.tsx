import type { Metadata } from "next"
import { SessionDetail } from "@/components/portal/services/wellbeing/SessionDetail"

export const metadata: Metadata = { title: "My wellbeing session | LifeCome Health" }

export default async function WellbeingSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ updated?: string }>
}) {
  const [{ id }, { updated }] = await Promise.all([params, searchParams])
  return <SessionDetail id={id} justRescheduled={updated === "rescheduled"} />
}
