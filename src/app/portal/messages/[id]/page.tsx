import type { Metadata } from "next"
import { MessageThreadView } from "@/components/portal/messages/MessageThreadView"

export const metadata: Metadata = { title: "Messages | LifeCome Health" }

export default async function MessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MessageThreadView id={id} />
}
