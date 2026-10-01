import type { Bodies } from "../types";

export const support: Bodies = {
  "/help": {
    lead: "Answers to common questions about using LifeCome Live. Search below, or contact support if you cannot find what you need.",
    blocks: [
      {
        type: "faq",
        heading: "Help articles",
        searchable: true,
        items: [
          { q: "How do I create an account?", a: "Sign up with your phone number and verify it with the one-time code we send. Then complete your profile." },
          { q: "I did not receive my verification code", a: "Check that your number is correct and that you have network coverage, then request a new code. If it still does not arrive, contact support." },
          { q: "Do I need an HMO to use LifeCome Live?", a: "No. You can pay directly for any consultation. If your HMO participates, you can use it instead." },
          { q: "My HMO is not listed. What can I do?", a: "You can pay directly. We only list an HMO once it has completed onboarding with us." },
          { q: "What does 'requires authorisation' mean?", a: "Your HMO must approve this service before your visit. We send the request for you and show you the status." },
          { q: "How do I pay for a consultation?", a: "Choose a supported payment method at checkout. Your booking is confirmed once the payment is verified, and you receive a receipt." },
          { q: "My payment failed. Was I charged?", a: "You are not charged twice for the same booking. Try again from your booking. If money left your account and the booking is not confirmed, contact support with your reference." },
          { q: "How do I cancel or reschedule?", a: "Open your booking in your account. Refunds follow the cancellation policy shown when you booked." },
          { q: "What do I need for a video consultation?", a: "A phone or computer with a camera and microphone, and a stable connection. You can switch to audio only if needed." },
          { q: "The video is not working. What now?", a: "Check your camera and microphone permissions and your connection. You can continue by audio, and support is available from the consultation screen." },
          { q: "Where do I find my care plan?", a: "In your account, under your care plan and health record, after your consultation." },
          { q: "Who can see my health record?", a: "You, and only the clinicians and providers assigned to your care, with the minimum access they need. Your HMO does not get broad access to your clinical record." },
          { q: "Are my consultations recorded?", a: "No. Consultations are not recorded by default." },
          { q: "Can I use LifeCome Live in an emergency?", a: "No. In an emergency go to the nearest emergency facility or call your local emergency number." },
        ],
      },
      {
        type: "cards",
        heading: "Still need help?",
        cols: 3,
        items: [
          { title: "Contact support", body: "Get help with your account, booking or payment.", href: "/help/support-feedback-complaints" },
          { title: "Emergency guidance", body: "Know when to seek urgent in-person care.", href: "/emergency" },
          { title: "Legal & privacy", body: "Terms, privacy notice and your data choices.", href: "/legal" },
        ],
      },
    ],
    cta: {
      title: "Contact our support team",
      body: "We are here to help with your account, bookings and payments.",
      primary: { label: "Get support", href: "/help/support-feedback-complaints" },
    },
    related: ["/how-it-works", "/access", "/emergency"],
  },

  "/help/support-feedback-complaints": {
    lead: "Need help, want to share feedback or want to raise a complaint? Tell us and we will look into it.",
    blocks: [
      {
        type: "cards",
        heading: "How we can help",
        cols: 3,
        items: [
          { title: "Support", body: "Help with your account, bookings, payments or technical problems." },
          { title: "Feedback", body: "Tell us what is working and what could be better." },
          { title: "Complaints", body: "Raise a concern about your care or your experience. We take every complaint seriously." },
        ],
      },
      {
        type: "text",
        heading: "What to include",
        body: [
          "Tell us what happened, when it happened and your booking reference if you have one. Please do not include sensitive medical details in your first message. We will let you know how to share them securely.",
        ],
      },
      {
        type: "callout",
        tone: "safety",
        title: "In an emergency",
        body: "Do not use support for emergencies. Go to the nearest emergency facility or call your local emergency number.",
      },
    ],
    cta: {
      title: "Contact us",
      body: "We will get back to you as soon as we can.",
      primary: { label: "Send us a message", href: "contact" },
      secondary: { label: "Help centre", href: "/help" },
    },
    related: ["/help", "/about/clinical-governance", "/legal"],
  },
};
