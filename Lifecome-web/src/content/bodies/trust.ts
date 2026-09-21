import type { Bodies } from "../types";

export const trust: Bodies = {
  "/about": {
    lead: "LifeCome Live is a digital healthcare and coordinated-care platform. We help people get quality care online and keep it connected afterwards.",
    blocks: [
      {
        type: "text",
        heading: "What we do",
        body: [
          "LifeCome Live brings together online consultations, care plans, health records and a network of trusted providers, so care does not stop when a call ends.",
          "We are a healthcare delivery and coordination platform. We work with participating HMOs and also welcome people who pay directly, and your payment route never changes your care.",
        ],
      },
      {
        type: "cards",
        heading: "What guides us",
        cols: 3,
        items: [
          { title: "Patient first", body: "One identity and one record, however you pay." },
          { title: "Clinical continuity", body: "Every visit flows into a care plan, a record and follow-up." },
          { title: "Privacy and security", body: "Minimum necessary access, consent and audit built in." },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "LifeCome Live and LifeCome HMO",
        body: "LifeCome Live is a separate business from LifeCome HMO. LifeCome HMO is one of the HMOs that may participate on LifeCome Live, alongside others.",
      },
    ],
    related: ["/about/doctors-and-clinical-team", "/about/clinical-governance", "/about/security-and-privacy"],
  },

  "/about/doctors-and-clinical-team": {
    lead: "The doctors and clinicians on LifeCome Live are verified before they treat patients.",
    image: { src: "/images/team-doctors.webp", alt: "Two smiling doctors in white coats standing in a hospital corridor", fade: 22, position: "50% 0%" },
    blocks: [
      {
        type: "checklist",
        heading: "How clinicians join",
        items: [
          "Licence and credential details are recorded and verified",
          "Specialty, languages and services are shown on their profile",
          "Access to patient records is limited to patients they are assigned to",
          "Their notes are signed and cannot be silently changed",
        ],
      },
      {
        type: "text",
        heading: "Care coordinators",
        body: ["Care coordinators help with follow-up, referrals and provider handoffs, so you are not left to organise onward care on your own."],
      },
      {
        type: "callout",
        tone: "pending",
        title: "Our clinical team",
        body: "Profiles of our clinical leadership and doctors will be published here once they have been approved.",
      },
    ],
    related: ["/about/clinical-governance", "/doctors", "/about"],
  },

  "/about/clinical-governance": {
    lead: "Clear standards for quality, safety and escalation protect patients on LifeCome Live.",
    blocks: [
      {
        type: "cards",
        heading: "How we govern care",
        cols: 3,
        items: [
          { title: "Quality", body: "Clinical practice is reviewed against agreed standards." },
          { title: "Patient safety", body: "Concerns are escalated and followed up, and clinical governance staff can act on them." },
          { title: "Safeguarding", body: "Procedures protect children and vulnerable adults." },
        ],
      },
      {
        type: "text",
        heading: "Emergencies",
        body: ["Online care is not suitable for emergencies. We give clear guidance about when to seek urgent in-person care and how to do so."],
      },
      {
        type: "text",
        heading: "Records and amendments",
        body: ["Signed clinical notes are kept as written. If something needs correcting, an amendment is added and the original remains visible in the audit history."],
      },
    ],
    cta: {
      title: "Have a concern about your care?",
      body: "Tell us. We take every concern seriously.",
      primary: { label: "Feedback and complaints", href: "/help/support-feedback-complaints" },
      secondary: { label: "Emergency guidance", href: "/emergency" },
    },
    related: ["/about/doctors-and-clinical-team", "/emergency", "/help/support-feedback-complaints"],
  },

  "/about/security-and-privacy": {
    lead: "Your health information is sensitive. LifeCome Live is designed to protect it and to give you a say in how it is used.",
    image: { src: "/images/records-privacy.webp", alt: "Hands holding a phone beside a small padlock and key on a desk", fade: 26 },
    blocks: [
      {
        type: "cards",
        heading: "How we protect your data",
        cols: 3,
        items: [
          { title: "Encryption", body: "Data is encrypted in transit and at rest." },
          { title: "Least-privilege access", body: "People see only what their role and assignment require." },
          { title: "Audit trails", body: "Access to records, clinical changes and payer decisions are logged." },
          { title: "Strong sign-in", body: "One-time codes for patients, and multi-factor authentication for staff and providers." },
          { title: "Monitoring", body: "We watch for abuse and unusual activity, and test our defences regularly." },
          { title: "Safe notifications", body: "Text messages and push notifications do not include clinical details." },
        ],
      },
      {
        type: "checklist",
        heading: "Privacy by design",
        items: [
          "We collect only what a workflow needs",
          "Clinical data and payer data are kept separate wherever practical",
          "Your consent is recorded with what you agreed to, when and how",
          "Sensitive fields are masked in logs, analytics and support tools",
          "Your HMO does not get broad access to your clinical record",
        ],
      },
      {
        type: "text",
        heading: "Your choices",
        body: ["You can ask for access to your information, ask for corrections and raise privacy questions. See our legal and privacy centre for details."],
      },
    ],
    related: ["/health-records/who-can-access", "/legal", "/help"],
  },
};
