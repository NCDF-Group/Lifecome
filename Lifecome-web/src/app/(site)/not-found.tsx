import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-green-strong">Page not found</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">The link may be out of date. Try the home page or the help centre.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/help" variant="secondary">
          Help centre
        </ButtonLink>
      </div>
    </Container>
  );
}
