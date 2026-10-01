"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/password-input";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    router.push("/auth-success?flow=sign-in");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        Sign in to your LifeCome account to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Email Address */}
        <div>
          <label htmlFor="signinEmail" className="mb-1.5 block text-sm font-semibold text-ink">
            Email address
          </label>
          <input
            id="signinEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-control border border-line bg-card px-3 py-3 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="signinPassword" className="text-sm font-semibold text-ink">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm font-semibold text-link underline-offset-2 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="signinPassword" value={password} onChange={setPassword} placeholder="Enter your password" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
        >
          Sign in
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

      <p className="mt-6 text-center text-sm text-ink">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-link underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </>
  );
}
