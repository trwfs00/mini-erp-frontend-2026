import { $has401Error } from "@/stores/has401ErrorStore";
import { addNotification } from "@/stores/notificationHistoryStore";
import { notifications } from "@mantine/notifications";
import classesError from "./css/CustomNotificationError.module.css";
import classesInfo from "./css/CustomNotificationInfo.module.css";
import classesSuccess from "./css/CustomNotificationSuccess.module.css";
import classesWarning from "./css/CustomNotificationWarning.module.css";
import {
  IconCheck,
  IconError,
  IconInfo,
  IconWarning,
} from "./NotificationIcons";

type NotificationParams = {
  title?: string;
  message?: string;
  time?: number;
};

type ActiveErrorNotification = {
  id: string;
  errorCode: string; // Store error code directly
};

// Deduplicate notifications for error codes "00000" and "01004"
// Also deduplicate all session-related notifications (from TokenTimer, API errors, etc.)
const ERROR_00000_TRANSLATIONS = new Set<string>(
  Object.values("An error occurred. Please try again"),
);
const ERROR_01004_TRANSLATIONS = new Set<string>([
  ...Object.values("Session expired. Please log in again."),
  ...Object.values("Authentication failed"),
  ...Object.values("Session has expired"),
]);
const activeErrorNotifications: ActiveErrorNotification[] = [];

// Map error title to error code
const getErrorCodeFromTitle = (title: string): string | null => {
  if (ERROR_00000_TRANSLATIONS.has(title)) return "00000";
  if (ERROR_01004_TRANSLATIONS.has(title)) return "01004";
  return null;
};

// Remove error notification from active list by ID
const removeErrorNotification = (id: string): void => {
  const index = activeErrorNotifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    activeErrorNotifications.splice(index, 1);
  }
};

// Reset error tracking when non-error notification is shown
const resetErrorTracking = (): void => {
  activeErrorNotifications.length = 0;
};

export const NotificationUtil = {
  notifySuccess(
    { title, message, time }: NotificationParams = {
      title: "Success",
    },
  ) {
    resetErrorTracking();
    notifications.show({
      title,
      message,
      icon: IconCheck,
      color: "success",
      classNames: classesSuccess,
      autoClose: time,
    });
    addNotification("success", title ?? "Success", message);
  },
  notifyError({ title, message, time }: NotificationParams) {
    const errorCode = title ? getErrorCodeFromTitle(title) : null;

    // Block error "00000" notifications if 401 error has occurred OR if session error is active
    // This prevents confusing "An error occurred" messages when session expired
    const hasActiveSessionError = activeErrorNotifications.some(
      (n) => n.errorCode === "01004",
    );
    if (errorCode === "00000" && (hasActiveSessionError || $has401Error.get()))
      return;

    const id = crypto.randomUUID();

    // CRITICAL: For tracked error codes, add to array FIRST (atomic operation)
    if (errorCode) {
      // Add this notification to tracking
      activeErrorNotifications.push({
        id,
        errorCode,
      });

      // Count how many notifications with same error code exist
      // If more than 1 (current one + others), it means duplicate → remove and return
      const sameErrorCount = activeErrorNotifications.filter(
        (n) => n.errorCode === errorCode,
      ).length;

      if (sameErrorCount > 1) {
        // Duplicate detected, remove this one and don't show notification
        removeErrorNotification(id);
        return;
      }

      // CRITICAL: If this is a session error (01004), remove all generic errors (00000)
      // This handles the case where generic errors were shown before session error
      if (errorCode === "01004") {
        const genericErrorIds = activeErrorNotifications
          .filter((n) => n.errorCode === "00000")
          .map((n) => n.id);
        genericErrorIds.forEach((genericId) => {
          removeErrorNotification(genericId);
          notifications.hide(genericId); // Hide the notification from UI
        });
      }
    }

    notifications.show({
      id,
      title,
      message,
      icon: IconError,
      color: "danger",
      classNames: classesError,
      autoClose: time,
      onClose: () => {
        removeErrorNotification(id);
      },
    });
    addNotification("error", title ?? "Error", message);
  },
  notifyInfo({ title, message, time }: NotificationParams) {
    resetErrorTracking();
    notifications.show({
      title,
      message,
      icon: IconInfo,
      color: "info",
      classNames: classesInfo,
      autoClose: time,
    });
    addNotification("info", title ?? "Info", message);
  },
  notifyWarning({ title, message, time }: NotificationParams) {
    resetErrorTracking();
    notifications.show({
      title,
      message,
      icon: IconWarning,
      color: "warning",
      classNames: classesWarning,
      autoClose: time,
    });
    addNotification("warning", title ?? "Warning", message);
  },
};
