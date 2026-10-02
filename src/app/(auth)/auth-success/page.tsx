"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");
  const isReset = flow === "reset";

  const targetPath = isReset ? "/sign-in" : "/dashboard";
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(targetPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, targetPath]);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Animated checkmark */}
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
        {/* Background circle */}
        <div className="absolute inset-0 animate-[scale-in_0.4s_ease-smooth_both] rounded-full bg-green/10" />
        <div className="absolute inset-3 animate-[scale-in_0.4s_ease-smooth_0.1s_both] rounded-full bg-green/15" />

        {/* Checkmark */}
        <svg
          viewBox="0 0 52 52"
          className="relative size-16 animate-[scale-in_0.3s_ease-smooth_0.3s_both]"
        >
          <circle cx="26" cy="26" r="25" fill="var(--brand-green)" />
          <path
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[draw-check_0.4s_ease-smooth_0.5s_both]"
            style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
          />
        </svg>

        {/* Celebration dots */}
        <div className="absolute -right-1 top-2 size-3 animate-[scale-in_0.3s_ease-smooth_0.6s_both] rounded-full bg-lime" />
        <div className="absolute -left-2 top-8 size-2 animate-[scale-in_0.3s_ease-smooth_0.7s_both] rounded-full bg-cyan" />
        <div className="absolute -right-3 bottom-6 size-2.5 animate-[scale-in_0.3s_ease-smooth_0.65s_both] rounded-full bg-blue opacity-50" />
        <div className="absolute bottom-0 left-2 size-2 animate-[scale-in_0.3s_ease-smooth_0.75s_both] rounded-full bg-gold opacity-60" />
      </div>

      {isReset ? (
        <>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Password reset!</h1>
          <p className="mt-3 text-sm text-ink-muted sm:text-base">
            Your password has been reset successfully.
            <br />
            You can now sign in with your new password.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            You&apos;re all set!
          </h1>
          <p className="mt-3 text-sm text-ink-muted sm:text-base">
            Your account has been verified successfully.
            <br />
            Welcome to LifeCome Live.
          </p>
        </>
      )}

      <Link
        href={targetPath}
        className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-control bg-blue py-3.5 text-base font-semibold text-white shadow-md shadow-blue/25 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-blue-strong hover:shadow-lg hover:shadow-blue/35 active:translate-y-0 active:scale-[0.97]"
      >
        {isReset ? "Sign in" : "Go to Dashboard"}
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
      </Link>

      <p className="mt-4 text-xs text-ink-muted">
        Redirecting automatically in <span className="font-semibold text-ink">{countdown}s</span>…
      </p>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-ink-muted">Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
