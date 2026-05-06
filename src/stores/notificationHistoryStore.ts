import { atom } from "nanostores";
import type {
  NotificationItem,
  NotificationType,
} from "@/types/notification/Notification";
import { LOCAL_STORAGE_KEYS } from "@/consts/keys/localStorageKeys";

const MAX_HISTORY = 50;
const STORAGE_KEY = LOCAL_STORAGE_KEYS.NOTIFICATION_HISTORY;

const loadInitial = (): NotificationItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NotificationItem[]) : [];
  } catch {
    return [];
  }
};

const persist = (items: NotificationItem[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or disabled — silently ignore
  }
};

export const $notificationHistory = atom<NotificationItem[]>(loadInitial());

const setAndPersist = (items: NotificationItem[]) => {
  $notificationHistory.set(items);
  persist(items);
};

export const addNotification = (
  type: NotificationType,
  title: string,
  message?: string,
) => {
  const item: NotificationItem = {
    id: crypto.randomUUID(),
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
  };
  const next = [item, ...$notificationHistory.get()].slice(0, MAX_HISTORY);
  setAndPersist(next);
};

export const markAllRead = () => {
  setAndPersist(
    $notificationHistory.get().map((n) => ({ ...n, read: true })),
  );
};

export const markRead = (id: string) => {
  setAndPersist(
    $notificationHistory.get().map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  );
};

export const removeNotification = (id: string) => {
  setAndPersist($notificationHistory.get().filter((n) => n.id !== id));
};

export const clearAllNotifications = () => {
  setAndPersist([]);
};
