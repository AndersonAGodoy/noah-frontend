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
  limit,
  type Query,
} from "firebase/firestore";
import { db } from "../config";
import type { Sermon } from "../../types/Sermon";

// Helper function to convert different date formats to timestamp
function getTimestamp(
  dateValue: string | Date | { toDate(): Date } | undefined
): number {
  if (!dateValue) return 0;

  if (typeof dateValue === "string") {
    return new Date(dateValue).getTime();
  }

  if (dateValue instanceof Date) {
    return dateValue.getTime();
  }

  if ("toDate" in dateValue) {
    return dateValue.toDate().getTime();
  }

  return 0;
}

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

      // Query simples sem orderBy (para evitar problema de índice)
      // Vamos ordenar no cliente
      const simpleQuery = query(
        collection(db, SERMONS_COLLECTION),
        limit(pageSize * 2) // Buscar mais para ter flexibilidade na ordenação
      );

      const snapshot = await getDocs(simpleQuery);

      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sermon[];

      // Ordenar no cliente por data (mais recente primeiro)
      const sortedData = allData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending
      });

      // Aplicar limit após ordenação
      const data = sortedData.slice(0, pageSize);

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
      // Tentar primeiro com where clause
      try {
        const q = query(
          collection(db, SERMONS_COLLECTION),
          where("isPublished", "==", true)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return [];
        }

        const sermons = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sermon[];

        // Ordenar no cliente por data de criação e limitar
        const sortedSermons = sermons
          .sort((a, b) => {
            return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
          })
          .slice(0, pageSize);

        return sortedSermons;
      } catch (whereError) {
        // Fallback: buscar tudo e filtrar no cliente
        const fallbackQuery = query(collection(db, SERMONS_COLLECTION));
        const fallbackSnapshot = await getDocs(fallbackQuery);

        const allSermons = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sermon[];

        // Filtrar e ordenar no cliente
        const publishedSermons = allSermons
          .filter((sermon) => sermon.isPublished === true)
          .sort((a, b) => {
            return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
          })
          .slice(0, pageSize);

        return publishedSermons;
      }
    } catch (error) {
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

  // Despublicar sermão
  async unpublishSermon(id: string): Promise<void> {
    try {
      const docRef = doc(db, SERMONS_COLLECTION, id);
      await updateDoc(docRef, {
        isPublished: false,
        publishedAt: null,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Erro ao despublicar sermão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },
};
