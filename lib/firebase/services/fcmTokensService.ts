// lib/firebase/services/fcmTokensService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "../config";
import { FCMToken, CreateFCMToken, InstallMetrics } from "../../types/FCMToken";

const TOKENS_COLLECTION = "fcmTokens";
const METRICS_COLLECTION = "installMetrics";
const METRICS_DOC_ID = "stats";

// Salvar ou atualizar token
export async function saveFCMToken(
  tokenOrData: string | CreateFCMToken,
): Promise<string> {
  try {
    // Converter string em objeto CreateFCMToken
    const data: CreateFCMToken =
      typeof tokenOrData === "string"
        ? {
            token: tokenOrData,
            deviceInfo: {
              userAgent: navigator.userAgent || "Unknown",
              platform: navigator.platform || "Unknown",
            },
          }
        : tokenOrData;

    // Validar se token existe
    if (!data.token) {
      throw new Error("Token is required");
    }

    // Usar o token como ID do documento para evitar duplicatas
    const tokenHash = data.token
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 100);
    const docRef = doc(db, TOKENS_COLLECTION, tokenHash);
    const now = serverTimestamp();

    // Usar setDoc com merge para criar ou atualizar
    // O merge garante que createdAt e installDate não sejam sobrescritos se já existirem
    await setDoc(
      docRef,
      {
        token: data.token,
        userId: data.userId || null,
        deviceInfo: {
          userAgent: data.deviceInfo?.userAgent || "Unknown",
          platform: data.deviceInfo?.platform || "Unknown",
        },
        lastActive: now,
        isValid: true,
        updatedAt: now,
      },
      { merge: true },
    );

    // Definir createdAt e installDate apenas se for novo documento (sem merge nestes campos)
    // Isso é feito em uma operação separada que só funciona se os campos não existirem
    await setDoc(
      docRef,
      {
        createdAt: now,
        deviceInfo: {
          installDate: now,
        },
      },
      { merge: true, mergeFields: [] }, // Merge vazio = só adiciona se não existir
    );

    console.log("✅ FCM Token saved/updated:", tokenHash);
    return tokenHash;
  } catch (error) {
    console.error("Error saving FCM token:", error);
    throw error;
  }
}

// Buscar todos os tokens válidos
export async function getAllValidTokens(): Promise<string[]> {
  try {
    const tokensRef = collection(db, TOKENS_COLLECTION);
    const q = query(tokensRef, where("isValid", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data().token);
  } catch (error) {
    console.error("Error getting valid tokens:", error);
    return [];
  }
}

// Buscar todos os tokens com detalhes (para admin)
export async function getAllFCMTokensWithDetails(): Promise<FCMToken[]> {
  try {
    const tokensRef = collection(db, TOKENS_COLLECTION);
    const snapshot = await getDocs(tokensRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        token: data.token,
        userId: data.userId || null,
        deviceInfo: data.deviceInfo || {
          userAgent: "Unknown",
          platform: "Unknown",
        },
        lastActive: data.lastActive?.toDate() || new Date(),
        isValid: data.isValid ?? true,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Error getting FCM tokens with details:", error);
    throw error;
  }
}

// Marcar token como inválido
export async function markTokenAsInvalid(token: string): Promise<void> {
  try {
    const tokensRef = collection(db, TOKENS_COLLECTION);
    const q = query(tokensRef, where("token", "==", token));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, TOKENS_COLLECTION, docId), {
        isValid: false,
        updatedAt: serverTimestamp(),
      });

      // Atualizar métricas
      await updateInstallMetrics(-1);
    }
  } catch (error) {
    console.error("Error marking token as invalid:", error);
  }
}

// Atualizar métricas de instalação
async function updateInstallMetrics(delta: number): Promise<void> {
  try {
    const metricsRef = doc(db, METRICS_COLLECTION, METRICS_DOC_ID);
    const metricsDoc = await getDoc(metricsRef);

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    if (!metricsDoc.exists()) {
      // Criar documento de métricas
      await setDoc(metricsRef, {
        totalInstalls: delta > 0 ? 1 : 0,
        activeInstalls: delta > 0 ? 1 : 0,
        lastUpdated: serverTimestamp(),
        installsByMonth: {
          [yearMonth]: delta > 0 ? 1 : 0,
        },
      });
    } else {
      // Atualizar métricas existentes
      await updateDoc(metricsRef, {
        totalInstalls: increment(delta > 0 ? 1 : 0),
        activeInstalls: increment(delta),
        lastUpdated: serverTimestamp(),
        [`installsByMonth.${yearMonth}`]: increment(delta > 0 ? 1 : 0),
      });
    }
  } catch (error) {
    console.error("Error updating install metrics:", error);
  }
}

// Buscar métricas de instalação
export async function getInstallMetrics(): Promise<InstallMetrics | null> {
  try {
    const metricsRef = doc(db, METRICS_COLLECTION, METRICS_DOC_ID);
    const metricsDoc = await getDoc(metricsRef);

    if (!metricsDoc.exists()) {
      return null;
    }

    const data = metricsDoc.data();
    return {
      totalInstalls: data.totalInstalls || 0,
      activeInstalls: data.activeInstalls || 0,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      installsByMonth: data.installsByMonth || {},
    };
  } catch (error) {
    console.error("Error getting install metrics:", error);
    return null;
  }
}

// Cleanup de tokens antigos (executar periodicamente)
export async function cleanupOldTokens(
  daysInactive: number = 90,
): Promise<number> {
  try {
    const tokensRef = collection(db, TOKENS_COLLECTION);
    const snapshot = await getDocs(tokensRef);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    let deletedCount = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const lastActive = data.lastActive?.toDate();

      if (lastActive && lastActive < cutoffDate) {
        await deleteDoc(doc(db, TOKENS_COLLECTION, docSnap.id));
        deletedCount++;

        if (data.isValid) {
          await updateInstallMetrics(-1);
        }
      }
    }

    return deletedCount;
  } catch (error) {
    console.error("Error cleaning up old tokens:", error);
    return 0;
  }
}
