import type { Bodies } from "../types";

export const records: Bodies = {
  "/care-plan": {
    lead: "After each consultation your doctor gives you a care plan: clear, personal next steps that stay linked to the visit they came from.",
    blocks: [
      {
        type: "checklist",
        heading: "What a care plan can include",
        items: [
          "A summary of your visit",
          "Instructions and advice from your doctor",
          "Prescriptions, tests and referrals",
          "Follow-up timing and goals",
          "Who to contact with questions",
        ],
      },
      {
        type: "text",
        heading: "Always current, never overwritten",
        body: [
          "Care plans are versioned. When your doctor updates your plan, the earlier version is kept, so you can see how your care has changed.",
        ],
      },
    ],
    related: ["/after-your-consultation", "/health-records", "/services/follow-up-care"],
  },

  "/health-records": {
    lead: "Your LifeCome Live health record brings together the care you receive through LifeCome Live and its provider network in one place.",
    image: { src: "/images/records-privacy.webp", alt: "Hands holding a phone beside a small padlock and key on a desk", fade: 26 },
    blocks: [
      {
        type: "cards",
        heading: "What is in your record",
        cols: 3,
        items: [
          { title: "Visit notes & summaries", body: "Written by your doctor and signed off before they appear." },
          { title: "Care plans", body: "Versioned and linked to the visit they came from." },
          { title: "Prescriptions & referrals", body: "Every prescription and referral, with who issued it and when." },
          { title: "Test results", body: "With the provider, date and whether a clinician has reviewed them." },
          { title: "Documents", body: "Approved documents from you and from network providers." },
          { title: "Messages", body: "Secure conversations with your care team." },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What this record is",
        body: "Your LifeCome Live record covers care delivered or coordinated through LifeCome Live and its provider network. It is not a national health record.",
      },
      {
        type: "checklist",
        heading: "How your record is protected",
        items: [
          "Doctors' signed notes are never edited in place. Corrections are added as amendments",
          "Every view, download and share is logged",
          "Access is limited by role and assignment",
          "Each item shows where it came from and its status",
        ],
      },
    ],
    related: ["/health-records/who-can-access", "/care-plan", "/about/security-and-privacy"],
  },

  "/health-records/who-can-access": {
    lead: "You are in control of your health record. This page explains who can see what, and the rules that apply.",
    blocks: [
      {
        type: "table",
        heading: "Who can access your record",
        columns: ["Who", "What they can see", "Conditions"],
        rows: [
          ["You", "Your own available records", "Different rules apply to dependants, based on age and guardian consent."],
          ["Your treating doctor", "What they need for your active care", "Only while they are assigned to you, and only the minimum needed."],
          ["Care coordinator", "Coordination details and the clinical context needed", "Only for cases they are assigned to."],
          ["Laboratory or diagnostic provider", "Your order and the relevant context", "Limited to that order and for a limited time."],
          ["Clinic or hospital partner", "The relevant referral and care-plan context", "Requires an assignment and your consent, under the partner's contract."],
          ["Your HMO", "Coverage, authorisation and usage data only", "Your HMO does not get broad access to your clinical record."],
          ["Support agents", "Basic account and booking details", "Clinical details are hidden unless a support task requires them."],
        ],
      },
      {
        type: "text",
        heading: "Every access is logged",
        body: [
          "Each time your record is viewed, downloaded or shared, we keep a tamper-resistant log. Access can be revoked, and records show when access has been revoked.",
        ],
      },
    ],
    related: ["/health-records", "/about/security-and-privacy", "/legal"],
  },
};
