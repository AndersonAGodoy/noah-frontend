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
import { logger } from "../../utils/logger";

const TOKENS_COLLECTION = "fcmTokens";
const METRICS_COLLECTION = "installMetrics";
const METRICS_DOC_ID = "stats";

// Intervalo mínimo entre atualizações do lastActive (7 dias)
const UPDATE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

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

    // Verificar se o documento já existe
    const existingDoc = await getDoc(docRef);
    const isNewToken = !existingDoc.exists();

    if (isNewToken) {
      // ✅ NOVO TOKEN - Criar documento completo
      const now = serverTimestamp();
      await setDoc(docRef, {
        token: data.token,
        userId: data.userId || null,
        deviceInfo: {
          userAgent: data.deviceInfo?.userAgent || "Unknown",
          platform: data.deviceInfo?.platform || "Unknown",
          installDate: now,
        },
        lastActive: now,
        isValid: true,
        createdAt: now,
        updatedAt: now,
      });

      // Atualizar métricas apenas para novos tokens
      await updateInstallMetrics(1);
      logger.log("✅ New FCM Token registered:", tokenHash);
    } else {
      // ✅ TOKEN EXISTENTE - Verificar se precisa atualizar
      const existingData = existingDoc.data();
      const lastActive = existingData?.lastActive?.toDate();
      const now = new Date();

      // Só fazer WRITE se passou mais de 7 dias desde o último update
      if (
        !lastActive ||
        now.getTime() - lastActive.getTime() > UPDATE_INTERVAL_MS
      ) {
        await updateDoc(docRef, {
          lastActive: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isValid: true,
        });
        logger.log("✅ FCM Token lastActive updated (7+ days):", tokenHash);
      } else {
        logger.log("⏭️ FCM Token skipped update (recently active):", tokenHash);
      }
    }

    return tokenHash;
  } catch (error) {
    logger.error("Error saving FCM token:", error);
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
    logger.error("Error getting valid tokens:", error);
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
    logger.error("Error getting FCM tokens with details:", error);
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
    logger.error("Error marking token as invalid:", error);
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
    logger.error("Error updating install metrics:", error);
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
    logger.error("Error getting install metrics:", error);
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
    logger.error("Error cleaning up old tokens:", error);
    return 0;
  }
}
