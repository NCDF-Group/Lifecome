import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { catchAllParams, getPage, pagesInGroup } from "@/content/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return catchAllParams();
}

function resolve(slug: string[]) {
  return getPage(`/${slug.join("/")}`);
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const page = resolve((await params).slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.purpose,
    alternates: { canonical: page.path },
    robots: page.status === "stub" ? { index: false, follow: true } : undefined,
  };
}

export default async function ContentPage({ params }: PageProps<"/[...slug]">) {
  const page = resolve((await params).slug);
  if (!page) notFound();

  const related = pagesInGroup(page.group).filter((p) => p.path !== page.path);

  return (
    <Container className="py-14 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-ink">
            {page.title}
          </li>
        </ol>
      </nav>

      <p className="mt-8 text-sm font-bold uppercase tracking-wider text-green-strong">{page.group}</p>
      <h1 className="mt-2 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{page.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">{page.purpose}.</p>

      {page.status === "stub" && (
        <div className="mt-10 max-w-2xl rounded-card border border-gold/50 bg-surface p-5">
          <p className="font-semibold">Content in progress</p>
          <p className="mt-1 text-sm text-ink-muted">This page is part of the approved site map and will be published once its content is signed off.</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/book">Get care</ButtonLink>
        <ButtonLink href="/help" variant="secondary">
          Help centre
        </ButtonLink>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16 border-t border-line pt-10">
          <h2 id="related" className="text-xl font-bold">
            Related
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.path}>
                <Link href={p.path} className="block rounded-card border border-line p-4 font-semibold hover:border-blue hover:text-blue">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
