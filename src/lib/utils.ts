import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

export function formatTime(dateString: string): string {
  try {
    const d = new Date(dateString)
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`
}

export function maskNHSNumber(nhsNumber?: string): string {
  if (!nhsNumber || nhsNumber.length < 5) return "••••••••••"
  return `${nhsNumber.slice(0, 3)} ••• ${nhsNumber.slice(-3)}`
}
