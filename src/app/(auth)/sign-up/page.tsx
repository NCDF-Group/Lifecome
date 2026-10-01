"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneInput } from "@/components/auth/phone-input";
import { PasswordInput } from "@/components/auth/password-input";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+234");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
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
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Notice.");
      return;
    }

    const fullPhone = dialCode + phone;
    router.push(
      `/verify?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(fullPhone)}&flow=sign-up`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">
        Create an account
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        One account for HMO access and healthcare services.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Full name */}
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-ink">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Okponko"
            className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
          />
        </div>

        {/* Mobile number (Geo location) */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Mobile number</label>
          <PhoneInput
            phone={phone}
            onPhoneChange={setPhone}
            dialCode={dialCode}
            onDialCodeChange={setDialCode}
            autoDetectLocation
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-ink">
            Email address <span className="text-xs font-normal text-ink-muted">(for verification)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-ink">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-ink-muted">Must be at least 8 characters.</p>
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-semibold text-ink">
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </div>

        {/* Terms agreement */}
        <label className="flex cursor-pointer items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded accent-blue outline-none focus:outline-none focus:ring-0"
          />
          <span className="text-xs text-ink sm:text-sm">
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-link underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-link underline underline-offset-2">
              Privacy Notice
            </Link>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
        >
          Create account
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-ink">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-link underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </>
  );
}
