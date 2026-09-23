import Image from "next/image";

/**
 * Staff sign-in. The form itself is not wired to anything yet — see
 * README.md "Known gap: admin auth": Lifecome-backend's identity module
 * is patient-only today, so this needs a staff/role concept added there
 * first before submitting it does anything real.
 */
export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Image
            src="/brand/lifecome-live-mark.svg"
            alt="LifeCome Live"
            width={40}
            height={40}
          />
          <h1 className="mt-6 text-2xl font-bold text-ink">
            Operations console
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Sign in with your LifeCome Live staff account.
          </p>

          <form className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@lifecomelive.com"
                disabled
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <button
              type="button"
              disabled
              title="Not wired up yet — see README.md, Known gap: admin auth"
              className="mt-2 rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-white opacity-60 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-xs text-ink-muted">
            Sign-in is disabled until admin auth exists on the backend — see
            this app&apos;s README.
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/images/team-doctors.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-strong/70 via-blue-strong/10 to-transparent" />
        <p className="absolute bottom-10 left-10 right-10 text-lg font-semibold text-white">
          Care that fits your life — the console behind it.
        </p>
      </div>
    </div>
  );
}
