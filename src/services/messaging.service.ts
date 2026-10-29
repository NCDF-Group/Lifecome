import { apiClient } from "@/lib/api-client"
import { threadIdFrom, toMessage, toThread } from "@/lib/messaging"
import { unwrapList } from "@/lib/utils"
import type { MessageServiceCategory, MessageThread, MessageTopic, ThreadMessage } from "@/types"

export interface CreateThreadInput {
  topic: MessageTopic
  serviceCategory: MessageServiceCategory
  body: string
}

export const messagingService = {
  async getThreads(): Promise<MessageThread[]> {
    const { data } = await apiClient.get<unknown>("/message-threads")
    return unwrapList(data, ["threads"])
      .map(toThread)
      .filter((thread): thread is MessageThread => thread !== null)
  },

  async getMessages(threadId: string, viewerId?: string): Promise<ThreadMessage[]> {
    const { data } = await apiClient.get<unknown>(`/message-threads/${encodeURIComponent(threadId)}/messages`)
    return unwrapList(data, ["messages"])
      .map((raw) => toMessage(raw, viewerId))
      .filter((message): message is ThreadMessage => message !== null)
      .sort((a, b) => (a.createdAt && b.createdAt ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : 0))
  },

  /** Starts a thread with its first message; resolves to the new thread's id when the API returns one. */
  async createThread(input: CreateThreadInput): Promise<string | null> {
    const { data } = await apiClient.post<unknown>("/message-threads", input)
    return threadIdFrom(data)
  },

  async sendMessage(threadId: string, body: string): Promise<void> {
    await apiClient.post(`/message-threads/${encodeURIComponent(threadId)}/messages`, { body })
  },
}
