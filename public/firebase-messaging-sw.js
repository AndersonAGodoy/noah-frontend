// Firebase Cloud Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

// Configuração do Firebase - valores hardcoded pois Service Worker não tem acesso a process.env
// ATENÇÃO: Estes valores são PÚBLICOS e devem ser expostos (não são secrets)
const firebaseConfig = {
  apiKey: "AIzaSyB1zfwGsKUviklcvFnbR5YzDMJv6W9NOOM",
  authDomain: "no-ah-c5334.firebaseapp.com",
  projectId: "no-ah-c5334",
  storageBucket: "no-ah-c5334.firebasestorage.app",
  messagingSenderId: "263927972201",
  appId: "1:263927972201:web:ad21b3d290db20b508bdf8",
  measurementId: "G-JK8334DC6L",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handler para mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload,
  );

  const notificationTitle =
    payload.notification?.title || "Nova notificação do No'ah";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: payload.data,
    tag: payload.data?.tag || "notification",
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: "open",
        title: "Abrir",
        icon: "/icons/icon-72x72.png",
      },
      {
        action: "close",
        title: "Fechar",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// Handler para cliques em notificações
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click", event);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/";
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});
