// lib/firebase/ssg-services.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Sermon } from "../types/Sermon";

// Fallback para client-side quando admin não está disponível
import {
  initializeApp as initClientApp,
  getApps as getClientApps,
} from "firebase/app";
import {
  getFirestore as getClientFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Função para converter objetos Firebase em dados serializáveis
function serializeFirebaseData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Se tem método toDate(), é um Timestamp do Firebase
  if (typeof data.toDate === "function") {
    return data.toDate().toISOString();
  }

  // Se tem propriedade seconds, é um Timestamp serializado
  if (data.seconds !== undefined) {
    return new Date(
      data.seconds * 1000 + (data.nanoseconds || 0) / 1000000
    ).toISOString();
  }

  // Se é array, processar cada item
  if (Array.isArray(data)) {
    return data.map(serializeFirebaseData);
  }

  // Se é objeto, processar cada propriedade
  if (typeof data === "object") {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirebaseData(value);
    }
    return serialized;
  }

  // Se é primitivo, retornar como está
  return data;
}

// Função para criar objeto Sermon serializado
function createSerializedSermon(id: string, data: any): Sermon {
  return {
    id,
    title: data.title || "",
    description: data.description || "",
    markdownContent: data.markdownContent || "",
    speaker: data.speaker || "",
    date: data.date || "",
    duration: data.duration || "",
    eventType: data.eventType || "Outro",
    isPublished: data.isPublished || false,
    references: serializeFirebaseData(data.references || []),
    contentSections: serializeFirebaseData(data.contentSections || []),
    createdAt: serializeFirebaseData(data.createdAt) || "",
    updatedAt: serializeFirebaseData(data.updatedAt) || "",
  };
}

// Tentar inicializar Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      // Para produção, use service account key
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      // Valida se a chave existe e não está vazia
      if (serviceAccountKey && serviceAccountKey.trim().length > 0) {
        console.log("🔑 Using Firebase Admin SDK with service account");
        
        try {
          const serviceAccount = JSON.parse(serviceAccountKey);
          
          // Valida se o JSON tem as propriedades necessárias
          if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error("Invalid service account JSON structure");
          }
          
          initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
          
          console.log("✅ Firebase Admin SDK initialized successfully");
          return { type: "admin", db: getFirestore() };
        } catch (parseError) {
          console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", parseError);
          console.log("📝 Make sure FIREBASE_SERVICE_ACCOUNT_KEY is a valid JSON string");
        }
      } else {
        console.log("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found or empty");
      }
    } catch (error) {
      console.error("❌ Firebase Admin initialization error:", error);
    }
  } else {
    // Admin já inicializado
    return { type: "admin", db: getFirestore() };
  }

  // Fallback para client SDK
  console.log("🔄 Falling back to Firebase Client SDK");
  if (getClientApps().length === 0) {
    initClientApp(firebaseConfig);
  }
  return { type: "client", db: getClientFirestore() };
}

export async function getPublishedSermonsSSG(): Promise<Sermon[]> {
  try {
    console.log("🔍 SSG: Getting published sermons...");

    const firebase = initializeFirebaseAdmin();

    if (firebase.type === "admin") {
      // Usar Firebase Admin SDK
      const sermonsRef = (firebase.db as any).collection("sermons");
      const snapshot = await sermonsRef.where("isPublished", "==", true).get();

      console.log(
        `📊 SSG: Found ${snapshot.size} published sermons (Admin SDK)`
      );

      if (snapshot.empty) {
        console.log("📭 SSG: No published sermons found");
        return [];
      }

      const sermons: Sermon[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        sermons.push(createSerializedSermon(doc.id, data));
      });

      const sortedSermons = sermons.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log(
        "✅ SSG: Successfully fetched and sorted sermons (Admin SDK)"
      );
      return sortedSermons;
    } else {
      // Usar Firebase Client SDK
      const q = query(
        collection(firebase.db as any, "sermons"),
        where("isPublished", "==", true)
      );

      const snapshot = await getDocs(q);

      console.log(
        `📊 SSG: Found ${snapshot.size} published sermons (Client SDK)`
      );

      if (snapshot.empty) {
        console.log("📭 SSG: No published sermons found");
        return [];
      }

      const sermons: Sermon[] = [];
      snapshot.forEach((docSnapshot: { data: () => any; id: string; }) => {
        const data = docSnapshot.data();
        sermons.push(createSerializedSermon(docSnapshot.id, data));
      });

      const sortedSermons = sermons.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log(
        "✅ SSG: Successfully fetched and sorted sermons (Client SDK)"
      );
      return sortedSermons;
    }
  } catch (error) {
    console.error("❌ SSG: Error fetching published sermons:", error);
    return [];
  }
}

export async function getSermonByIdSSG(id: string): Promise<Sermon | null> {
  try {
    console.log(`🔍 SSG: Fetching sermon with id: ${id}`);

    const firebase = initializeFirebaseAdmin();

    if (firebase.type === "admin") {
      // Usar Firebase Admin SDK
      const sermonDoc = await (firebase.db as any)
        .collection("sermons")
        .doc(id)
        .get();

      if (!sermonDoc.exists) {
        console.log(`📭 SSG: Sermon with id ${id} not found`);
        return null;
      }

      const data = sermonDoc.data();
      const sermon = createSerializedSermon(sermonDoc.id, data);

      console.log(
        `✅ SSG: Successfully fetched sermon: ${sermon.title} (Admin SDK)`
      );
      return sermon;
    } else {
      // Usar Firebase Client SDK
      const sermonDoc = await getDoc(doc(firebase.db as any, "sermons", id));

      if (!sermonDoc.exists()) {
        console.log(`📭 SSG: Sermon with id ${id} not found`);
        return null;
      }

      const data = sermonDoc.data();
      const sermon = createSerializedSermon(sermonDoc.id, data);

      console.log(
        `✅ SSG: Successfully fetched sermon: ${sermon.title} (Client SDK)`
      );
      return sermon;
    }
  } catch (error) {
    console.error(`❌ SSG: Error fetching sermon ${id}:`, error);
    return null;
  }
}

export async function getAllSermonIdsSSG(): Promise<string[]> {
  try {
    console.log("🔍 SSG: Fetching all published sermon IDs...");

    const firebase = initializeFirebaseAdmin();

    if (firebase.type === "admin") {
      // Usar Firebase Admin SDK
      const sermonsRef = (firebase.db as any).collection("sermons");
      const snapshot = await sermonsRef
        .where("isPublished", "==", true)
        .select() // Só busca os IDs, não os dados
        .get();

      const ids = snapshot.docs.map((doc: any) => doc.id);

      console.log(
        `✅ SSG: Found ${ids.length} published sermon IDs (Admin SDK)`
      );
      return ids;
    } else {
      // Usar Firebase Client SDK
      const q = query(
        collection(firebase.db as any, "sermons"),
        where("isPublished", "==", true)
      );

      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map((doc: { id: any; }) => doc.id);

      console.log(
        `✅ SSG: Found ${ids.length} published sermon IDs (Client SDK)`
      );
      return ids;
    }
  } catch (error) {
    console.error("❌ SSG: Error fetching sermon IDs:", error);
    return [];
  }
}
