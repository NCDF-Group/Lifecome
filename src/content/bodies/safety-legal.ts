import type { Bodies } from "../types";

export const safetyLegal: Bodies = {
  "/emergency": {
    lead: "LifeCome Live is for non-emergency care. In an emergency, do not wait for an online appointment.",
    blocks: [
      {
        type: "callout",
        tone: "safety",
        title: "If you think it is an emergency, act now",
        body: "Go to the nearest emergency facility or call your local emergency number immediately. If you are with someone who needs help, stay with them.",
      },
      {
        type: "checklist",
        heading: "Get emergency help straight away for",
        intro: "This list is not complete. If you are worried that something is serious, seek emergency help.",
        items: [
          "Chest pain or pressure",
          "Difficulty breathing",
          "Signs of a stroke, such as face drooping, arm weakness or slurred speech",
          "Severe bleeding that will not stop",
          "Fainting, loss of consciousness or a seizure",
          "A severe allergic reaction, such as swelling of the face or throat",
          "Severe injuries, burns or suspected poisoning",
          "Thoughts of harming yourself or someone else",
        ],
      },
      {
        type: "text",
        heading: "Urgent, but not an emergency",
        body: [
          "If you need to be seen soon but it is not life-threatening, an in-person clinic may be the safest choice, because a doctor online cannot examine you. If you are unsure, an online doctor can help you decide, but do not delay emergency care to wait for an appointment.",
        ],
      },
      {
        type: "text",
        heading: "During an online consultation",
        body: ["If a doctor thinks you need urgent in-person care, they will tell you clearly what to do and help you take the next step."],
      },
    ],
    cta: {
      title: "Not an emergency?",
      body: "You can book an online consultation for non-urgent care.",
      primary: { label: "Get care", href: "/book" },
      secondary: { label: "Clinical governance", href: "/about/clinical-governance" },
    },
    related: ["/about/clinical-governance", "/prepare-for-your-consultation", "/help"],
  },

  "/legal": {
    lead: "The terms, privacy information and consent notices that apply when you use LifeCome Live, in one place.",
    blocks: [
      {
        type: "callout",
        tone: "pending",
        title: "Full documents to be published",
        body: "The full text of each document below is being finalised and will be published here once it has been approved. Until then, this page describes what each one will cover.",
      },
      {
        type: "cards",
        heading: "Our legal and privacy documents",
        cols: 3,
        items: [
          { title: "Terms of use", body: "The rules for using LifeCome Live, including bookings, payments, cancellations and refunds." },
          { title: "Privacy notice", body: "What personal and health information we collect, why, how it is protected, how long we keep it and your rights." },
          { title: "Cookie policy", body: "The cookies and similar technologies we use and how you can control them." },
          { title: "Consent", body: "How we ask for and record your agreement to terms, treatment and record sharing, and how you can change it." },
          { title: "Accessibility", body: "Our commitment to making LifeCome Live usable by everyone, and how to tell us about a problem." },
          { title: "Data requests", body: "How to ask for access to, or correction of, your information." },
        ],
      },
      {
        type: "text",
        heading: "Questions?",
        body: ["If you have questions about privacy or how your information is used, contact us through the support page."],
      },
    ],
    cta: {
      title: "Have a privacy question?",
      body: "Get in touch and we will point you to the right information.",
      primary: { label: "Contact support", href: "/help/support-feedback-complaints" },
      secondary: { label: "Security & data protection", href: "/about/security-and-privacy" },
    },
    related: ["/about/security-and-privacy", "/health-records/who-can-access", "/help"],
  },
};
