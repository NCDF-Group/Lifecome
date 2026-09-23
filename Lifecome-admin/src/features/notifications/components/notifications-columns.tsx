import type { ColumnDef } from "@tanstack/react-table";
import type { DemoNotification } from "@/lib/demo/notifications";
import { StatusPill } from "@/components/shared/status-pill";

const channelLabel: Record<DemoNotification["channel"], string> = {
  push: "Push",
  email: "Email",
  sms: "SMS",
};

export const notificationsColumns: ColumnDef<DemoNotification, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) => (
      <span className="font-medium text-ink">
        {info.getValue() as string}
      </span>
    ),
  },
  { accessorKey: "audience", header: "Audience" },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: (info) => channelLabel[info.getValue() as DemoNotification["channel"]],
  },
  {
    accessorKey: "sentAt",
    header: "Sent",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "deliveryRate",
    header: "Delivered",
    cell: (info) => {
      const rate = info.getValue() as number;
      return (
        <StatusPill
          tone={rate >= 98 ? "success" : rate >= 90 ? "warning" : "destructive"}
          label={`${rate}%`}
        />
      );
    },
  },
];
