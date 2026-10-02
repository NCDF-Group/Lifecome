"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
import { confirmPasswordReset, verifyPasswordResetCode } from "@/lib/api/identity";
import { ApiError } from "@/lib/api/client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * The backend sends the user an email with a link like:
   *   https://app.lifecome.com/reset-password?email=user@example.com&code=ABC123
   *
   * We read `email` and `code` straight from the URL — no separate OTP page needed.
   */
  const email = searchParams.get("email") ?? "";
  const code = searchParams.get("code") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Show a nicer error if the user lands here without a valid link */
  const isValidLink = Boolean(email && code);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidLink) {
      setError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // The backend requires a two-step flow: verify the code then confirm.
      // We call both here so the user only has to click once.
      await verifyPasswordResetCode(email, code);
      await confirmPasswordReset(email, code, password);
      router.push("/auth-success?flow=reset");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 422) {
          setError(
            "This reset link has expired or is invalid. Please request a new one.",
          );
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

  if (!isValidLink) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <svg aria-hidden viewBox="0 0 24 24" className="size-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Invalid reset link</h1>
        <p className="mt-3 text-sm text-ink-muted sm:text-base">
          This link is missing required information, has already been used, or has expired.
        </p>
        <a
          href="/forgot-password"
          className="mt-6 inline-flex items-center gap-2 rounded-control bg-blue px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue/25 transition hover:bg-blue-strong"
        >
          Request a new link
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Create new password</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Your new password must be at least 8 characters.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            {(error.includes("expired") || error.includes("invalid")) && (
              <a href="/forgot-password" className="ml-1 font-semibold underline underline-offset-2">
                Request a new link
              </a>
            )}
          </div>
        )}

        {/* New password */}
        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-semibold text-ink">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            value={password}
            onChange={setPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-ink-muted">Must be at least 8 characters.</p>
        </div>

        {/* Confirm new password */}
        <div>
          <label htmlFor="confirmNewPassword" className="mb-1 block text-sm font-semibold text-ink">
            Confirm new password
          </label>
          <PasswordInput
            id="confirmNewPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <svg aria-hidden className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Resetting password…
            </>
          ) : (
            <>
              Reset password
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-ink-muted">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
