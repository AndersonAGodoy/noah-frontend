// lib/firebase/services/sermonsService.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  type Query,
} from "firebase/firestore";
import { db } from "../config";
import type { Sermon } from "../../types/Sermon";

const SERMONS_COLLECTION = "sermons";

export const sermonsService = {
  // Criar novo sermão
  async createSermon(data: Omit<Sermon, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, SERMONS_COLLECTION), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
      });
      return docRef.id;
    } catch (error) {
      throw new Error(
        `Erro ao criar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter todos os sermões com paginação
  async getSermons(
    pageSize: number = 10,
    pageNumber: number = 1
  ): Promise<{
    data: Sermon[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Query para contar total
      const countQuery = query(collection(db, SERMONS_COLLECTION));
      const countSnapshot = await getDocs(countQuery);
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / pageSize);

      // Query com paginação
      const paginatedQuery = query(
        collection(db, SERMONS_COLLECTION),
        orderBy("date", "desc"),
        limit(pageSize)
      );

      const snapshot = await getDocs(paginatedQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sermon[];

      return {
        data,
        total,
        page: pageNumber,
        totalPages,
      };
    } catch (error) {
      throw new Error(
        `Erro ao buscar sermões: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter sermão por ID
  async getSermon(id: string): Promise<Sermon | null> {
    try {
      const docRef = doc(db, SERMONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Sermon;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Erro ao buscar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Atualizar sermão
  async updateSermon(id: string, data: Partial<Sermon>): Promise<void> {
    try {
      const docRef = doc(db, SERMONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Deletar sermão
  async deleteSermon(id: string): Promise<void> {
    try {
      const docRef = doc(db, SERMONS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(
        `Erro ao deletar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter sermões publicados
  async getPublishedSermons(pageSize: number = 10): Promise<Sermon[]> {
    try {
      console.log("🔍 Getting published sermons...");

      // Query simples para evitar problemas com índices compostos
      const q = query(
        collection(db, SERMONS_COLLECTION),
        where("isPublished", "==", true)
      );

      const snapshot = await getDocs(q);
      console.log("📊 Published sermons found:", snapshot.size);

      if (snapshot.empty) {
        console.log("📭 No published sermons found");
        return [];
      }

      const sermons = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sermon[];

      // Ordenar no cliente e limitar
      const sortedSermons = sermons
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, pageSize);

      console.log("✅ Published sermons returned:", sortedSermons.length);
      return sortedSermons;
    } catch (error) {
      console.error("❌ Error in getPublishedSermons:", error);

      // Se o erro for de índice, tenta uma query mais simples ainda
      if (error instanceof Error && error.message.includes("index")) {
        console.log("🔄 Trying fallback query without where clause...");
        try {
          const fallbackQuery = query(collection(db, SERMONS_COLLECTION));
          const fallbackSnapshot = await getDocs(fallbackQuery);

          const allSermons = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Sermon[];

          // Filtrar e ordenar no cliente
          const publishedSermons = allSermons
            .filter((sermon) => sermon.isPublished === true)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, pageSize);

          console.log("✅ Fallback query successful:", publishedSermons.length);
          return publishedSermons;
        } catch (fallbackError) {
          console.error("❌ Fallback query also failed:", fallbackError);
          throw fallbackError;
        }
      }

      throw new Error(
        `Erro ao buscar sermões publicados: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Publicar sermão
  async publishSermon(id: string): Promise<void> {
    try {
      const docRef = doc(db, SERMONS_COLLECTION, id);
      await updateDoc(docRef, {
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Erro ao publicar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },
};
