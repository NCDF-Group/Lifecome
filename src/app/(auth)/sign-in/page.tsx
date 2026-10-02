"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/password-input";
import { login } from "@/lib/api/identity";
import { saveToken } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";

const REMEMBERED_EMAIL_KEY = "lc_remembered_email";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load remembered email on mount if previously saved
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
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

    setLoading(true);
    try {
      const { accessToken } = await login(email.trim(), password);

      // Handle Remember Me persistence
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {
        // Ignore storage errors
      }

      saveToken(accessToken, rememberMe);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Incorrect email or password. Please try again.");
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
            autoComplete="email"
            disabled={loading}
            className="w-full rounded-control border border-line bg-card px-3 py-3 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="signinPassword" className="text-sm font-semibold text-ink">
              Password
            </label>
          </div>
          <PasswordInput
            id="signinPassword"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
          />
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="size-4 rounded accent-blue outline-none focus:outline-none focus:ring-0"
            />
            <span className="text-sm text-ink font-medium">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-link underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
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
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
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
