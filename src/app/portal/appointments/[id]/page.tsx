import type { Metadata } from "next"
import { AppointmentDetail } from "@/components/portal/appointments/AppointmentDetail"

export const metadata: Metadata = { title: "Your appointment | LifeCome Health" }

export default async function AppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ updated?: string }>
}) {
  const [{ id }, { updated }] = await Promise.all([params, searchParams])
  return <AppointmentDetail id={id} justRescheduled={updated === "rescheduled"} />
}
