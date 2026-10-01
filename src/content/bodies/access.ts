import type { Bodies } from "../types";

export const access: Bodies = {
  "/access": {
    lead: "Choose the way that works for you. However you pay, you get the same doctors, the same consultation and the same care plan and health record.",
    image: { src: "/images/access-overview.webp", alt: "A man smiling at his phone at a sunny café table", fade: 24, position: "50% 15%" },
    blocks: [
      {
        type: "cards",
        heading: "Ways to access LifeCome Live",
        cols: 3,
        items: [
          { title: "Use your HMO", body: "Verify your membership and see what your plan covers before you book.", href: "/access/use-your-hmo" },
          { title: "Pay directly", body: "See the price up front, pay securely and receive a receipt.", href: "/access/pay-directly" },
          { title: "Through your organisation", body: "Employer and sponsored access for teams and organisations.", href: "/partners/organisations" },
        ],
      },
      {
        type: "text",
        heading: "One patient, one record",
        body: [
          "You register once. Switching between your HMO and paying directly does not create a second account or split your health record.",
        ],
      },
    ],
    related: ["/access/participating-hmos", "/access/check-your-cover", "/access/pricing-and-payments"],
  },

  "/access/use-your-hmo": {
    lead: "If your HMO participates in LifeCome Live, you can use your membership to fund eligible consultations. Your HMO decides what is covered, and we show you the result before you confirm.",
    image: { src: "/images/hmo.webp", alt: "A woman holding a membership card and her phone at a desk at home", fade: 24, position: "50% 0%" },
    blocks: [
      {
        type: "steps",
        heading: "Using your HMO",
        items: [
          { title: "Select your HMO", body: "Search the list of participating HMOs." },
          { title: "Verify your membership", body: "Enter your member details. Your HMO confirms them." },
          { title: "See your cover", body: "View your plan and which LifeCome Live services it covers." },
          { title: "Confirm your visit", body: "If authorisation is needed it is requested for you, and you see any co-payment before you confirm." },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Your HMO makes the coverage decision",
        body: "Cover, authorisation and co-payments come from your HMO or its contracted rules. LifeCome Live shows you the result and cannot guarantee cover.",
      },
      {
        type: "text",
        heading: "If your HMO cannot cover a visit",
        body: [
          "If your membership cannot be verified, the service is not covered or a benefit limit has been reached, you can pay directly for that visit and keep the same account and record.",
        ],
      },
    ],
    related: ["/access/participating-hmos", "/access/check-your-cover", "/access/using-health-insurance"],
  },

  "/access/participating-hmos": {
    lead: "The HMOs and health plans you can use with LifeCome Live.",
    image: { src: "/images/hmos.webp", alt: "Two professionals shaking hands across a table in a modern office", fade: 22, position: "50% 10%" },
    blocks: [
      { type: "hmo-directory" },
      {
        type: "text",
        heading: "Do not see your HMO?",
        body: [
          "You can pay directly for any consultation. If you would like your HMO to participate, ask them to get in touch, or share their details with us.",
        ],
      },
    ],
    cta: {
      title: "Are you an HMO or health plan?",
      body: "Find out how to become a participating payer on LifeCome Live.",
      primary: { label: "Partner with us", href: "/partners/hmos" },
      secondary: { label: "Pay directly instead", href: "/access/pay-directly" },
    },
    related: ["/access/use-your-hmo", "/access/check-your-cover"],
  },

  "/access/check-your-cover": {
    lead: "Check your HMO membership and what your plan covers on LifeCome Live before you book.",
    image: { src: "/images/check-cover.webp", alt: "A man smiling at his phone on a sofa at home", fade: 20, position: "50% 0%" },
    blocks: [
      {
        type: "steps",
        heading: "How to check your cover",
        items: [
          { title: "Sign in", body: "Cover is checked inside your secure account, not on this public website." },
          { title: "Select your HMO", body: "Choose your HMO from the participating list." },
          { title: "Verify", body: "Provide your member ID and details so your HMO can confirm your membership." },
          { title: "See the result", body: "Each service shows whether it is covered, needs authorisation or is not covered." },
        ],
      },
      {
        type: "table",
        heading: "What the results mean",
        columns: ["Result", "What it means"],
        rows: [
          ["Covered", "Your plan covers this service. You pay nothing unless a co-payment is shown."],
          ["Co-payment", "Your plan covers part of the cost. You pay the difference before you confirm."],
          ["Requires authorisation", "Your HMO needs to approve the visit first. We request it for you."],
          ["Not covered", "Your plan does not cover this service. You can pay directly."],
          ["Benefit limit reached", "You have used the allowance for this service. You can pay directly."],
          ["HMO unavailable", "We could not reach your HMO. Try again later or pay directly."],
        ],
      },
      {
        type: "callout",
        tone: "pending",
        title: "Your details are protected",
        body: "We only share the details your HMO needs to verify your membership and decide on cover. Your clinical record is not shared with your HMO.",
      },
    ],
    cta: {
      title: "Check your cover in your account",
      body: "Sign in to verify your membership.",
      primary: { label: "Sign in", href: "app" },
      secondary: { label: "How HMO access works", href: "/access/use-your-hmo" },
    },
    related: ["/access/using-health-insurance", "/access/participating-hmos"],
  },

  "/access/using-health-insurance": {
    lead: "What to expect when you use your health insurance on LifeCome Live: authorisation, exclusions and co-payments.",
    blocks: [
      {
        type: "text",
        heading: "Authorisation",
        body: [
          "Some services need your HMO's approval before your visit. When that is the case, we send the request for you and show you its status: pending, approved, declined or expired.",
          "If your HMO needs more information, we tell you what is missing.",
        ],
      },
      {
        type: "table",
        heading: "Authorisation status",
        columns: ["Status", "What happens next"],
        rows: [
          ["Not required", "You can book straight away."],
          ["Pending", "Your HMO is reviewing the request. We notify you when there is a decision."],
          ["Approved", "Your booking can be confirmed."],
          ["Declined", "You can pay directly, or contact your HMO about its decision."],
          ["Expired", "The approval is no longer valid. We can request it again."],
          ["More information needed", "We tell you what your HMO needs, so you can provide it."],
        ],
      },
      {
        type: "text",
        heading: "Exclusions and co-payments",
        body: [
          "Your plan may exclude some services or require you to pay part of the cost. Any amount you owe is shown before you confirm your booking, never afterwards.",
        ],
      },
    ],
    related: ["/access/check-your-cover", "/access/pay-directly", "/access/pricing-and-payments"],
  },

  "/access/pay-directly": {
    lead: "No HMO? Pay for your consultation yourself. You see the price first, pay securely and get a receipt.",
    blocks: [
      {
        type: "steps",
        heading: "Paying directly",
        items: [
          { title: "Choose your doctor and time", body: "The price for the service is shown on the doctor's profile." },
          { title: "Review your booking", body: "Check the doctor, service, time and amount before you pay." },
          { title: "Pay securely", body: "Pay with a supported payment method through our payment provider." },
          { title: "Get confirmation", body: "Your booking is confirmed once your payment is verified, and you receive a receipt." },
        ],
      },
      {
        type: "checklist",
        heading: "What you can expect",
        items: [
          "The amount is set by us, never by your device",
          "Your booking is confirmed only after your payment is verified",
          "A receipt is issued for every payment",
          "Clear refund status if a visit is cancelled",
        ],
      },
    ],
    related: ["/access/pricing-and-payments", "/access/use-your-hmo", "/book"],
  },

  "/access/pricing-and-payments": {
    lead: "How consultation prices, payments, receipts and refunds work on LifeCome Live.",
    blocks: [
      {
        type: "text",
        heading: "Pricing",
        body: [
          "Consultation prices depend on the service and the doctor. The price is always shown on the doctor's profile and again in your booking summary before you pay.",
        ],
      },
      {
        type: "table",
        heading: "Payments and receipts",
        columns: ["Topic", "How it works"],
        rows: [
          ["Payment methods", "Supported methods are shown at checkout, such as cards and bank transfer."],
          ["Confirmation", "Your booking is marked as paid only after your payment has been verified."],
          ["Receipts", "Every payment has a receipt number linked to your booking."],
          ["HMO-covered visits", "You pay nothing unless a co-payment or shortfall applies, which is shown first."],
          ["Failed payments", "You can try again safely. You are not charged twice for the same booking."],
        ],
      },
      {
        type: "table",
        heading: "Refunds",
        intro: "Refunds follow the cancellation policy shown when you book.",
        columns: ["Status", "Meaning"],
        rows: [
          ["Refunded", "The full amount has been returned to you."],
          ["Partially refunded", "Part of the amount has been returned, according to the policy."],
          ["Cancelled", "The payment was cancelled before it was completed."],
        ],
      },
    ],
    related: ["/access/pay-directly", "/access/using-health-insurance", "/help"],
  },
};
