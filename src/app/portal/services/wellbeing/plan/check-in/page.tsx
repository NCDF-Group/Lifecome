"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Info, Save } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { Notice } from "@/components/portal/messages/shared"
import { PageContainer, PageHeader, TONES, type Tone } from "@/components/portal/ui"
import { saveSampleCheckIn } from "@/hooks/useWellbeingSession"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { WELLBEING_PLAN_PATH } from "@/lib/wellbeing"

const RATINGS = [1, 2, 3, 4, 5]
const LOWEST_LABEL = "Needs support"
const HIGHEST_LABEL = "Going well"
const HEADING = "text-[17px] sm:text-lg font-bold text-slate-900"

const QUESTIONS: { id: string; label: string; placeholder: string; tone: Tone }[] = [
  { id: "went-well", label: "What went well?", placeholder: "Share what went well this week...", tone: "blue" },
  { id: "help-with", label: "What would you like help with?", placeholder: "Tell us what you would like support with...", tone: "green" },
]

export default function WellbeingCheckInPage() {
  const router = useRouter()
  const [rating, setRating] = useState<number | null>(null)

  const handleSave = () => {
    saveSampleCheckIn()
    router.push(WELLBEING_PLAN_PATH)
  }

  return (
    <PageContainer className="space-y-3.5 sm:space-y-3.5">
      <PageHeader title="Wellbeing check-in" description="Reflect on your week." />

      <Notice icon={Info} title="Sample check-in">
        Your answers won&apos;t be saved or read by anyone yet. If you need help now,{" "}
        <Link href={ROUTES.PORTAL.URGENT_HELP} className="font-semibold text-[#0062F5] underline underline-offset-2">
          view urgent help
        </Link>
        .
      </Notice>

      <fieldset className={cn("border rounded-2xl p-4", TONES.green.card)}>
        <legend className={cn(HEADING, "float-left w-full")}>How is your routine going?</legend>
        <div className="clear-both pt-3 flex justify-between">
          {RATINGS.map((value) => {
            const selected = value === rating
            return (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="check-in-rating"
                  value={value}
                  checked={selected}
                  onChange={() => setRating(value)}
                  aria-label={value === 1 ? `1, ${LOWEST_LABEL}` : value === RATINGS.length ? `${value}, ${HIGHEST_LABEL}` : String(value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2",
                    selected ? "bg-[#0062F5] text-white ring-4 ring-blue-200" : "bg-blue-100/70 text-slate-900 hover:bg-blue-100"
                  )}
                >
                  {value}
                </span>
              </label>
            )
          })}
        </div>
        <div aria-hidden className="mt-2 flex justify-between text-sm text-slate-500">
          <span>{LOWEST_LABEL}</span>
          <span>{HIGHEST_LABEL}</span>
        </div>
      </fieldset>

      {QUESTIONS.map(({ id, label, placeholder, tone }) => (
        <div key={id} className={cn("border rounded-2xl p-4", TONES[tone].card)}>
          <label htmlFor={id} className={HEADING}>
            {label}
          </label>
          <textarea
            id={id}
            rows={4}
            maxLength={1000}
            placeholder={placeholder}
            className="mt-2 block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] leading-snug text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      ))}

      <div className="space-y-2.5 pt-1.5">
        <button type="button" onClick={handleSave} disabled={rating === null} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={Save} align="start">
            {rating === null ? "Choose a rating to continue" : "Save check-in"}
          </ActionButtonContent>
        </button>
        <Link href={WELLBEING_PLAN_PATH} className={actionButtonClass("soft", "[&>svg:first-child]:text-[#0062F5] [&>svg:last-child]:text-[#0062F5]")}>
          <ActionButtonContent icon={FileText} align="start">
            View my plan
          </ActionButtonContent>
        </Link>
      </div>
    </PageContainer>
  )
}
