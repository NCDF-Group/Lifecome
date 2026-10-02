"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
import { setPassword } from "@/lib/api/identity";
import { ApiError } from "@/lib/api/client";

function CreatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userAccountId = searchParams.get("userAccountId") ?? "";
  const flow = searchParams.get("flow") ?? "sign-up";

  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userAccountId) {
      setError("Session invalid or expired. Please start registration again.");
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
      await setPassword(userAccountId, password);
      router.push(`/auth-success?flow=${flow}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Create your password</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Your email is verified! Now create a secure password to protect your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* New Password */}
        <div>
          <label htmlFor="createPassword" className="mb-1 block text-sm font-semibold text-ink">
            Password
          </label>
          <PasswordInput
            id="createPassword"
            value={password}
            onChange={setPasswordState}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-ink-muted">Must be at least 8 characters.</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmCreatePassword" className="mb-1 block text-sm font-semibold text-ink">
            Confirm password
          </label>
          <PasswordInput
            id="confirmCreatePassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your password"
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
              Setting password…
            </>
          ) : (
            <>
              Complete registration
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1"
              >
                <path
                  d="M3 8h10m-4-4 4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-ink-muted">Loading…</div>}>
      <CreatePasswordContent />
    </Suspense>
  );
}
