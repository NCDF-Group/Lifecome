"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    router.push("/auth-success?flow=reset");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Create new password</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Your new password must be at least 8 characters.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
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
          className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
        >
          Reset password
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
