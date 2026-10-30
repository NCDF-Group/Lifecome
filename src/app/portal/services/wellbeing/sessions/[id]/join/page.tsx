import type { Metadata } from "next"
import { VideoSession } from "@/components/portal/services/wellbeing/VideoSession"

export const metadata: Metadata = { title: "Wellbeing video session | LifeCome Health" }

export default async function VideoSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <VideoSession id={id} />
}
