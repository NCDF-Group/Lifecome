import type { Bodies } from "../types";

export const care: Bodies = {
  "/doctors": {
    lead: "Find a doctor who fits your needs by specialty, language and availability, and see what they offer before you book.",
    blocks: [
      {
        type: "cards",
        heading: "Search the way you want",
        cols: 4,
        items: [
          { title: "Specialty", body: "Find a general practitioner or a specialist for your concern." },
          { title: "Language", body: "Choose a doctor who speaks your language." },
          { title: "Availability", body: "See who has a time that suits you, in your own time zone." },
          { title: "Your payment route", body: "Results reflect whether you are using your HMO or paying directly." },
        ],
      },
      {
        type: "checklist",
        heading: "On every doctor profile",
        items: [
          "Verified credentials and specialty",
          "Languages spoken",
          "Services offered and consultation modes",
          "The consultation fee",
          "Upcoming availability",
        ],
      },
      {
        type: "text",
        heading: "Searching happens in your account",
        body: ["Doctor search and booking take place in your secure LifeCome Live account so that availability and cover are always up to date."],
      },
    ],
    cta: {
      title: "Find your doctor",
      body: "Start a booking to search available doctors.",
      primary: { label: "Book a consultation", href: "/book" },
      secondary: { label: "Meet our clinical team", href: "/about/doctors-and-clinical-team" },
    },
    related: ["/about/doctors-and-clinical-team", "/book", "/prepare-for-your-consultation"],
  },

  "/book": {
    lead: "Book an online consultation in a few minutes. Choose how you would like to pay, pick a doctor and a time, and you are set.",
    blocks: [
      {
        type: "cards",
        heading: "First, choose how to pay",
        cols: 2,
        items: [
          { title: "Use my HMO", body: "Verify your membership and see your cover before you book.", href: "/access/use-your-hmo" },
          { title: "Pay directly", body: "See the price up front and pay securely.", href: "/access/pay-directly" },
        ],
      },
      {
        type: "steps",
        heading: "Then, in your account",
        items: [
          { title: "Choose a service", body: "GP consultation, follow-up, results review and more." },
          { title: "Pick a doctor and time", body: "Search by specialty, language and availability." },
          { title: "Tell us about your visit", body: "Your concern, how long you have had it, and any documents." },
          { title: "Confirm", body: "Complete HMO authorisation or payment and receive your confirmation." },
        ],
      },
      {
        type: "callout",
        tone: "safety",
        title: "Not for emergencies",
        body: "If you need urgent in-person care, go to the nearest emergency facility or call your local emergency number.",
      },
    ],
    cta: {
      title: "Ready to book?",
      body: "Booking is completed inside your LifeCome Live account.",
      primary: { label: "Sign in to book", href: "app" },
      secondary: { label: "How it works", href: "/how-it-works" },
    },
    related: ["/doctors", "/prepare-for-your-consultation", "/access/pricing-and-payments"],
  },

  "/prepare-for-your-consultation": {
    lead: "A little preparation helps you get the most out of your time with your doctor.",
    blocks: [
      {
        type: "checklist",
        heading: "Before you connect",
        items: [
          "Find a quiet, private place with good lighting",
          "Check your internet connection, and charge your device",
          "Allow camera and microphone access when asked",
          "Have your list of medicines and any allergies ready",
          "Write down your symptoms, when they started and your questions",
          "Upload relevant documents, such as previous results or prescriptions",
        ],
      },
      {
        type: "text",
        heading: "The waiting room",
        body: [
          "Around your appointment time you can enter the waiting room to test your camera, microphone and connection. You will see when your doctor is joining. If something is not working, help is available from the same screen.",
        ],
      },
      {
        type: "callout",
        tone: "safety",
        title: "If your symptoms become severe",
        body: "Do not wait for your appointment. Go to the nearest emergency facility or call your local emergency number.",
      },
    ],
    related: ["/your-consultation", "/after-your-consultation", "/emergency"],
  },

  "/your-consultation": {
    lead: "What to expect during your online consultation.",
    blocks: [
      {
        type: "steps",
        heading: "During your visit",
        items: [
          { title: "Join", body: "Your doctor joins from the waiting room and you are connected." },
          { title: "Talk", body: "Explain your concern and answer your doctor's questions." },
          { title: "Decide together", body: "Your doctor explains what they think is happening and your options." },
          { title: "Close", body: "Your doctor summarises next steps before the call ends." },
        ],
      },
      {
        type: "cards",
        heading: "If something goes wrong",
        cols: 3,
        items: [
          { title: "Your connection drops", body: "You are reconnected automatically where possible, and you can continue by audio." },
          { title: "Your doctor is late", body: "You see your status in the waiting room and are notified when your doctor joins." },
          { title: "You need help", body: "Contact support from the consultation screen without leaving your visit." },
        ],
      },
      {
        type: "text",
        heading: "Privacy",
        body: ["Consultations are not recorded by default. Text chat during the call is kept only as long as our retention rules allow."],
      },
    ],
    related: ["/prepare-for-your-consultation", "/after-your-consultation", "/about/security-and-privacy"],
  },

  "/after-your-consultation": {
    lead: "Your care continues after the call. Here is what happens next.",
    blocks: [
      {
        type: "steps",
        heading: "After your visit",
        items: [
          { title: "Visit summary", body: "Your doctor's summary and advice are added to your record." },
          { title: "Care plan", body: "You receive clear next steps, updated as your care continues." },
          { title: "Prescriptions & referrals", body: "Any prescriptions, tests or referrals your doctor arranged appear in your account." },
          { title: "Follow-up", body: "Book a follow-up, or message your care team with questions." },
        ],
      },
      {
        type: "text",
        heading: "Notifications",
        body: [
          "We notify you when your care plan is ready, a result has been reviewed or a follow-up is due. To protect your privacy, text messages and push notifications do not contain clinical details.",
        ],
      },
    ],
    related: ["/care-plan", "/health-records", "/services/follow-up-care"],
  },
};
