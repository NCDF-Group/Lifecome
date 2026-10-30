"use client"

import React from "react"
import { ChevronDown } from "lucide-react"
import { BackLink } from "@/components/portal/PortalShell"
import { PageContainer, PageHeader } from "@/components/portal/ui"
import { cn } from "@/lib/utils"

export const TOTAL_STEPS = 6

export const FIELD =
  "block w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:text-[15px] text-slate-900 focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100"
export const FIELD_LABEL = "block mb-2 text-[15px] sm:text-base font-semibold text-slate-900"

/** Selected look shared by the option cards and the date and time tiles. */
export const optionState = (selected: boolean) =>
  selected ? "bg-[#F0F6FF] border-[#0062F5] text-[#0062F5]" : "bg-white border-slate-200 text-slate-900 hover:border-blue-200"

export function StepLayout({
  step,
  backHref,
  onBack,
  title,
  description,
  children,
}: {
  /** Left out on the final payment screen, which sits after the numbered steps. */
  step?: number
  backHref: string
  /** Steps back within the booking; the first step leaves it through `backHref`. */
  onBack?: () => void
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <PageContainer wide className="space-y-5 sm:space-y-5">
      <div>
        <BackLink href={backHref} onNavigate={onBack} />
        {step !== undefined && (
          <>
            <div aria-hidden className="flex gap-1">
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <span key={index} className={cn("h-1 flex-1 rounded-full", index < step ? "bg-[#0062F5]" : "bg-slate-100")} />
              ))}
            </div>
            <p className="mt-2 text-sm uppercase text-slate-500">
              Step {step} of {TOTAL_STEPS}
            </p>
          </>
        )}
        <div className={cn(step !== undefined && "mt-3")}>
          <PageHeader title={title} description={description} />
        </div>
      </div>
      {children}
    </PageContainer>
  )
}

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={cn(FIELD, "min-h-[52px] appearance-none pr-11 cursor-pointer")}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" aria-hidden />
      </div>
    </div>
  )
}

export function RadioCard({
  name,
  title,
  description,
  checked,
  onChange,
}: {
  name: string
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className={cn("flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition-colors", optionState(checked))}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="w-5 h-5 shrink-0 accent-[#0062F5] cursor-pointer" />
      <span className="min-w-0">
        <span className="block text-base sm:text-[17px] font-semibold text-slate-900 leading-snug">{title}</span>
        <span className="block text-sm sm:text-[15px] text-slate-500 leading-snug mt-1">{description}</span>
      </span>
    </label>
  )
}

export function CheckboxField({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer text-sm sm:text-[15px] text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="w-5 h-5 mt-0.5 shrink-0 rounded accent-[#0062F5] cursor-pointer"
      />
      <span>{children}</span>
    </label>
  )
}
