"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { DemoNotification } from "@/lib/demo/notifications";
import { notificationsColumns } from "@/features/notifications/components/notifications-columns";

export function NotificationsTable({
  notifications,
}: {
  notifications: DemoNotification[];
}) {
  return (
    <DataTable
      columns={notificationsColumns}
      data={notifications}
      searchPlaceholder="Search notifications by title or audience"
    />
  );
}
