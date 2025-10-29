// lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Configure suas credenciais do Firebase aqui
// Você pode encontrar essas informações no Console do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton pattern - Previne múltiplas inicializações
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

// Initialize Firebase apenas uma vez
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized");
} else {
  app = getApp();
  console.log("♻️ Firebase already initialized, reusing instance");
}

// Initialize Firebase Services
// No cliente: usa cache persistente
// No servidor: usa cache padrão
if (typeof window !== "undefined") {
  // Cliente: cache persistente com suporte a múltiplas abas
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  console.log("✅ Firebase client initialized with offline persistence");
} else {
  // Servidor: sem cache persistente (não suportado no Node.js)
  db = getFirestore(app);
  console.log("✅ Firebase server initialized (no persistence)");
}

auth = getAuth(app);
storage = getStorage(app);

export { app, db, auth, storage };
export default app;
