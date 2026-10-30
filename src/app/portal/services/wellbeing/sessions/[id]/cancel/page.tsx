import type { Metadata } from "next"
import { CancelSession } from "@/components/portal/services/wellbeing/CancelSession"

export const metadata: Metadata = { title: "Cancel wellbeing session | LifeCome Health" }

export default async function CancelSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CancelSession id={id} />
}
