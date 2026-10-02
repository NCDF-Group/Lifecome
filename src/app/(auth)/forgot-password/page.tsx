"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/identity";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      // Reveal nothing if the account doesn't exist (security best practice)
      if (err instanceof ApiError && err.status !== 404) {
        setError(err.userMessage);
      } else {
        // Silently succeed even for unknown emails to prevent account enumeration
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        {/* Back button */}
        <div className="mb-2">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-sm font-semibold text-link transition hover:bg-surface/50"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-4">
              <path d="M13 8H3m4-4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Sign in
          </Link>
        </div>

        <div className="mt-2 flex flex-col items-center text-center">
          {/* Envelope icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue/10">
            <svg aria-hidden viewBox="0 0 24 24" className="size-10 text-blue" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Check your email</h1>
          <p className="mt-3 text-sm text-ink-muted sm:text-base">
            If <span className="font-semibold text-ink">{email}</span> is registered,
            we&apos;ve sent a password reset link.
            <br />
            Click the link in the email to create a new password.
          </p>
          <p className="mt-4 text-xs text-ink-muted">
            Didn&apos;t receive it? Check your spam folder, or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-semibold text-link underline underline-offset-2"
            >
              try again
            </button>
            .
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-2">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-sm font-semibold text-link transition hover:bg-surface/50"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-4">
            <path d="M13 8H3m4-4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Sign in
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Forgot password?</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Enter your registered email and we&apos;ll send a reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label htmlFor="resetEmail" className="mb-1.5 block text-sm font-semibold text-ink">
            Email address
          </label>
          <input
            id="resetEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email address"
            autoComplete="email"
            disabled={loading}
            className="w-full rounded-control border border-line bg-card px-3 py-3 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted disabled:opacity-60"
          />
        </div>

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
              Sending…
            </>
          ) : (
            <>
              Send reset link
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </form>
    </>
  );
}
