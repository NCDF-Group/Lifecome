import type { Metadata } from "next"
import { NewMessageForm } from "@/components/portal/messages/NewMessageForm"
import { getTeam, isTopic } from "@/lib/messaging"

export const metadata: Metadata = { title: "New message | LifeCome Health" }

const APPOINTMENT_TOPICS = new Set(["online_appointment", "clinic_visit", "follow_up"])

// Other pages link here pre-filled, e.g. ?team=gp&topic=online_appointment from an appointment
export default async function NewMessagePage({ searchParams }: { searchParams: Promise<{ team?: string; topic?: string }> }) {
  const { team, topic } = await searchParams
  const initialTopic = isTopic(topic) ? topic : null
  return (
    <NewMessageForm
      initialTeam={getTeam(team)?.id ?? "gp"}
      initialTopic={initialTopic}
      initialSubject={initialTopic && APPOINTMENT_TOPICS.has(initialTopic) ? "A question about my appointment" : ""}
    />
  )
}
