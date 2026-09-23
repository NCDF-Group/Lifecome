/**
 * Demo sent notifications standing in for `GET /api/v1/notifications`
 * (Lifecome-backend's `notifications` module).
 */
export type DemoNotification = {
  id: string;
  title: string;
  audience: string;
  channel: "push" | "email" | "sms";
  sentAt: string;
  deliveryRate: number;
};

export const demoNotifications: DemoNotification[] = [
  {
    id: "notif-001",
    title: "New lab result",
    audience: "Ngozi Adeyemi",
    channel: "push",
    sentAt: "2026-09-23T03:00:00+01:00",
    deliveryRate: 100,
  },
  {
    id: "notif-002",
    title: "Appointment reminder — tomorrow 10:00 AM",
    audience: "All patients with a booking tomorrow",
    channel: "push",
    sentAt: "2026-09-22T18:00:00+01:00",
    deliveryRate: 98,
  },
  {
    id: "notif-003",
    title: "Scheduled maintenance, Sunday 2–4am",
    audience: "All users",
    channel: "email",
    sentAt: "2026-09-20T09:00:00+01:00",
    deliveryRate: 94,
  },
  {
    id: "notif-004",
    title: "Your HMO membership is confirmed",
    audience: "Ada Okonkwo",
    channel: "sms",
    sentAt: "2026-09-14T11:20:00+01:00",
    deliveryRate: 100,
  },
];
