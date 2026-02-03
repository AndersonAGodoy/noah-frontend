// lib/hooks/useFCMToken.ts
"use client";

import { useEffect, useState, useRef } from "react";
import { requestNotificationPermission } from "../firebase/messaging";
import { saveFCMToken } from "../firebase/services/fcmTokensService";

const TOKEN_STORAGE_KEY = "fcm-token";
const LAST_UPDATE_KEY = "fcm-last-update";
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRegistered = useRef(false);

  useEffect(() => {
    async function registerToken() {
      // Evitar múltiplas execuções
      if (hasRegistered.current) return;
      hasRegistered.current = true;

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

        // Verificar se já temos um token salvo recentemente
        const cachedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
        const now = Date.now();

        if (cachedToken && lastUpdate) {
          const timeSinceUpdate = now - parseInt(lastUpdate);

          // Se o token foi atualizado há menos de 24h, apenas usar o cache
          if (timeSinceUpdate < UPDATE_INTERVAL) {
            console.log("✅ Using cached FCM token (updated recently)");
            setToken(cachedToken);
            setIsRegistered(true);
            return;
          }
        }

        // Obter novo token ou confirmar o existente
        const fcmToken = await requestNotificationPermission();

        if (fcmToken) {
          setToken(fcmToken);

          // Salvar no Firestore (apenas atualiza lastActive se já existe)
          await saveFCMToken({
            token: fcmToken,
            deviceInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
            },
          });

          // Atualizar cache local
          localStorage.setItem(TOKEN_STORAGE_KEY, fcmToken);
          localStorage.setItem(LAST_UPDATE_KEY, now.toString());

          setIsRegistered(true);
          console.log("✅ FCM Token registered successfully");
        }
      } catch (err) {
        console.error("Error registering FCM token:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        hasRegistered.current = false; // Permitir retry em caso de erro
      }
    }

    // Registrar token quando o componente montar
    if (!isRegistered && typeof window !== "undefined") {
      registerToken();
    }
  }, [isRegistered]);

  return { token, isRegistered, error };
}
