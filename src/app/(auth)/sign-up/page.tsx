"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneInput } from "@/components/auth/phone-input";
import { register, requestOtp } from "@/lib/api/identity";
import { ApiError } from "@/lib/api/client";

export default function SignUpPage() {
  const router = useRouter();

  // Multi-step state (1 or 2)
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields - Stage 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");

  // Form Fields - Stage 2
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+234");
  const [agreed, setAgreed] = useState(false);

  // Status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Advance from Stage 1 to Stage 2 */
  const handleNextStage = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setStep(2);
  };

  /* Final Submit on Stage 2 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setError("Please enter a valid mobile phone number.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Notice.");
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = `${dialCode}${phone.trim()}`;

      // 1. Register → get userAccountId
      const { userAccountId } = await register(email.trim(), fullPhoneNumber);

      // 2. Request OTP for email verification
      await requestOtp(userAccountId);

      // 3. Navigate to OTP verify page
      const params = new URLSearchParams({
        userAccountId,
        email: email.trim(),
        dob,
        fullName: fullName.trim(),
        flow: "sign-up",
      });
      if (referral.trim()) params.set("referral", referral.trim());

      router.push(`/verify?${params.toString()}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("An account with this email already exists. Please sign in.");
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
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">
        Create an account
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
        {step === 1
          ? "Enter your basic contact details to get started."
          : "Provide your date of birth and phone number."}
      </p>

      {error && (
        <div className="mt-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 1 ? (
        /* STAGE 1 FORM */
        <form onSubmit={handleNextStage} className="mt-6 space-y-4">
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
              autoComplete="email"
              className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted"
            />
          </div>

          {/* Referral code (optional) */}
          <div>
            <label htmlFor="referral" className="mb-1 block text-sm font-semibold text-ink">
              Referral code <span className="text-xs font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="referral"
              type="text"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="Enter referral code"
              className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-ink outline-none focus:outline-none focus:ring-0 placeholder:text-ink-muted tracking-wider"
            />
          </div>

          {/* Next Stage Button */}
          <button
            type="submit"
            className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
          >
            Continue
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
      ) : (
        /* STAGE 2 FORM */
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep(1);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1 text-sm font-semibold text-link transition hover:underline disabled:opacity-60 mb-1"
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
            Back to previous step
          </button>

          {/* Date of birth */}
          <div>
            <label htmlFor="dob" className="mb-1 block text-sm font-semibold text-ink">
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={loading}
              className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-ink outline-none focus:outline-none focus:ring-0 disabled:opacity-60"
            />
          </div>

          {/* Phone number */}
          <div>
            <label htmlFor="signupPhone" className="mb-1 block text-sm font-semibold text-ink">
              Phone number
            </label>
            <PhoneInput
              id="signupPhone"
              phone={phone}
              onPhoneChange={setPhone}
              dialCode={dialCode}
              onDialCodeChange={setDialCode}
            />
          </div>

          {/* Terms agreement */}
          <label className="flex cursor-pointer items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
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
            disabled={loading}
            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <svg aria-hidden className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Creating account…
              </>
            ) : (
              "Continue to Verification"
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-link underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </>
  );
}
