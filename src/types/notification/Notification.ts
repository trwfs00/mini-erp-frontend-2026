export type NotificationType = "success" | "error" | "info" | "warning";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
  read: boolean;
};
