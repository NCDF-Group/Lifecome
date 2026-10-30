import type { Metadata } from "next"
import { Consultation } from "@/components/portal/appointments/VideoAppointment"

export const metadata: Metadata = { title: "GP consultation | LifeCome Health" }

export default async function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <Consultation id={id} />
}
