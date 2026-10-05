"use client";

import React from "react";

export type StatusType =
  | "Covered"
  | "Requires Authorisation"
  | "Not Covered"
  | "Pending"
  | "Approved"
  | "Paid"
  | "Available"
  | "Reviewed"
  | "Booked"
  | "covered"
  | "authorisation"
  | "approved"
  | "neutral";

export interface StatusChipProps {
  status?: StatusType | string;
  tone?: "covered" | "authorisation" | "approved" | "neutral" | string;
  className?: string;
  children?: React.ReactNode;
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Covered: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-[#45AF03] font-semibold",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-[#45AF03]",
  },
  covered: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-[#45AF03] font-semibold",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-[#45AF03]",
  },
  "Requires Authorisation": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-[#B58A35] font-semibold",
    border: "border-amber-300 dark:border-amber-800",
    dot: "bg-[#B58A35]",
  },
  authorisation: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-[#B58A35] font-semibold",
    border: "border-amber-300 dark:border-amber-800",
    dot: "bg-[#B58A35]",
  },
  "Not Covered": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400 font-semibold",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  Pending: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-400 font-semibold",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  neutral: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300 font-semibold",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  Approved: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-[#0667B8] font-semibold",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-[#0667B8]",
  },
  approved: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-[#0667B8] font-semibold",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-[#0667B8]",
  },
  Paid: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-400 font-semibold",
    border: "border-teal-200 dark:border-teal-800",
    dot: "bg-teal-500",
  },
  Available: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-800 dark:text-cyan-300 font-semibold",
    border: "border-cyan-200 dark:border-cyan-800",
    dot: "bg-[#3DE5F8]",
  },
  Reviewed: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300 font-semibold",
    border: "border-indigo-200 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  Booked: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300 font-semibold",
    border: "border-sky-200 dark:border-sky-800",
    dot: "bg-sky-500",
  },
};

const defaultStyle = {
  bg: "bg-slate-50 dark:bg-slate-800",
  text: "text-slate-700 dark:text-slate-300 font-medium",
  border: "border-slate-200 dark:border-slate-700",
  dot: "bg-slate-400",
};

export function StatusChip({ status, tone, className = "", children }: StatusChipProps) {
  const activeKey = status || tone || (typeof children === "string" ? children : "neutral");
  const style = statusStyles[activeKey] || defaultStyle;
  const label = children || status || tone || "Status";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs border ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default StatusChip;
