import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { ForRegion } from "@/components/ui/for-region";
import { AppStoreBadge, GooglePlayBadge } from "@/components/ui/store-badges";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/status-chip";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "LifeCome Live – Online healthcare and coordinated care" },
  description: siteDescription,
  alternates: { canonical: "/" },
};

/** Stagger index for scroll-reveal (see .reveal in globals.css). */
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

const payment = [
  {
    title: "Use your HMO",
    body: "Choose your HMO, verify your membership and see what your plan covers before you book.",
    href: "/access/use-your-hmo",
    cta: "How HMO access works",
  },
  {
    title: "Pay directly",
    body: "See the price up front, pay securely and get a receipt for every consultation.",
    href: "/access/pay-directly",
    cta: "See pricing",
  },
] as const;

/** The UK has no HMOs, so it leads with paying directly; insurer routes get added when they exist. */
const ukPayment = [
  {
    title: "Pay directly",
    body: "See the price up front, pay securely online and get a receipt for every consultation.",
    href: "/access/pay-directly",
    cta: "See pricing",
  },
] as const;

function PaymentCards({ items }: { items: readonly (typeof payment)[number][] | typeof ukPayment }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((p, i) => (
        <li key={p.href} style={stagger(i)} className="reveal card-motion flex flex-col rounded-card border border-line bg-card p-6">
          <h3 className="text-lg font-bold">{p.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{p.body}</p>
          <Link href={p.href} className="group mt-4 text-sm font-semibold text-link">
            {p.cta} <span className="inline-block transition-transform duration-300 ease-smooth group-hover:translate-x-1">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const services = [
  {
    title: "Online consultations",
    body: "Talk to a doctor by video or audio.",
    href: "/services/online-gp-consultations",
    image: "/images/service-consultation.webp",
    alt: "A friendly doctor waving during an online video consultation",
  },
  {
    title: "Prescriptions",
    body: "Get medication prescribed and coordinated with pharmacies.",
    href: "/services/prescriptions-medicines",
    image: "/images/service-prescriptions.webp",
    alt: "Hands holding a prescription and a box of medicine",
  },
  {
    title: "Tests & diagnostics",
    body: "Book and manage lab tests at partner centres.",
    href: "/services/laboratory-tests-diagnostics",
    image: "/images/service-diagnostics.webp",
    alt: "A laboratory scientist looking through a microscope",
  },
  {
    title: "Specialist care",
    body: "Onward care through our network of trusted providers, for you and your family.",
    href: "/services/referrals-coordinated-care",
    image: "/images/service-family.webp",
    alt: "A mother and daughter smiling and hugging on a sofa",
  },
] as const;

const steps: readonly { title: string; body: ReactNode; icon: IconName }[] = [
  { title: "Create your account", body: "Sign up on the app or website in minutes.", icon: "user-plus" },
  {
    title: "Choose how to pay",
    body: <ForRegion ng="Use your HMO or pay directly." uk="See the price and pay securely online." />,
    icon: "wallet",
  },
  { title: "Find a doctor and book", body: "Search, check availability and pick a time.", icon: "search" },
  { title: "Consult and follow up", body: "Speak to your doctor, then access your care plan.", icon: "video" },
] as const;

const trust = [
  { title: "Doctors you can trust", body: "Credentials are checked before doctors join the network." },
  { title: "Your health in one place", body: "Visit summaries, care plans and results stay together and follow you." },
  { title: "Private and secure", body: "You control who sees your records, and every access is logged." },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero: the photo bleeds in from the right and fades into the page, so the text sits on its calm side */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-40 size-[26rem] rounded-full bg-lime/15 blur-3xl" />
        </div>

        <Container className="relative z-10 pb-6 pt-14 sm:pt-20 lg:py-28">
          <div className="max-w-xl lg:max-w-[30rem] xl:max-w-xl">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Quality healthcare, anytime, <span className="text-accent">anywhere.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-muted">
              Talk to trusted doctors, get expert medical advice and access coordinated care, all in one place.{" "}
              <ForRegion ng="Use your HMO or pay directly." uk="Book online and pay securely." />
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/book" size="lg" arrow>
                Book a consultation
              </ButtonLink>
              <ButtonLink href="/doctors" variant="secondary" size="lg">
                Find a doctor
              </ButtonLink>
            </div>
          </div>
        </Container>

        {/* Photo: below the text on mobile (fades in from the top), full-height on the right on desktop (fades in from the left) */}
        <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[64%]">
          <Image
            src="/images/hero.webp"
            alt="A woman smiling as she uses her phone at home"
            fill
            priority
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover object-[70%_35%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_42%)]"
          />
          {/* Soft fade into the next section */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent lg:h-24" />

          {/* Decorative booking card floating over the photo */}
          <div aria-hidden className="float absolute bottom-6 left-4 hidden w-72 sm:block lg:bottom-12 lg:left-auto lg:right-8 xl:right-16">
            <div className="rounded-card border border-line bg-card/95 p-4 shadow-xl shadow-blue/15 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Your next visit</p>
                <StatusChip tone="approved">Confirmed</StatusChip>
              </div>
              <p className="mt-2 font-bold">Online consultation</p>
              <p className="text-sm text-ink-muted">Video or audio · Today, 10:00 AM</p>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-sm">
                <span className="text-ink-muted">Paying through</span>
                <StatusChip tone="covered">
                  <ForRegion ng="Your HMO" uk="Pay directly" />
                </StatusChip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pay your way */}
      <section className="border-y border-line bg-surface py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="reveal">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                <ForRegion ng="Use your HMO or pay directly" uk="Simple, upfront payment" />
              </h2>
              <p className="mt-3 text-ink-muted">
                <ForRegion
                  ng="Your payment route changes how your visit is funded. Your care and your records stay the same."
                  uk="See the price before you book and pay securely online. Your care and your records stay in one place."
                />
              </p>
            </div>
            <div data-region-only="ng">
              <PaymentCards items={payment} />
            </div>
            <div data-region-only="uk">
              <PaymentCards items={ukPayment} />
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-wider text-positive">Our services</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Comprehensive care for you and your family</h2>
            </div>
            <ButtonLink href="/services" variant="secondary">
              Explore all services
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <li key={s.href} style={stagger(i)} className="reveal">
                <Link href={s.href} className="group card-motion flex h-full flex-col overflow-hidden rounded-card border border-line bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold group-hover:text-link">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{s.body}</p>
                    <span className="mt-4 text-sm font-semibold text-link">Learn more</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface py-16 sm:py-24">
        <Container>
          <div className="reveal">
            <p className="text-sm font-bold uppercase tracking-wider text-positive">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Get care in 4 simple steps</h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} style={stagger(i)} className="reveal">
                <div className="card-motion flex h-full flex-col rounded-card border border-line bg-card p-6">
                  <span className="grid size-9 place-items-center rounded-full bg-lime text-base font-extrabold text-[#0b2540]">{i + 1}</span>
                  <span className="mt-5 grid size-14 place-items-center rounded-2xl bg-blue/10 text-link">
                    <Icon name={s.icon} className="size-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Trust */}
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="reveal max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Healthcare designed around you</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {trust.map((t, i) => (
              <li key={t.title} style={stagger(i)} className="reveal border-t-2 border-line pt-5">
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* App coming soon */}
      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <p className="reveal text-sm font-bold uppercase tracking-wider text-positive">Coming soon</p>
          <h2 className="reveal max-w-xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            The LifeCome Live app is on its way
          </h2>
          <p className="reveal max-w-lg text-lg leading-relaxed text-ink-muted">
            Book visits, join consultations and check your care plan from your phone. The app is in development for iOS and Android.
          </p>
          <div className="reveal mt-2 flex flex-wrap items-center justify-center gap-4">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
          <ButtonLink href="/help/support-feedback-complaints" variant="secondary" className="reveal mt-2">
            Get notified at launch
          </ButtonLink>
        </Container>
      </section>

      {/* CTA: the photo fades into the blue panel from the right */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="reveal relative flex flex-col overflow-hidden rounded-[2rem] bg-blue text-white lg:min-h-[26rem] lg:flex-row lg:items-center">
            <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%]">
              <Image
                src="/images/cta-banner.webp"
                alt="A smiling man checking his phone outdoors"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[80%_30%] [mask-image:linear-gradient(to_top,transparent_0%,black_45%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_45%)]"
              />
            </div>
            <div className="relative z-10 px-6 pb-12 pt-2 sm:px-12 lg:max-w-[46%] lg:py-20 lg:pl-14 lg:pr-0">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Your health journey starts here</h2>
              <p className="mt-3 max-w-md text-lg text-white/85">Book an online consultation in a few minutes.</p>
              <div className="mt-8">
                <ButtonLink href="/book" variant="accent" size="lg" arrow>
                  Get started today
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
