import type { Bodies } from "../types";

const notForEmergencies = {
  type: "callout",
  tone: "safety",
  title: "LifeCome Live is not for emergencies",
  body: "If you or someone else is in danger or needs urgent in-person care, go to the nearest emergency facility or call your local emergency number. Do not wait for an online appointment.",
} as const;

export const core: Bodies = {
  "/how-it-works": {
    lead: "LifeCome Live takes you from your first question to ongoing care in one connected journey. Whether you use your HMO or pay directly, your consultation, care plan and health record work the same way.",
    image: { src: "/images/hero.webp", alt: "A woman smiling as she uses her phone at home", fade: 42 },
    blocks: [
      {
        type: "steps",
        heading: "Your journey, step by step",
        items: [
          { title: "Create your account", body: "Sign up with your phone number and verify it with a one-time code.", icon: "user-plus" },
          { title: "Choose how to pay", body: "Use your HMO where it is accepted, or pay directly. You can change your mind before you confirm.", icon: "wallet" },
          { title: "Choose a service", body: "Pick the kind of care you need, such as a GP consultation, follow-up or results review.", icon: "clipboard-list" },
          { title: "Find a doctor and a time", body: "Search by specialty, language and availability, then choose a slot that suits you.", icon: "calendar" },
          { title: "Tell us about your visit", body: "Share your concern and any documents so your doctor is prepared before you connect.", icon: "file-text" },
          { title: "Confirm your booking", body: "Your HMO authorisation or your payment is completed, and you see any costs before you confirm.", icon: "shield-check" },
          { title: "See your doctor", body: "Check your camera and microphone in the waiting room, then consult by video or audio.", icon: "video" },
          { title: "Follow your care plan", body: "Receive your visit summary and next steps, then message your care team or book follow-up care.", icon: "clipboard-check" },
        ],
      },
      {
        type: "text",
        heading: "One record, however you pay",
        body: [
          "Paying with an HMO or paying directly only changes how your visit is funded. It does not change your doctor, your consultation, your care plan or your health record.",
          "If your HMO cannot cover a particular visit, you can pay directly for that visit without starting again or creating a second account.",
        ],
      },
      {
        type: "cards",
        heading: "Ways to consult",
        cols: 3,
        items: [
          { title: "Video", body: "Talk face to face with your doctor from your phone or computer." },
          { title: "Audio", body: "If your connection is weak or you prefer not to be on camera, switch to audio only." },
          { title: "Messages", body: "After your visit, message your care team securely about your care plan." },
        ],
      },
      notForEmergencies,
      {
        type: "faq",
        items: [
          { q: "Do I need an HMO to use LifeCome Live?", a: "No. You can pay directly for any consultation. If you have a participating HMO you can use it instead." },
          { q: "What do I need for a video consultation?", a: "A phone or computer with a camera and microphone and a reasonably stable internet connection. If video is not working, you can continue by audio." },
          { q: "Are consultations recorded?", a: "No. Consultations are not recorded by default. We keep the details of the session, not the video or audio." },
          { q: "Where can I see what my doctor advised?", a: "In your care plan and visit summary, which are added to your health record after your consultation." },
        ],
      },
    ],
    related: ["/access", "/services", "/care-plan", "/health-records"],
  },
};
