/**
 * Registry of the 36 approved public pages (blueprint §5).
 * `status: "stub"` pages render a placeholder, are noindex, and are excluded from the sitemap
 * until their content is approved and switched to "live".
 */
export type PageGroup =
  | "Core"
  | "Services"
  | "Access"
  | "Care"
  | "Records"
  | "Network"
  | "Partners"
  | "Trust"
  | "Support"
  | "Safety"
  | "Legal";

export interface SitePage {
  /** Page number in the blueprint (01–36). */
  readonly n: number;
  readonly path: string;
  readonly title: string;
  readonly group: PageGroup;
  readonly purpose: string;
  readonly status: "live" | "stub";
}

export const pages = [
  { n: 1, path: "/", title: "Home", group: "Core", purpose: "Primary acquisition, trust and care entry", status: "live" },
  { n: 2, path: "/how-it-works", title: "How LifeCome Live Works", group: "Core", purpose: "Access → consultation → care plan → follow-up", status: "stub" },
  { n: 3, path: "/services", title: "Online Healthcare Services", group: "Services", purpose: "Master service directory", status: "stub" },
  { n: 4, path: "/services/online-gp-consultations", title: "Online GP Consultations", group: "Services", purpose: "New and general health concerns", status: "stub" },
  { n: 5, path: "/services/follow-up-care", title: "Online Follow-up Care", group: "Services", purpose: "Continuity after an initial consultation", status: "stub" },
  { n: 6, path: "/services/results-review", title: "Test & Diagnostic Results Review", group: "Services", purpose: "Clinician review of results", status: "stub" },
  { n: 7, path: "/services/referrals-coordinated-care", title: "Referrals & Coordinated Care", group: "Services", purpose: "Onward care through the provider network", status: "stub" },
  { n: 8, path: "/services/laboratory-tests-diagnostics", title: "Laboratory Tests & Diagnostics", group: "Services", purpose: "Diagnostics coordination", status: "stub" },
  { n: 9, path: "/services/prescriptions-medicines", title: "Prescriptions & Medicines", group: "Services", purpose: "Prescribing and pharmacy coordination", status: "stub" },
  { n: 10, path: "/access", title: "Ways to Access LifeCome Live", group: "Access", purpose: "HMO, direct pay and future sponsored access", status: "stub" },
  { n: 11, path: "/access/use-your-hmo", title: "Access LifeCome Live With Your HMO", group: "Access", purpose: "Multi-HMO access explanation", status: "stub" },
  { n: 12, path: "/access/participating-hmos", title: "HMOs Accepted by LifeCome Live", group: "Access", purpose: "Participating payer directory", status: "stub" },
  { n: 13, path: "/access/check-your-cover", title: "Check Your HMO Eligibility & Cover", group: "Access", purpose: "Secure eligibility gateway", status: "stub" },
  { n: 14, path: "/access/using-health-insurance", title: "Using Your Health Insurance on LifeCome Live", group: "Access", purpose: "Authorisation, exclusions and co-payments", status: "stub" },
  { n: 15, path: "/access/pay-directly", title: "Pay Directly for Healthcare", group: "Access", purpose: "Self-pay pathway", status: "stub" },
  { n: 16, path: "/access/pricing-and-payments", title: "Consultation Pricing & Payments", group: "Access", purpose: "Pricing, payment, receipts and refunds", status: "stub" },
  { n: 17, path: "/doctors", title: "Find a LifeCome Live Doctor", group: "Care", purpose: "Doctor discovery", status: "stub" },
  { n: 18, path: "/book", title: "Book an Online Consultation", group: "Care", purpose: "Booking gateway", status: "stub" },
  { n: 19, path: "/prepare-for-your-consultation", title: "Prepare for Your Online Consultation", group: "Care", purpose: "Pre-visit guidance", status: "stub" },
  { n: 20, path: "/your-consultation", title: "Your LifeCome Live Consultation", group: "Care", purpose: "What to expect during your visit", status: "stub" },
  { n: 21, path: "/after-your-consultation", title: "What Happens After Your Consultation", group: "Care", purpose: "Summary, referrals, prescriptions and follow-up", status: "stub" },
  { n: 22, path: "/care-plan", title: "Your LifeCome Live Care Plan", group: "Records", purpose: "Personalised next steps", status: "stub" },
  { n: 23, path: "/health-records", title: "Your LifeCome Live Health Records", group: "Records", purpose: "Longitudinal platform record", status: "stub" },
  { n: 24, path: "/health-records/who-can-access", title: "Who Can Access Your Health Records?", group: "Records", purpose: "Permissions and sharing", status: "stub" },
  { n: 25, path: "/provider-network", title: "LifeCome Live Healthcare Provider Network", group: "Network", purpose: "Doctors, labs, pharmacies, clinics and hospitals", status: "stub" },
  { n: 26, path: "/partners/providers", title: "Join the LifeCome Live Provider Network", group: "Partners", purpose: "Provider proposition", status: "stub" },
  { n: 27, path: "/partners/hmos", title: "Partner With LifeCome Live – HMOs & Health Plans", group: "Partners", purpose: "Payer integration proposition", status: "stub" },
  { n: 28, path: "/partners/organisations", title: "Digital Healthcare for Organisations", group: "Partners", purpose: "Employer and sponsored access", status: "stub" },
  { n: 29, path: "/about", title: "About LifeCome Live", group: "Trust", purpose: "Mission and operating model", status: "stub" },
  { n: 30, path: "/about/doctors-and-clinical-team", title: "Our Doctors & Clinical Team", group: "Trust", purpose: "Credentials and clinical leadership", status: "stub" },
  { n: 31, path: "/about/clinical-governance", title: "Clinical Governance & Patient Safety", group: "Trust", purpose: "Quality, safeguarding and escalation", status: "stub" },
  { n: 32, path: "/about/security-and-privacy", title: "Security, Privacy & Data Protection", group: "Trust", purpose: "Security and privacy by design", status: "stub" },
  { n: 33, path: "/help", title: "LifeCome Live Help Centre", group: "Support", purpose: "Searchable support and FAQs", status: "stub" },
  { n: 34, path: "/help/support-feedback-complaints", title: "Patient Support, Feedback & Complaints", group: "Support", purpose: "Support, feedback and complaints", status: "stub" },
  { n: 35, path: "/emergency", title: "Emergency & Urgent Care Guidance", group: "Safety", purpose: "Emergency boundary and escalation", status: "stub" },
  { n: 36, path: "/legal", title: "LifeCome Live Legal & Privacy Centre", group: "Legal", purpose: "Terms, privacy, cookies, consent and accessibility", status: "stub" },
] as const satisfies readonly SitePage[];

export type PagePath = (typeof pages)[number]["path"];

const byPath: ReadonlyMap<string, SitePage> = new Map(pages.map((p) => [p.path, p]));

export function getPage(path: string): SitePage | undefined {
  return byPath.get(path);
}

/** Path segments for every non-home page, for `generateStaticParams`. */
export function catchAllParams(): { slug: string[] }[] {
  return pages.filter((p) => p.path !== "/").map((p) => ({ slug: p.path.slice(1).split("/") }));
}

export function pagesInGroup(group: PageGroup): SitePage[] {
  return pages.filter((p) => p.group === group);
}
