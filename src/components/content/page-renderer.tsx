import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icons";
import { appHref, contactEmail } from "@/lib/site";
import { participatingHmos } from "@/content/payers";
import { getPage } from "@/content/pages";
import type { Block, CtaLink, CtaTarget, PageBody } from "@/content/types";
import { FaqList } from "./faq-list";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

function resolveTarget(target: CtaTarget): string | null {
  if (target === "app") return appHref("/sign-in");
  if (target === "contact") return contactEmail ? `mailto:${contactEmail}` : "/help/support-feedback-complaints";
  return target;
}

function CtaButton({ link, variant }: { link: CtaLink; variant: "accent" | "secondary" | "primary" }) {
  const href = resolveTarget(link.href);
  if (!href) return null;
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={`inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-control px-7 font-semibold transition duration-300 ease-smooth hover:-translate-y-0.5 active:scale-[0.97] ${
          variant === "accent" ? "bg-lime text-[#0b2540]" : "border-2 border-white text-white hover:bg-white hover:text-blue"
        }`}
      >
        {link.label}
      </a>
    );
  }
  return (
    <ButtonLink href={href} variant={variant} size="lg" arrow={variant !== "secondary"}>
      {link.label}
    </ButtonLink>
  );
}

function SectionHeading({ heading, intro }: { heading?: string; intro?: string }) {
  if (!heading && !intro) return null;
  return (
    <div className="reveal mb-8 max-w-2xl">
      {heading && <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}</h2>}
      {intro && <p className="mt-3 text-lg leading-relaxed text-ink-muted">{intro}</p>}
    </div>
  );
}

const calloutStyles = {
  info: "border-link/40 bg-blue/5",
  safety: "border-gold bg-gold/10",
  pending: "border-line bg-surface",
} as const;

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <div className="max-w-3xl">
          {block.heading && <h2 className="reveal text-2xl font-extrabold tracking-tight sm:text-3xl">{block.heading}</h2>}
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink-muted">
            {block.body.map((p) => (
              <p key={p} className="reveal">
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    case "cards": {
      const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[block.cols ?? 3];
      return (
        <>
          <SectionHeading heading={block.heading} intro={block.intro} />
          <ul className={`grid gap-4 ${cols}`}>
            {block.items.map((c, i) => (
              <li key={c.title} style={stagger(i)} className="reveal">
                {c.href ? (
                  <Link href={c.href} className="group card-motion flex h-full flex-col rounded-card border border-line bg-card p-6">
                    <span aria-hidden className="h-1.5 w-10 rounded-full bg-lime" />
                    <h3 className="mt-5 text-lg font-bold group-hover:text-link">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{c.body}</p>
                    <span className="mt-4 text-sm font-semibold text-link">Learn more</span>
                  </Link>
                ) : (
                  <div className="card-motion flex h-full flex-col rounded-card border border-line bg-card p-6">
                    <span aria-hidden className="h-1.5 w-10 rounded-full bg-lime" />
                    <h3 className="mt-5 text-lg font-bold">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      );
    }

    case "steps":
      return (
        <>
          <SectionHeading heading={block.heading} intro={block.intro} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((step, i) => (
              <li key={step.title} style={stagger(i % 4)} className="reveal">
                <div className="card-motion flex h-full flex-col rounded-card border border-line bg-card p-6">
                  <span className="grid size-9 place-items-center rounded-full bg-lime text-base font-extrabold text-[#0b2540]">{i + 1}</span>
                  {step.icon && (
                    <span className="mt-5 grid size-14 place-items-center rounded-2xl bg-blue/10 text-link">
                      <Icon name={step.icon} className="size-7" />
                    </span>
                  )}
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      );

    case "checklist":
      return (
        <>
          <SectionHeading heading={block.heading} intro={block.intro} />
          <ul className="grid max-w-4xl gap-x-10 gap-y-3 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <li key={item} style={stagger(i % 4)} className="reveal flex gap-3 leading-relaxed">
                <svg aria-hidden viewBox="0 0 16 16" className="mt-1 size-5 shrink-0 text-positive">
                  <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      );

    case "table":
      return (
        <>
          <SectionHeading heading={block.heading} intro={block.intro} />
          <div className="reveal overflow-x-auto rounded-card border border-line bg-card">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-surface">
                  {block.columns.map((c) => (
                    <th key={c} scope="col" className="px-5 py-3 font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-line align-top">
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={cell} scope="row" className="px-5 py-4 font-semibold">
                          {cell}
                        </th>
                      ) : (
                        <td key={`${row[0]}-${i}`} className="px-5 py-4 leading-relaxed text-ink-muted">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );

    case "faq":
      return (
        <div className="max-w-3xl">
          <SectionHeading heading={block.heading ?? "Frequently asked questions"} />
          <FaqList items={block.items} searchable={block.searchable} />
        </div>
      );

    case "callout":
      return (
        <div className={`reveal max-w-3xl rounded-card border-2 p-6 ${calloutStyles[block.tone]}`}>
          <p className="font-bold">{block.title}</p>
          <p className="mt-2 leading-relaxed text-ink-muted">{block.body}</p>
        </div>
      );

    case "hmo-directory":
      return participatingHmos.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {participatingHmos.map((h, i) => (
            <li key={h.name} style={stagger(i)} className="reveal card-motion rounded-card border border-line bg-card p-6 font-bold">
              {h.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="reveal max-w-3xl rounded-card border-2 border-line bg-surface p-6">
          <p className="font-bold">Participating HMOs will be listed here</p>
          <p className="mt-2 leading-relaxed text-ink-muted">
            We only list an HMO once its commercial, operational and technical onboarding is complete, so what you see here is always
            accurate. Until then, you can pay directly.
          </p>
          <div className="mt-5">
            <ButtonLink href="/access/pay-directly" variant="secondary">
              Pay directly instead
            </ButtonLink>
          </div>
        </div>
      );
  }
}

export function PageRenderer({ body, path }: { body: PageBody; path: string }) {
  const cta = body.cta ?? {
    title: "Ready to see a doctor?",
    body: "Book an online consultation in a few minutes.",
    primary: { label: "Get care", href: "/book" as const },
    secondary: { label: "Help centre", href: "/help" as const },
  };
  const related = (body.related ?? []).flatMap((p) => {
    const page = getPage(p);
    return page && p !== path ? [page] : [];
  });

  return (
    <>
      {body.blocks.map((block, i) => (
        <section key={i} className={`py-12 sm:py-16 ${i % 2 === 1 ? "border-y border-line bg-surface" : ""}`}>
          <Container>
            <BlockView block={block} />
          </Container>
        </section>
      ))}

      {related.length > 0 && (
        <section aria-labelledby="related" className="py-12 sm:py-16">
          <Container>
            <h2 id="related" className="reveal text-xl font-bold">
              Related pages
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <li key={p.path} style={stagger(i)} className="reveal">
                  <Link href={p.path} className="card-motion block rounded-card border border-line bg-card p-4 font-semibold hover:text-link">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="pb-16 pt-4 sm:pb-24">
        <Container>
          <div className="reveal relative overflow-hidden rounded-[2rem] bg-blue px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-cyan/30 blur-2xl" />
            <div aria-hidden className="absolute -bottom-20 -left-10 size-64 rounded-full bg-lime/25 blur-2xl" />
            <div className="relative">
              <h2 className="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">{cta.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">{cta.body}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <CtaButton link={cta.primary} variant="accent" />
                {cta.secondary && <CtaButton link={cta.secondary} variant="secondary" />}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
