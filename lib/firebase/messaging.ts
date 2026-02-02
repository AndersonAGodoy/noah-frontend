// lib/firebase/messaging.ts
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";
import { app } from "./config";

let messaging: Messaging | null = null;

// Inicializar apenas no cliente
if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
}

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) {
    console.warn("Firebase Messaging not available");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token obtained:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
}

export function onMessageListener() {
  if (!messaging) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging!, (payload) => {
      console.log("Message received:", payload);
      resolve(payload);
    });
  });
}

export { messaging };
