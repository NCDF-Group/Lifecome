"use client"

import React, { useCallback, useId, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CornerDownLeft, Search, X } from "lucide-react"
import { useDismiss } from "@/hooks/useDismiss"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface SearchEntry {
  label: string
  description: string
  href: string
  keywords: string
}

const PROFILE = ROUTES.PORTAL.PROFILE

// The API has no search endpoint yet, so this finds pages and services within the portal
const ENTRIES: SearchEntry[] = [
  { label: "Book an appointment", description: "Online, clinic & menopause care", href: ROUTES.PORTAL.BOOK, keywords: "book appointment doctor gp consultation new visit clinic online video menopause general practitioner" },
  { label: "Care", description: "Professional care & support", href: `${ROUTES.PORTAL.SERVICES}/care`, keywords: "care home carer support assessment elderly" },
  { label: "Wellbeing", description: "Coaching, sessions & shop", href: ROUTES.PORTAL.WELLBEING, keywords: "wellbeing coaching mental health sessions shop" },
  { label: "Lifestyle coaching", description: "Build routines that fit your life", href: `${ROUTES.PORTAL.WELLBEING}/lifestyle-coaching`, keywords: "lifestyle coaching wellbeing routines goals habits" },
  { label: "Healthy eating support", description: "Practical education for everyday choices", href: `${ROUTES.PORTAL.WELLBEING}/healthy-eating`, keywords: "healthy eating food diet nutrition wellbeing" },
  { label: "Insurance", description: "Explore cover & manage policies", href: `${ROUTES.PORTAL.SERVICES}/insurance`, keywords: "insurance cover policy claim" },
  { label: "Stress & relaxation", description: "A supportive space for everyday pressures", href: `${ROUTES.PORTAL.WELLBEING}/stress-relaxation`, keywords: "stress relaxation calm recharge wellbeing" },
  { label: "My wellbeing plan", description: "Set goals and track your progress", href: `${ROUTES.PORTAL.WELLBEING}/plan`, keywords: "wellbeing plan goals habits progress" },
  { label: "Wellbeing check-in", description: "Reflect on your week", href: `${ROUTES.PORTAL.WELLBEING}/plan/check-in`, keywords: "wellbeing check in checkin reflect week routine" },
  { label: "Your visits", description: "Upcoming, past and cancelled", href: ROUTES.PORTAL.APPOINTMENTS, keywords: "appointments visits sessions care upcoming past cancelled reschedule cancel" },
  { label: "Health records", description: "Records and care plans", href: ROUTES.PORTAL.RECORDS, keywords: "records results care plans prescriptions documents" },
  { label: "Messages", description: "Talk to your care teams", href: ROUTES.PORTAL.MESSAGES, keywords: "messages inbox chat care team" },
  { label: "New message", description: "Contact a care team", href: ROUTES.PORTAL.NEW_MESSAGE, keywords: "new message contact ask question help support" },
  { label: "My Profile", description: "Your details and preferences", href: PROFILE, keywords: "profile account settings photo" },
  { label: "Personal details", description: "Contact information and address", href: `${PROFILE}/personal-details`, keywords: "personal details name address date of birth phone" },
  { label: "Health profile", description: "Blood group and genotype", href: `${PROFILE}/health`, keywords: "health profile blood group genotype" },
  { label: "Privacy & permissions", description: "Control sharing and preferences", href: `${PROFILE}/privacy`, keywords: "privacy permissions consent sharing data" },
  { label: "Membership & benefits", description: "Membership, employer access and cover", href: `${PROFILE}/membership`, keywords: "membership benefits plan" },
  { label: "Employer access", description: "Activate a benefit from your employer", href: `${PROFILE}/membership/employer`, keywords: "employer work access code sponsor benefit" },
  { label: "Need urgent help?", description: "Emergency guidance", href: ROUTES.PORTAL.URGENT_HELP, keywords: "urgent emergency help 999 112 ambulance" },
]

const MAX_RESULTS = 6

function findEntries(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return ENTRIES.filter((entry) => {
    const haystack = `${entry.label} ${entry.description} ${entry.keywords}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  }).slice(0, MAX_RESULTS)
}

export function PortalSearch({ className, autoFocus = false, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  const results = useMemo(() => findEntries(query), [query])
  const showResults = isOpen && query.trim().length > 0
  const optionId = (index: number) => `${listId}-option-${index}`

  const finish = () => {
    setQuery("")
    setIsOpen(false)
    onNavigate?.()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (query) setQuery("")
      else event.currentTarget.blur()
      setIsOpen(false)
      return
    }
    if (!results.length) return
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setIsOpen(true)
      const step = event.key === "ArrowDown" ? 1 : -1
      setActiveIndex((index) => (index + step + results.length) % results.length)
    } else if (event.key === "Enter" && showResults) {
      event.preventDefault()
      const entry = results[Math.min(activeIndex, results.length - 1)]
      router.push(entry.href)
      finish()
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-label="Search services and pages"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showResults && results.length ? optionId(activeIndex) : undefined}
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for services or health topics…"
          className="w-full h-11 rounded-xl border border-slate-200/80 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0062F5] focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute inset-x-0 z-50 mt-2 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg shadow-slate-900/10">
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((entry, index) => (
                <li key={entry.href} id={optionId(index)} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={entry.href}
                    tabIndex={-1}
                    onClick={finish}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", index === activeIndex ? "bg-blue-50" : "hover:bg-slate-50")}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 truncate">{entry.label}</span>
                      <span className="block text-xs text-slate-500 truncate">{entry.description}</span>
                    </span>
                    {index === activeIndex && <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden />}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} role="status" className="px-3 py-3 text-sm text-slate-500">
              No matches for &ldquo;{query.trim()}&rdquo;. Try &ldquo;appointment&rdquo; or &ldquo;messages&rdquo;.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
