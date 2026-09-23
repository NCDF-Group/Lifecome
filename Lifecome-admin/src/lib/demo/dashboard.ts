/**
 * Illustrative demo data for the Dashboard page — the same "fake
 * repository" idea Lifecome-mobile uses, kept here rather than wired to
 * `apiFetch` because the backend has no aggregate operations-console
 * endpoint yet (each number below would come from a different module).
 * Replace with real `useQuery` calls once that endpoint (or a
 * client-side Promise.all across modules) exists.
 */

import {
  CalendarDays,
  ClipboardCheck,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
};

export const dashboardStats: DashboardStat[] = [
  { label: "Bookings today", value: "42", delta: "+8% vs yesterday", trend: "up", icon: CalendarDays },
  { label: "Active consultations", value: "6", delta: "steady", trend: "flat", icon: Video },
  { label: "Revenue this month", value: "₦4.82M", delta: "+12% vs last month", trend: "up", icon: Wallet },
  { label: "Pending authorisations", value: "11", delta: "-3 since yesterday", trend: "down", icon: ClipboardCheck },
];

export type BookingsByDay = { day: string; bookings: number };

export const bookingsLast7Days: BookingsByDay[] = [
  { day: "Mon", bookings: 31 },
  { day: "Tue", bookings: 38 },
  { day: "Wed", bookings: 29 },
  { day: "Thu", bookings: 44 },
  { day: "Fri", bookings: 52 },
  { day: "Sat", bookings: 24 },
  { day: "Sun", bookings: 18 },
];

export type PayerMix = { payer: string; share: number };

export const payerMix: PayerMix[] = [
  { payer: "Reliance HMO", share: 34 },
  { payer: "AVON HMO", share: 21 },
  { payer: "Hygeia HMO", share: 17 },
  { payer: "AXA Mansard Health", share: 12 },
  { payer: "One-time payment", share: 16 },
];

export type AuditAlert = {
  id: string;
  message: string;
  severity: "info" | "warning" | "critical";
  occurredAt: string;
};

export const recentAuditAlerts: AuditAlert[] = [
  {
    id: "audit-1",
    message: "3 failed sign-in attempts for a provider account",
    severity: "warning",
    occurredAt: "12 minutes ago",
  },
  {
    id: "audit-2",
    message: "Record access grant revoked by patient — Ada Okonkwo",
    severity: "info",
    occurredAt: "1 hour ago",
  },
  {
    id: "audit-3",
    message: "Payer authorisation expired without a claim — Reliance HMO",
    severity: "critical",
    occurredAt: "3 hours ago",
  },
];
