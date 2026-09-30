import type { PagePath } from "./pages";

export interface NavLink {
  readonly label: string;
  readonly href: PagePath;
}

export interface NavGroup {
  readonly label: string;
  readonly href?: PagePath;
  readonly children?: readonly NavLink[];
}

/** Primary navigation (blueprint §5.1). `href` values are type-checked against the page registry. */
export const primaryNav: readonly NavGroup[] = [
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "Services",
    children: [
      { label: "Online GP Consultations", href: "/services/online-gp-consultations" },
      { label: "Follow-up Care", href: "/services/follow-up-care" },
      { label: "Results Review", href: "/services/results-review" },
      { label: "Referrals", href: "/services/referrals-coordinated-care" },
      { label: "Tests & Diagnostics", href: "/services/laboratory-tests-diagnostics" },
      { label: "Prescriptions", href: "/services/prescriptions-medicines" },
    ],
  },
  {
    label: "Access Care",
    children: [
      { label: "Ways to Access", href: "/access" },
      { label: "Use Your HMO", href: "/access/use-your-hmo" },
      { label: "Participating HMOs", href: "/access/participating-hmos" },
      { label: "Check Your Cover", href: "/access/check-your-cover" },
      { label: "Pay Directly", href: "/access/pay-directly" },
      { label: "Pricing", href: "/access/pricing-and-payments" },
    ],
  },
  {
    label: "Health Records",
    children: [
      { label: "Care Plan", href: "/care-plan" },
      { label: "Health Records", href: "/health-records" },
      { label: "Record Access", href: "/health-records/who-can-access" },
      { label: "Provider Network", href: "/provider-network" },
    ],
  },
  {
    label: "Partners",
    children: [
      { label: "Healthcare Providers", href: "/partners/providers" },
      { label: "HMOs & Health Plans", href: "/partners/hmos" },
      { label: "Employers & Organisations", href: "/partners/organisations" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "About LifeCome Live", href: "/about" },
      { label: "Our Doctors", href: "/about/doctors-and-clinical-team" },
      { label: "Clinical Governance", href: "/about/clinical-governance" },
      { label: "Security & Data Protection", href: "/about/security-and-privacy" },
    ],
  },
];

export const utilityNav = {
  help: { label: "Help", href: "/help" },
  getCare: { label: "Get Care", href: "/book" },
} as const satisfies Record<string, NavLink>;

export const footerLegalLinks: readonly NavLink[] = [
  { label: "Legal & Privacy", href: "/legal" },
  { label: "Emergency Guidance", href: "/emergency" },
  { label: "Support & Complaints", href: "/help/support-feedback-complaints" },
  { label: "Clinical Governance", href: "/about/clinical-governance" },
];
