import type { Bodies } from "../types";

const notForEmergencies = {
  type: "callout",
  tone: "safety",
  title: "Not for emergencies",
  body: "If you have severe symptoms or think your life is at risk, go to the nearest emergency facility or call your local emergency number instead of booking online.",
} as const;

export const services: Bodies = {
  "/services": {
    lead: "Everything you need for everyday healthcare, from a first consultation to results, referrals and medicines, connected through one care plan and one health record.",
    image: { src: "/images/services-overview.webp", alt: "A desk with a stethoscope, smartphone, tablet and a plant", fade: 30 },
    blocks: [
      {
        type: "cards",
        heading: "What we offer",
        cols: 3,
        items: [
          { title: "Online GP consultations", body: "See a doctor about a new or general health concern.", href: "/services/online-gp-consultations" },
          { title: "Follow-up care", body: "Continue your care after an initial consultation.", href: "/services/follow-up-care" },
          { title: "Results review", body: "A clinician reviews your test results and explains them.", href: "/services/results-review" },
          { title: "Referrals & coordinated care", body: "Onward care through our network of providers.", href: "/services/referrals-coordinated-care" },
          { title: "Laboratory tests & diagnostics", body: "Book and follow up tests and diagnostics.", href: "/services/laboratory-tests-diagnostics" },
          { title: "Prescriptions & medicines", body: "Prescribing and pharmacy coordination.", href: "/services/prescriptions-medicines" },
        ],
      },
      {
        type: "text",
        heading: "How the services fit together",
        body: [
          "Each service feeds into the same care plan and health record, so a referral, a test or a prescription is never a separate, disconnected step.",
          "Which services are covered when you use an HMO depends on your plan. You can check service-level cover before you book.",
        ],
      },
      notForEmergencies,
    ],
    related: ["/how-it-works", "/access", "/doctors"],
  },

  "/services/online-gp-consultations": {
    lead: "Talk to a doctor by video or audio about a new or general health concern, and leave with clear advice and a written care plan.",
    image: { src: "/images/service-consultation.webp", alt: "A friendly doctor waving during an online video consultation", fade: 38 },
    blocks: [
      {
        type: "checklist",
        heading: "Common reasons to book",
        items: [
          "A new symptom you would like a doctor to look at",
          "Ongoing concerns you want to talk through",
          "Advice on what to do next, including whether you need tests",
          "A prescription or referral, where a doctor decides it is appropriate",
          "A second conversation about something you have already been told",
          "General health questions for you or someone in your care",
        ],
      },
      {
        type: "steps",
        heading: "How it works",
        items: [
          { title: "Book", body: "Choose a doctor and a time, and tell us about your concern." },
          { title: "Connect", body: "Join the waiting room, check your camera and microphone, and speak to your doctor." },
          { title: "Get your plan", body: "Receive a visit summary with advice and next steps." },
          { title: "Follow up", body: "Message your care team or book a follow-up if you need one." },
        ],
      },
      {
        type: "text",
        heading: "What an online consultation can and cannot do",
        body: [
          "Online consultations work well for many concerns, but a doctor cannot examine you in person. If your doctor thinks you need a physical examination, tests or urgent care, they will tell you and help arrange it.",
        ],
      },
      notForEmergencies,
      {
        type: "faq",
        items: [
          { q: "How long is a consultation?", a: "The length depends on the service you book. The duration is shown on the doctor's profile and in your booking summary before you confirm." },
          { q: "Can I use my HMO?", a: "Yes, where your HMO is participating and your plan covers the service. Cover is checked before you confirm your booking." },
          { q: "Will I get a written summary?", a: "Yes. Your visit summary and care plan are added to your health record after the consultation." },
        ],
      },
    ],
    related: ["/services/follow-up-care", "/prepare-for-your-consultation", "/access"],
  },

  "/services/follow-up-care": {
    lead: "Care does not end when the call does. Follow-up consultations let you and your doctor check progress and adjust your care plan.",
    image: { src: "/images/follow-up.webp", alt: "A woman in a headwrap smiling at her phone at a kitchen table", fade: 26, position: "50% 0%" },
    blocks: [
      {
        type: "checklist",
        heading: "When to book a follow-up",
        items: [
          "Your doctor recommended a review after a set time",
          "Your symptoms have changed or have not improved",
          "You want to talk through test results or a referral outcome",
          "You need to update your care plan",
        ],
      },
      {
        type: "text",
        heading: "Continuity built in",
        body: [
          "Your doctor can see your previous visit summaries and care plan, subject to the access rules on your health record, so you do not have to explain everything again.",
          "For quick questions about your plan, you can also message your care team from your account.",
        ],
      },
      {
        type: "faq",
        items: [
          { q: "Do I have to see the same doctor?", a: "You can choose the doctor who saw you before, or another doctor in the network. Either way, your care plan and record stay with you." },
          { q: "Is a follow-up covered by my HMO?", a: "That depends on your plan. Cover is checked before you confirm, the same as any other service." },
        ],
      },
    ],
    related: ["/services/online-gp-consultations", "/care-plan", "/health-records"],
  },

  "/services/results-review": {
    lead: "Get a clinician to review your test and diagnostic results, explain what they mean and agree next steps.",
    blocks: [
      {
        type: "steps",
        heading: "How results review works",
        items: [
          { title: "Bring your results", body: "Results arrive from a network provider, or you upload your own documents." },
          { title: "Clinician review", body: "A doctor reviews them, and each result shows whether it has been reviewed." },
          { title: "Discuss", body: "Talk through what the results mean in a consultation." },
          { title: "Next steps", body: "Your plan is updated with any follow-up, treatment or referral." },
        ],
      },
      {
        type: "text",
        heading: "You can see the review status",
        body: [
          "Every result in your health record shows where it came from, when it arrived and whether a clinician has reviewed it, so you always know what is still awaiting review.",
        ],
      },
    ],
    related: ["/services/laboratory-tests-diagnostics", "/health-records", "/services/follow-up-care"],
  },

  "/services/referrals-coordinated-care": {
    lead: "When you need care beyond an online consultation, your doctor can refer you to trusted providers and keep the whole journey connected.",
    image: { src: "/images/service-family.webp", alt: "A mother and daughter smiling and hugging on a sofa", fade: 24 },
    blocks: [
      {
        type: "steps",
        heading: "How referrals work",
        items: [
          { title: "Your doctor recommends", body: "If in-person or specialist care is needed, your doctor explains why and what to expect." },
          { title: "We coordinate", body: "Your care coordinator helps connect you with an appropriate provider in the network." },
          { title: "Shared context", body: "The provider receives the relevant part of your record, with your consent and only what they need." },
          { title: "Results come back", body: "Outcomes are added to your record so your LifeCome Live doctor can follow up." },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Cover for onward care",
        body: "Whether an HMO covers onward care depends on your plan and the provider. Your care team can help you understand this before you go.",
      },
    ],
    related: ["/provider-network", "/care-plan", "/health-records/who-can-access"],
  },

  "/services/laboratory-tests-diagnostics": {
    lead: "Your doctor can order tests and diagnostics, and LifeCome Live helps coordinate them with laboratories and imaging providers in the network.",
    image: { src: "/images/service-diagnostics.webp", alt: "A laboratory scientist looking through a microscope", fade: 24 },
    blocks: [
      {
        type: "steps",
        heading: "From order to results",
        items: [
          { title: "Ordered by your doctor", body: "Tests are requested when a doctor decides they are clinically appropriate." },
          { title: "Arranged with a provider", body: "You are guided to a laboratory or diagnostic provider in the network." },
          { title: "Results received", body: "Results are added to your health record with the provider, date and review status." },
          { title: "Reviewed with you", body: "A clinician reviews your results and agrees next steps with you." },
        ],
      },
      {
        type: "text",
        heading: "Access is limited to the order",
        body: ["A laboratory sees only the order and the context it needs, and only for a limited time. It does not get your full record."],
      },
    ],
    related: ["/services/results-review", "/provider-network", "/health-records"],
  },

  "/services/prescriptions-medicines": {
    lead: "When your doctor decides medication is appropriate, they can issue a prescription and LifeCome Live helps you coordinate with a pharmacy.",
    image: { src: "/images/service-prescriptions.webp", alt: "Hands holding a prescription and a box of medicine", fade: 30 },
    blocks: [
      {
        type: "text",
        heading: "How prescribing works",
        body: [
          "Doctors prescribe only when it is clinically appropriate, and some medicines cannot be prescribed through an online consultation. Your doctor will explain your options and any instructions.",
          "Your prescriptions are saved in your health record with the doctor who issued them and the date.",
        ],
      },
      {
        type: "checklist",
        heading: "Before your consultation",
        items: [
          "List any medicines you take now, including over-the-counter and herbal products",
          "Note any allergies or past reactions to medicines",
          "Tell your doctor if you are pregnant, breastfeeding or planning to become pregnant",
          "Have your usual pharmacy in mind, if you have one",
        ],
      },
      notForEmergencies,
    ],
    related: ["/services/online-gp-consultations", "/care-plan", "/provider-network"],
  },
};
