import type { Bodies } from "../types";

export const network: Bodies = {
  "/provider-network": {
    lead: "LifeCome Live works with a network of doctors, laboratories, pharmacies, clinics and hospitals so your care can continue wherever it needs to.",
    image: { src: "/images/network-hospital.webp", alt: "A modern hospital building with staff walking to the entrance", fade: 22 },
    blocks: [
      {
        type: "cards",
        heading: "Who is in the network",
        cols: 3,
        items: [
          { title: "Doctors", body: "Clinicians who deliver online consultations and follow-up care." },
          { title: "Laboratories & diagnostics", body: "Providers who carry out tests and return results to your record." },
          { title: "Pharmacies", body: "Pharmacies that help you get your prescribed medicines." },
          { title: "Clinics & hospitals", body: "Partners for in-person and specialist care after a referral." },
        ],
      },
      {
        type: "text",
        heading: "How providers work with your record",
        body: [
          "Network providers see only what they need for the care they are providing, and only while they are assigned. Results and documents they add show who they came from and whether a clinician has reviewed them.",
        ],
      },
    ],
    cta: {
      title: "Are you a healthcare provider?",
      body: "Learn how to join the LifeCome Live provider network.",
      primary: { label: "Join the network", href: "/partners/providers" },
      secondary: { label: "Who can access records", href: "/health-records/who-can-access" },
    },
    related: ["/partners/providers", "/services/referrals-coordinated-care", "/health-records/who-can-access"],
  },

  "/partners/providers": {
    lead: "Join the LifeCome Live provider network to receive referrals, deliver services and share results as part of a patient's connected care.",
    blocks: [
      {
        type: "cards",
        heading: "Why join",
        cols: 3,
        items: [
          { title: "Connected referrals", body: "Receive referrals with the context you need, with the patient's consent." },
          { title: "Send results back", body: "Upload approved results and documents to the patient's record with clear provenance." },
          { title: "Clear access rules", body: "Access is assignment-based and limited to what your role needs." },
        ],
      },
      {
        type: "steps",
        heading: "How onboarding works",
        items: [
          { title: "Get in touch", body: "Tell us about your organisation and the services you provide." },
          { title: "Verification", body: "We verify your organisation's and clinicians' credentials." },
          { title: "Agreement", body: "We agree how referrals, access and results work between us." },
          { title: "Go live", body: "You are added to the network and given secure access." },
        ],
      },
    ],
    cta: {
      title: "Talk to us about joining",
      body: "Tell us about your practice, laboratory, pharmacy, clinic or hospital.",
      primary: { label: "Contact us", href: "contact" },
      secondary: { label: "See the network", href: "/provider-network" },
    },
    related: ["/provider-network", "/partners/hmos", "/about/security-and-privacy"],
  },

  "/partners/hmos": {
    lead: "Partner with LifeCome Live to give your members access to online care, with verification, eligibility and authorisation connected to your systems.",
    blocks: [
      {
        type: "cards",
        heading: "What partnership involves",
        cols: 3,
        items: [
          { title: "Membership verification", body: "Members are verified against your records." },
          { title: "Eligibility & authorisation", body: "Service-level cover and approvals follow your benefit rules." },
          { title: "Utilisation & reconciliation", body: "Where agreed, utilisation data and reconciliation are shared." },
        ],
      },
      {
        type: "table",
        heading: "Ways to connect",
        intro: "Every HMO connects in the way that suits its systems.",
        columns: ["Approach", "Best when"],
        rows: [
          ["Real-time API", "You offer member, eligibility and authorisation APIs."],
          ["Secure file exchange", "You share membership and benefit files on a schedule."],
          ["Operations portal", "You have no API and prefer your team to review requests in a portal."],
          ["Configured benefit rules", "Contracted benefit rules are set up and maintained with us."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Data minimisation",
        body: "Your members' clinical records are not shared with you by default. You receive only the coverage, authorisation and utilisation data the arrangement requires.",
      },
    ],
    cta: {
      title: "Become a participating HMO",
      body: "Talk to us about integration, benefits and onboarding.",
      primary: { label: "Contact us", href: "contact" },
      secondary: { label: "Participating HMOs", href: "/access/participating-hmos" },
    },
    related: ["/access/participating-hmos", "/partners/providers", "/partners/organisations"],
  },

  "/partners/organisations": {
    lead: "Give your people access to online healthcare through LifeCome Live, with your organisation sponsoring their care.",
    blocks: [
      {
        type: "cards",
        heading: "Why organisations choose LifeCome Live",
        cols: 3,
        items: [
          { title: "Convenient access", body: "Employees can see a doctor by video or audio without time away from work." },
          { title: "Continuity of care", body: "Care plans and records follow each person and are not split across providers." },
          { title: "Privacy", body: "Individual health information is not shared with employers." },
        ],
      },
      {
        type: "callout",
        tone: "pending",
        title: "Sponsored access is being developed",
        body: "Employer and sponsored access is part of our roadmap. Get in touch to discuss your needs and be among the first to hear when it is available.",
      },
    ],
    cta: {
      title: "Talk to us about your organisation",
      body: "Tell us about your team and what you would like to offer.",
      primary: { label: "Contact us", href: "contact" },
      secondary: { label: "Ways to access", href: "/access" },
    },
    related: ["/access", "/partners/hmos", "/about"],
  },
};
