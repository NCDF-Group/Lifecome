import type { IconName } from "@/components/ui/icons";
import type { PagePath } from "./pages";

/**
 * Call-to-action targets. Besides internal pages there are two tokens resolved at render time:
 * - "contact":  mailto link if NEXT_PUBLIC_CONTACT_EMAIL is set, otherwise the support page
 * - "app":      the patient app sign-in, omitted while NEXT_PUBLIC_PATIENT_APP_URL is unset
 */
export type CtaTarget = PagePath | "contact" | "app";

export interface CtaLink {
  label: string;
  href: CtaTarget;
}

export interface Card {
  title: string;
  body: string;
  href?: PagePath;
}

export type Block =
  | { type: "text"; heading?: string; body: string[] }
  | { type: "cards"; heading?: string; intro?: string; cols?: 2 | 3 | 4; items: Card[] }
  | { type: "steps"; heading?: string; intro?: string; items: { title: string; body: string; icon?: IconName }[] }
  | { type: "checklist"; heading?: string; intro?: string; items: string[] }
  | { type: "table"; heading?: string; intro?: string; columns: string[]; rows: string[][] }
  | { type: "faq"; heading?: string; items: { q: string; a: string }[]; searchable?: boolean }
  | { type: "callout"; tone: "info" | "safety" | "pending"; title: string; body: string }
  | { type: "hmo-directory" };

export interface PageBody {
  /** Short intro shown under the title and used as the meta description. */
  lead: string;
  /**
   * Optional photo blended into the page header (fades in from the right on desktop).
   * `fade` is the % of the photo's width over which it fades in from the left; use a smaller value when the
   * subject sits toward the left of the frame, and `position` (CSS object-position) to keep heads in frame.
   * Files live in /public/images.
   */
  image?: { src: string; alt: string; fade?: number; position?: string };
  blocks: Block[];
  cta?: { title: string; body: string; primary: CtaLink; secondary?: CtaLink };
  related?: PagePath[];
}

export type Bodies = Partial<Record<PagePath, PageBody>>;
