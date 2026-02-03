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
    // console.error("Error initializing Firebase Messaging:", error);
  }
}

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) {
    // console.warn("Firebase Messaging not available");
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  if (!("serviceWorker" in navigator)) {
    // console.warn("Service Worker not supported in this browser");
    return null;
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    // console.warn("NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // console.log("✅ Notification permission granted");
      // console.log("🔑 Using VAPID key:", vapidKey.substring(0, 20) + "...");

      // Verificar service workers existentes
      const existingRegistrations =
        await navigator.serviceWorker.getRegistrations();
      // console.log("📋 Existing service workers:", existingRegistrations.length);

      // Desregistrar service workers antigos que podem estar causando conflito
      for (const registration of existingRegistrations) {
        // console.log("🗑️ Unregistering old service worker:", registration.scope);
        await registration.unregister();
      }

      // Registrar o service worker do Firebase
      // console.log("📝 Registering Firebase service worker...");
      let registration: ServiceWorkerRegistration;

      try {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/",
            type: "classic",
          },
        );
        // console.log("✅ Service Worker registered successfully");
        // console.log("📍 SW Scope:", registration.scope);
        // console.log("📍 SW State:", registration.active?.state);

        // Aguardar o service worker estar pronto e ativo
        await navigator.serviceWorker.ready;
        // console.log("✅ Service Worker is ready");

        // Aguardar um pouco para garantir que está completamente ativo
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (swError) {
        // console.error("❌ Service Worker registration failed:", swError);
        return null;
      }

      // Agora solicitar o token FCM com o service worker registration
      // console.log("🔄 Requesting FCM token...");
      // // console.log("🔍 SW Registration for FCM:", registration);
      // // console.log(
      //   "🔍 Messaging Sender ID:",
      //   process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      // );
      // console.log("🔍 App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

      try {
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        // console.log("✅ FCM Token obtained:", token);
        return token;
      } catch (tokenError) {
        // console.error("❌ Failed to get FCM token:", tokenError);

        if (tokenError instanceof Error) {
          // console.error("Token Error Details:");
          // console.error("  - Name:", tokenError.name);
          // console.error("  - Message:", tokenError.message);
          // console.error("  - Stack:", tokenError.stack);
          // Mensagens de erro comuns e suas soluções
          // if (tokenError.message.includes("push service error")) {
          //   // console.error("💡 SOLUTION: This usually means:");
          //   // console.error(
          //     "  1. VAPID key mismatch - Check Firebase Console > Project Settings > Cloud Messaging",
          //   );
          //   // console.error(
          //     "  2. Make sure you're using the Web Push certificate key pair",
          //   );
          //   // console.error(
          //     "  3. Try regenerating the VAPID key in Firebase Console",
          //   );
          //   // console.error(
          //     "  4. Verify the messagingSenderId matches your Firebase project",
          //   );
          // }
        }

        throw tokenError;
      }
    } else {
      // console.log("❌ Notification permission denied");
      return null;
    }
  } catch (error) {
    // console.error("❌ Error getting notification permission:", error);

    // Log detalhado do erro
    if (error instanceof Error) {
      // console.error("Error name:", error.name);
      // console.error("Error message:", error.message);
      // console.error("Error stack:", error.stack);
    }

    return null;
  }
}

export function onMessageListener() {
  if (!messaging) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging!, (payload) => {
      // console.log("Message received:", payload);
      resolve(payload);
    });
  });
}

export { messaging };
