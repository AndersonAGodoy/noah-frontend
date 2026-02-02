// Service Worker para cache e push notifications
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

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Nova notificação";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: payload.data,
    tag: payload.data?.tag || "notification",
    requireInteraction: true,
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

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/";
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});

// Cache strategy
const CACHE_NAME = "noah-pwa-v1";
const urlsToCache = [
  "/",
  "/offline",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  // Skip chrome extensions and non-http(s) requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        return caches.match("/offline");
      }),
  );
});
