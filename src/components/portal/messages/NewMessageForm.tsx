"use client"

import React, { useId, useState } from "react"
import { useRouter } from "next/navigation"
import { Info, Send } from "lucide-react"
import { getApiErrorMessage } from "@/lib/api-client"
import { ROUTES } from "@/lib/constants"
import { MESSAGE_MAX_LENGTH, TEAMS, type TeamId } from "@/lib/messaging"
import { cn } from "@/lib/utils"
import { messagingService } from "@/services/messaging.service"
import type { MessageTopic } from "@/types"
import { ErrorState, PageContainer, PageHeader } from "../ui"
import { actionButtonClass } from "../appointments/shared"
import { Notice } from "./shared"

const SUBJECT_MAX_LENGTH = 120
// The API has no subject field, so the subject leads the message body
const BODY_MAX_LENGTH = MESSAGE_MAX_LENGTH - SUBJECT_MAX_LENGTH - 2

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"

export function NewMessageForm({
  initialTeam,
  initialTopic,
  initialSubject,
}: {
  initialTeam: TeamId
  initialTopic: MessageTopic | null
  initialSubject: string
}) {
  const router = useRouter()
  const [teamId, setTeamId] = useState<TeamId>(initialTeam)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState("")
  const [showBodyError, setShowBodyError] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const bodyId = useId()
  const bodyErrorId = useId()
  const counterId = useId()

  const team = TEAMS.find((option) => option.id === teamId) ?? TEAMS[0]
  const isBodyMissing = !body.trim()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isBodyMissing) {
      setShowBodyError(true)
      document.getElementById(bodyId)?.focus()
      return
    }
    setSendError(null)
    setIsSending(true)
    try {
      const trimmedSubject = subject.trim()
      const threadId = await messagingService.createThread({
        serviceCategory: team.serviceCategory,
        // A topic passed in (e.g. from an appointment) only applies to the team it came with
        topic: teamId === initialTeam && initialTopic ? initialTopic : team.defaultTopic,
        body: trimmedSubject ? `${trimmedSubject}\n\n${body.trim()}` : body.trim(),
      })
      router.push(threadId ? `${ROUTES.PORTAL.MESSAGES}/${encodeURIComponent(threadId)}` : ROUTES.PORTAL.MESSAGES)
    } catch (cause) {
      setSendError(getApiErrorMessage(cause, "We couldn't send your message. Please try again."))
      setIsSending(false)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader title="New message" description="Choose the team that can help." />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-[15px] sm:text-base font-semibold text-slate-900">Send to</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TEAMS.map((option, index) => {
              const Icon = option.icon
              const selected = option.id === teamId
              const green = index % 2 === 0
              return (
                <label
                  key={option.id}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl border-2 px-3 py-3 cursor-pointer transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0062F5] has-[:focus-visible]:ring-offset-2",
                    green ? "bg-[#F1F9F4]" : "bg-[#F0F6FF]",
                    selected ? "border-emerald-500" : "border-transparent hover:border-slate-200"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      green ? "bg-emerald-100/80 text-emerald-600" : "bg-blue-100/80 text-[#0062F5]"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-semibold text-slate-900">{option.name}</span>
                    <span className="block text-xs text-slate-500 truncate">{option.description}</span>
                  </span>
                  <input
                    type="radio"
                    name="team"
                    value={option.id}
                    checked={selected}
                    onChange={() => setTeamId(option.id)}
                    className="w-[18px] h-[18px] accent-[#0062F5] cursor-pointer shrink-0"
                  />
                </label>
              )
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="message-subject" className="block mb-2 text-[15px] sm:text-base font-semibold text-slate-900">
            Subject <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="message-subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={SUBJECT_MAX_LENGTH}
            placeholder="e.g. A question about my appointment"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor={bodyId} className="block mb-2 text-[15px] sm:text-base font-semibold text-slate-900">
            Message
          </label>
          {showBodyError && isBodyMissing && (
            <p id={bodyErrorId} className="mb-2 text-sm font-medium text-red-600">
              Enter your message
            </p>
          )}
          <textarea
            id={bodyId}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            maxLength={BODY_MAX_LENGTH}
            required
            aria-invalid={showBodyError && isBodyMissing}
            aria-describedby={cn(counterId, showBodyError && isBodyMissing && bodyErrorId)}
            placeholder={`What would you like to ask the ${team.name.toLowerCase()}?`}
            className={cn(FIELD_CLASS, "resize-y min-h-[120px]", showBodyError && isBodyMissing && "border-red-400 focus:border-red-500 focus:ring-red-100")}
          />
          <p id={counterId} className="mt-1.5 text-right text-xs text-slate-400">
            {body.length.toLocaleString("en-GB")} / {BODY_MAX_LENGTH.toLocaleString("en-GB")}
          </p>
        </div>

        <Notice icon={Info} tone="green" title="Not monitored for emergencies.">
          If you need urgent medical help, please use emergency services.
        </Notice>

        {sendError && <ErrorState message={sendError} />}

        <button type="submit" disabled={isSending} className={actionButtonClass("primary", "justify-center")}>
          <Send className="w-[18px] h-[18px]" aria-hidden />
          <span>{isSending ? "Sending…" : "Send message"}</span>
        </button>
      </form>
    </PageContainer>
  )
}
