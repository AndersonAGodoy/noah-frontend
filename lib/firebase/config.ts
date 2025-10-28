// lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore, enableIndexedDbPersistence } from "firebase/firestore";
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

// Initialize Firebase Services (lazy initialization)
db = getFirestore(app);
auth = getAuth(app);
storage = getStorage(app);

// Habilitar persistência offline (apenas no cliente)
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("⚠️ Firebase persistence failed: Multiple tabs open");
    } else if (err.code === "unimplemented") {
      console.warn("⚠️ Firebase persistence not available in this browser");
    } else {
      console.error("❌ Firebase persistence error:", err);
    }
  });
}

export { app, db, auth, storage };
export default app;
