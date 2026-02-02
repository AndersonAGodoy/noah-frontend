// Script para gerar Service Workers com configurações do Firebase
// Executado automaticamente durante o build

const fs = require("fs");
const path = require("path");


// Ler variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validar configurações
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Variáveis de ambiente faltando:", missingVars.join(", "));
  process.exit(1);
}

// Template do firebase-messaging-sw.js
const fcmSwTemplate = `// Firebase Cloud Messaging Service Worker
// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE DIRETAMENTE
// Este arquivo é gerado em build time pelo script scripts/generate-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

// Configuração do Firebase
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

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
    payload.notification?.title || "Nova Notificação";
  const notificationOptions = {
    body: payload.notification?.body || "Você tem uma nova mensagem",
    icon: payload.notification?.icon || "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: payload.data?.sermonId || "default",
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// Handler para clique na notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Tentar focar em uma janela existente
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Abrir nova janela se não encontrou
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
`;

// Template do sw.js (PWA principal)
const swTemplate = `// Service Worker para cache e push notifications
// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE DIRETAMENTE
// Este arquivo é gerado em build time pelo script scripts/generate-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

// Configuração do Firebase
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Nova notificação";
  const notificationOptions = {
    body: payload.notification?.body || "Você tem uma nova atualização",
    icon: payload.notification?.icon || "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: payload.data?.sermonId || "default",
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// Cache strategy
const CACHE_NAME = "noah-cache-v1";
const urlsToCache = [
  "/",
  "/dashboard",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
`;

// Criar diretório public se não existir
const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Escrever arquivos
const fcmSwPath = path.join(publicDir, "firebase-messaging-sw.js");
const swPath = path.join(publicDir, "sw.js");

fs.writeFileSync(fcmSwPath, fcmSwTemplate, "utf8");
fs.writeFileSync(swPath, swTemplate, "utf8");

console.log("✅ Service Workers gerados com sucesso!");
console.log("   📁", fcmSwPath);
console.log("   📁", swPath);
