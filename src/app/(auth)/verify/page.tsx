"use client";

import {
  useState,
  useEffect,
  useCallback,
  Suspense,
  type FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OtpInput } from "@/components/auth/otp-input";
import { verifyOtp, requestOtp } from "@/lib/api/identity";
import { ApiError } from "@/lib/api/client";

/** Mask email string: e.g. j***n@example.com */
function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

const RESEND_SECONDS = 60;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userAccountId = searchParams.get("userAccountId") ?? "";
  const email = searchParams.get("email") ?? "";
  const flow = searchParams.get("flow") ?? "sign-up";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  /* Resend countdown timer */
  useEffect(() => {
    if (canResend) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResend = useCallback(async () => {
    if (!userAccountId) return;
    setResending(true);
    setError("");
    try {
      await requestOtp(userAccountId);
      setCountdown(RESEND_SECONDS);
      setCanResend(false);
      setOtp("");
    } catch (err) {
      setError(err instanceof ApiError ? err.userMessage : "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }, [userAccountId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    if (!userAccountId) {
      setError("Session expired. Please start the sign-up process again.");
      return;
    }

    setLoading(true);
    try {
      // Verify OTP code
      await verifyOtp(userAccountId, otp);

      // On successful verification, redirect to Create Password page
      const nextParams = new URLSearchParams({
        userAccountId,
        email,
        flow,
      });
      router.push(`/create-password?${nextParams.toString()}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 422) {
          setError("Incorrect or expired code. Please try again.");
        } else {
          setError(err.userMessage);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedCountdown = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;

  const currentRecipient = email ? maskEmail(email) : "your email address";

  return (
    <>
      {/* Back button */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-sm font-semibold text-link transition hover:bg-surface/50"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-4">
            <path
              d="M13 8H3m4-4-4 4 4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      </div>

      <h1 className="text-2xl font-bold text-ink sm:text-3xl text-center">
        Verify your email
      </h1>
      <p className="mt-2 text-center text-sm text-ink-muted sm:text-base">
        Enter the 6-digit verification code sent to
        <br />
        <span className="font-bold text-ink">{currentRecipient}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <OtpInput value={otp} onChange={setOtp} />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <svg aria-hidden className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Verifying…
            </>
          ) : (
            <>
              Verify email & continue
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>

        {/* Actions */}
        <div className="space-y-2 text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-semibold text-link underline underline-offset-2 disabled:opacity-60"
            >
              {resending ? "Sending…" : "Resend verification code"}
            </button>
          ) : (
            <p className="text-sm text-ink-muted">
              Resend code in {formattedCountdown}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-line pt-4 text-xs text-ink-muted">
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Never share your verification code with anyone.
        </div>
      </form>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-ink-muted">Loading…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
