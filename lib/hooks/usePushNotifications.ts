// lib/hooks/usePushNotifications.ts
"use client";

import { useState, useEffect } from "react";
import { onMessageListener } from "../firebase/messaging";

export function usePushNotifications() {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    // Listener para mensagens enquanto o app está aberto
    const unsubscribe = onMessageListener().then((payload) => {
      if (payload) {
        setNotification(payload);
      }
    });

    return () => {
      // Cleanup se necessário
    };
  }, []);

  return { notification };
}
