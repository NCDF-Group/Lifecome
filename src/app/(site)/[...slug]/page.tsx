import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/content/page-renderer";
import { Container } from "@/components/ui/container";
import { getBody } from "@/content/bodies";
import { catchAllParams, getPage } from "@/content/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return catchAllParams();
}

function resolve(slug: string[]) {
  const path = `/${slug.join("/")}`;
  const page = getPage(path);
  const body = getBody(path);
  return page && body ? { page, body } : undefined;
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const found = resolve((await params).slug);
  if (!found) return {};
  return {
    title: found.page.title,
    description: found.body.lead,
    alternates: { canonical: found.page.path },
  };
}

export default async function ContentPage({ params }: PageProps<"/[...slug]">) {
  const found = resolve((await params).slug);
  if (!found) notFound();
  const { page, body } = found;

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-surface">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 size-[24rem] rounded-full bg-cyan/20 blur-3xl" />
          <div className="absolute -left-32 top-24 size-[20rem] rounded-full bg-lime/15 blur-3xl" />
        </div>
        <Container className={`relative z-10 py-12 sm:py-16 ${body.image ? "lg:py-24" : ""}`}>
          <div className={body.image ? "max-w-xl lg:max-w-[30rem] xl:max-w-xl" : ""}>
            <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-link hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="font-medium text-ink">
                  {page.title}
                </li>
              </ol>
            </nav>
            <p className="mt-8 text-sm font-bold uppercase tracking-wider text-positive">{page.group}</p>
            <h1 className="mt-2 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">{body.lead}</p>
          </div>
        </Container>

        {/* Photo: below the text on mobile (fades in from the top), on the right on desktop (fades in from the left) */}
        {body.image && (
          <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[62%]">
            <Image
              src={body.image.src}
              alt={body.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 100vw"
              style={{ "--fade": `${body.image.fade ?? 40}%`, objectPosition: body.image.position } as CSSProperties}
              className="object-cover [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_var(--fade))]"
            />
          </div>
        )}
      </header>

      <PageRenderer body={body} path={page.path} />
    </>
  );
}
