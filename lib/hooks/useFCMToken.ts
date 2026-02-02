// lib/hooks/useFCMToken.ts
"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission } from "../firebase/messaging";
import { saveFCMToken } from "../firebase/services/fcmTokensService";

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function registerToken() {
      try {
        // Verificar se o navegador suporta notificações
        if (!("Notification" in window)) {
          console.log("Browser does not support notifications");
          return;
        }

        // 🔒 VERIFICAR CONSENTIMENTO LGPD
        const consent = localStorage.getItem("notification-consent");
        if (consent !== "true") {
          console.log("User has not given consent for notifications");
          return;
        }

        // Verificar se já tem permissão
        if (Notification.permission === "denied") {
          console.log("Notification permission denied");
          return;
        }

        const fcmToken = await requestNotificationPermission();

        if (fcmToken) {
          setToken(fcmToken);

          // Salvar no Firestore
          await saveFCMToken({
            token: fcmToken,
            deviceInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
            },
          });

          setIsRegistered(true);
          console.log("FCM Token registered successfully");
        }
      } catch (err) {
        console.error("Error registering FCM token:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    // Registrar token quando o componente montar
    if (!isRegistered && typeof window !== "undefined") {
      registerToken();
    }
  }, [isRegistered]);

  return { token, isRegistered, error };
}
