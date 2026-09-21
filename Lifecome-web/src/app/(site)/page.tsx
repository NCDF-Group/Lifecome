import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { StatusChip } from "@/components/ui/status-chip";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "LifeCome Live – Online healthcare and coordinated care" },
  description: siteDescription,
  alternates: { canonical: "/" },
};

const steps = [
  { title: "Access", body: "Sign up once. Use your HMO where it is accepted, or pay directly." },
  { title: "Consult", body: "See a doctor by video or audio at a time that suits you." },
  { title: "Care plan", body: "Leave with a written summary, next steps and any prescriptions or referrals." },
  { title: "Follow-up", body: "Message your care team and book follow-up care without starting over." },
] as const;

const services = [
  { title: "Online GP consultations", body: "New or general health concerns.", href: "/services/online-gp-consultations" },
  { title: "Follow-up care", body: "Continue care after your first visit.", href: "/services/follow-up-care" },
  { title: "Results review", body: "A clinician reviews and explains your results.", href: "/services/results-review" },
  { title: "Referrals", body: "Onward care through the provider network.", href: "/services/referrals-coordinated-care" },
  { title: "Tests & diagnostics", body: "Laboratory and diagnostic coordination.", href: "/services/laboratory-tests-diagnostics" },
  { title: "Prescriptions", body: "Prescribing and pharmacy coordination.", href: "/services/prescriptions-medicines" },
] as const;

const access = [
  {
    title: "Use your HMO",
    body: "Choose your HMO, verify your membership and see what your plan covers before you book.",
    href: "/access/use-your-hmo",
    cta: "How HMO access works",
  },
  {
    title: "Pay directly",
    body: "See the price up front, pay securely and receive a receipt for every consultation.",
    href: "/access/pay-directly",
    cta: "See pricing",
  },
  {
    title: "Through your organisation",
    body: "Employer and sponsored access for teams and organisations.",
    href: "/partners/organisations",
    cta: "For organisations",
  },
] as const;

const trust = [
  { title: "Your records stay yours", body: "You choose who can see your health record, and every access is logged.", href: "/health-records/who-can-access" },
  { title: "Built for privacy and security", body: "Encryption, least-privilege access and privacy by design.", href: "/about/security-and-privacy" },
  { title: "Clinical governance", body: "Clear standards for quality, safeguarding and escalation.", href: "/about/clinical-governance" },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 size-[28rem] rounded-full bg-cyan/25 blur-3xl" />
          <div className="absolute -left-32 top-40 size-[24rem] rounded-full bg-lime/20 blur-3xl" />
        </div>
        <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold text-ink-muted">
              <span aria-hidden className="size-2 rounded-full bg-green" />
              Online healthcare, coordinated
            </p>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Care that starts online and <span className="text-blue">stays with you.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
              See a doctor by video or audio, leave with a clear care plan, and keep your health records in one place. Use your HMO or
              pay directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/book" size="lg">
                Get care
              </ButtonLink>
              <ButtonLink href="/access/check-your-cover" variant="secondary" size="lg">
                Check your HMO cover
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-muted">
              {["Use your HMO or pay directly", "Video or audio consultations", "A care plan after every visit"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-green-strong">
                    <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Illustrative product preview (decorative) */}
          <div aria-hidden className="relative mx-auto w-full max-w-md">
            <div className="rounded-[1.75rem] border border-line bg-white p-5 shadow-2xl shadow-blue/10">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Your next visit</p>
              <p className="mt-2 text-xl font-bold">Online GP consultation</p>
              <p className="text-sm text-ink-muted">Video or audio · 30 minutes</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusChip tone="covered">Covered</StatusChip>
                <StatusChip tone="approved">Approved</StatusChip>
              </div>
              <div className="mt-5 grid gap-3 border-t border-line pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Payment</span>
                  <span className="font-semibold">Through your HMO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">You pay</span>
                  <span className="font-semibold">Shown before you confirm</span>
                </div>
              </div>
              <div className="mt-5 rounded-control bg-blue py-3 text-center text-sm font-semibold text-white">Join waiting room</div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-card border border-line bg-white p-4 shadow-xl shadow-ink/10 sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Care plan</p>
              <p className="mt-1 text-sm font-semibold">Follow-up in 2 weeks</p>
              <div className="mt-2 h-1.5 w-32 rounded-full bg-line">
                <div className="h-full w-2/3 rounded-full bg-green" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How LifeCome Live works</h2>
              <p className="mt-3 text-lg text-ink-muted">One simple path from your first question to ongoing care.</p>
            </div>
            <ButtonLink href="/how-it-works" variant="ghost">
              Learn more →
            </ButtonLink>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-card border border-line bg-white p-6">
                <span className="grid size-9 place-items-center rounded-full bg-lime text-sm font-extrabold text-ink">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Healthcare services online</h2>
            <p className="mt-3 text-lg text-ink-muted">From a first consultation to results, referrals and medicines.</p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue hover:shadow-lg hover:shadow-blue/10"
                >
                  <h3 className="text-lg font-bold group-hover:text-blue">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{s.body}</p>
                  <span className="mt-4 text-sm font-semibold text-blue">Learn more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ways to access */}
      <section className="bg-ink py-16 text-white sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Choose how you pay</h2>
            <p className="mt-3 text-lg text-white/75">
              Your payment route changes how your visit is funded. Your care and your records stay the same.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {access.map((a) => (
              <li key={a.href} className="flex flex-col rounded-card border border-white/15 bg-white/5 p-6">
                <h3 className="text-xl font-bold">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/75">{a.body}</p>
                <Link href={a.href} className="mt-5 text-sm font-semibold text-lime underline-offset-4 hover:underline">
                  {a.cta} →
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Trust */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Care you can trust</h2>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {trust.map((t) => (
              <li key={t.href} className="rounded-card border border-line p-6">
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t.body}</p>
                <Link href={t.href} className="mt-4 inline-block text-sm font-semibold text-blue hover:underline">
                  Read more →
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-blue px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-cyan/30 blur-2xl" />
            <div aria-hidden className="absolute -bottom-20 -left-10 size-64 rounded-full bg-lime/25 blur-2xl" />
            <div className="relative">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to see a doctor?</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">Book an online consultation in a few minutes.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/book" variant="accent" size="lg">
                  Get care
                </ButtonLink>
                <ButtonLink href="/help" variant="secondary" size="lg">
                  Visit the help centre
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
