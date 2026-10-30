import type { Metadata } from "next"
import { WaitingRoom } from "@/components/portal/appointments/VideoAppointment"

export const metadata: Metadata = { title: "Your waiting room | LifeCome Health" }

export default async function WaitingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WaitingRoom id={id} />
}
