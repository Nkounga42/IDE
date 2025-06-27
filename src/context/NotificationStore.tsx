// src/context/NotificationStore.ts
import type { Notification } from "./NotificationContext";

let addNotification: ((notif: Omit<Notification, "id">) => void) | null = null;

export const setNotificationHandler = (handler: (notif: Omit<Notification, "id">) => void) => {
  addNotification = handler;
};

// Anti-duplication simple
let lastNotificationKey: string | null = null;

export const PushNotification = (notif: Omit<Notification, "id">) => {
  const key = notif.title + notif.message;

  if (key === lastNotificationKey) return;

  lastNotificationKey = key;

  if (addNotification) {
    addNotification(notif);
  } else {
    console.warn("Notification system not initialized yet.");
  }

  // Reset anti-spam après 3s
  setTimeout(() => {
    lastNotificationKey = null;
  }, 300);
};
