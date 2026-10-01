"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    router.push(`/verify?email=${encodeURIComponent(email)}&flow=reset`);
  };

  return (
    <>
      {/* Back button */}
      <div className="mb-2">
        <Link
          href="/sign-in"
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
          Back to Sign in
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Forgot password?</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Enter your registered email address to receive a verification code.
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
            className="w-full rounded-control border border-line bg-card px-3 py-3 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
        >
          Send reset code
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
        </button>
      </form>
    </>
  );
}
