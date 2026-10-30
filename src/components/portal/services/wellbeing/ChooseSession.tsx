"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlarmClock, CalendarDays, ClipboardCheck, Clock, Tag } from "lucide-react"
import { ActionButtonContent, actionButtonClass } from "@/components/portal/appointments/shared"
import { IconBadge, PageContainer, PageHeader, TONES, type Tone } from "@/components/portal/ui"
import { formatDateTile, formatShortDate } from "@/lib/appointments"
import { cn } from "@/lib/utils"
import {
  SAMPLE_PRACTITIONER,
  SAMPLE_SESSION_TIMES,
  WELLBEING_SERVICES,
  dayKeyToIso,
  getSampleSessionDays,
  wellbeingPath,
  type WellbeingServiceId,
} from "@/lib/wellbeing"

const LEGEND = "mb-2.5 text-[17px] sm:text-lg font-bold text-slate-900"
const PICKER_TILE =
  "flex flex-col items-center justify-center rounded-xl transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0062F5] peer-focus-visible:ring-offset-2"

const tileState = (selected: boolean) =>
  selected ? "bg-[#0062F5] text-white shadow-sm shadow-blue-600/20" : "bg-[#EAF2FF] text-slate-900 hover:bg-blue-100"

export function ChooseSession({ serviceId }: { serviceId: WellbeingServiceId }) {
  const router = useRouter()
  const service = WELLBEING_SERVICES[serviceId]
  const [days] = useState(() => getSampleSessionDays())
  const [chosenDay, setChosenDay] = useState(days[0])
  const [chosenTime, setChosenTime] = useState<string | null>(null)

  const summary: { icon: typeof Clock; tone: Tone; className?: string; label: string }[] = [
    { icon: CalendarDays, tone: "green", className: "bg-white", label: formatShortDate(dayKeyToIso(chosenDay)) },
    { icon: Clock, tone: "blue", label: `${chosenTime} UK time` },
    { icon: AlarmClock, tone: "green", label: service.length },
    { icon: Tag, tone: "blue", label: service.sampleFee },
  ]

  const handleReview = () => {
    if (!chosenTime) return
    const query = new URLSearchParams({ date: chosenDay, time: chosenTime })
    router.push(`${wellbeingPath(serviceId, "review")}?${query}`)
  }

  return (
    <PageContainer className="space-y-5 sm:space-y-5">
      <PageHeader title="Choose wellbeing session" description="Book a session with one of our wellbeing coaches." />

      <div className={cn("border rounded-2xl p-3.5 flex items-center gap-3 sm:gap-3.5", TONES.green.card)}>
        <IconBadge icon={service.icon} tone="green" variant="tinted" className="sm:w-[50px] sm:h-[50px]" />
        <div className="min-w-0">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{service.title}</p>
          <p className="text-sm text-slate-500 leading-snug">{SAMPLE_PRACTITIONER.name}</p>
        </div>
      </div>

      <fieldset>
        <legend className={LEGEND}>Select a date</legend>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {days.map((day) => {
            const iso = dayKeyToIso(day)
            const tile = formatDateTile(iso)
            const selected = day === chosenDay
            return (
              <label key={day} className="cursor-pointer">
                <input
                  type="radio"
                  name="session-day"
                  value={day}
                  checked={selected}
                  onChange={() => {
                    setChosenDay(day)
                    setChosenTime(null)
                  }}
                  className="peer sr-only"
                />
                <span className={cn(PICKER_TILE, "py-3 sm:py-4", tileState(selected))}>
                  <span className={cn("text-xs sm:text-sm", selected ? "text-white/90" : "text-slate-600")}>{tile.weekday}</span>
                  <span className="text-xl sm:text-2xl font-bold leading-tight">{tile.day}</span>
                  <span className={cn("text-xs sm:text-[13px]", selected ? "text-white/90" : "text-slate-500")}>
                    {tile.month} {day.slice(0, 4)}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={LEGEND}>Select a time</legend>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {SAMPLE_SESSION_TIMES.map((time) => {
            const selected = time === chosenTime
            return (
              <label key={time} className="cursor-pointer">
                <input
                  type="radio"
                  name="session-time"
                  value={time}
                  checked={selected}
                  onChange={() => setChosenTime(time)}
                  className="peer sr-only"
                />
                <span className={cn(PICKER_TILE, "py-3.5 text-[15px] sm:text-base font-semibold", tileState(selected))}>{time}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {chosenTime && (
        <section aria-live="polite" aria-labelledby="selected-session" className={cn("border rounded-2xl p-4", TONES.green.card)}>
          <h2 id="selected-session" className="text-[15px] sm:text-base font-bold text-slate-900">
            Your selected session
          </h2>
          <ul className="mt-3 space-y-2.5">
            {summary.map(({ icon, tone, className, label }) => (
              <li key={label} className="flex items-center gap-3">
                <IconBadge icon={icon} tone={tone} className={cn("w-8 h-8 rounded-lg", className)} />
                <span className="text-[15px] sm:text-base font-semibold text-slate-900">{label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-3 sm:pt-5">
        <button type="button" onClick={handleReview} disabled={!chosenTime} className={actionButtonClass("primary")}>
          <ActionButtonContent icon={ClipboardCheck} align="group">
            {chosenTime ? "Review session" : "Choose a time to continue"}
          </ActionButtonContent>
        </button>
      </div>
    </PageContainer>
  )
}
