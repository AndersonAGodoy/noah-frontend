// lib/firebase/services/participantsService.ts
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
  startAfter,
  type Query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../config";
import type { Participant } from "../../types/Participant";

const PARTICIPANTS_COLLECTION = "participants";

export const participantsService = {
  // Criar novo participante
  async createParticipant(data: Omit<Participant, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PARTICIPANTS_COLLECTION), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(
        `Erro ao criar participante: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter todos os participantes com paginação
  async getParticipants(
    encounterId: string,
    pageSize: number = 10,
    pageNumber: number = 1
  ): Promise<{
    data: Participant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Query para contar total
      const countQuery = query(
        collection(db, PARTICIPANTS_COLLECTION),
        where("encounterId", "==", encounterId)
      );
      const countSnapshot = await getDocs(countQuery);
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / pageSize);

      // Query com paginação
      const skip = (pageNumber - 1) * pageSize;
      const paginatedQuery = query(
        collection(db, PARTICIPANTS_COLLECTION),
        where("encounterId", "==", encounterId),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      const snapshot = await getDocs(paginatedQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];

      return {
        data,
        total,
        page: pageNumber,
        totalPages,
      };
    } catch (error) {
      throw new Error(
        `Erro ao buscar participantes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter participante por ID
  async getParticipant(id: string): Promise<Participant | null> {
    try {
      const docRef = doc(db, PARTICIPANTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Participant;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Erro ao buscar participante: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Atualizar participante
  async updateParticipant(
    id: string,
    data: Partial<Participant>
  ): Promise<void> {
    try {
      const docRef = doc(db, PARTICIPANTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Erro ao atualizar participante: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Deletar participante
  async deleteParticipant(id: string): Promise<void> {
    try {
      const docRef = doc(db, PARTICIPANTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(
        `Erro ao deletar participante: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Buscar participantes por email
  async getParticipantByEmail(email: string): Promise<Participant | null> {
    try {
      const q = query(
        collection(db, PARTICIPANTS_COLLECTION),
        where("email", "==", email)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Participant;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Erro ao buscar participante por email: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },

  // Obter todos os participantes (sem filtro de encontro) - para debug
  async getAllParticipants(
    pageSize: number = 100,
    pageNumber: number = 1
  ): Promise<{
    data: Participant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Query para contar total
      const countQuery = query(collection(db, PARTICIPANTS_COLLECTION));
      const countSnapshot = await getDocs(countQuery);
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / pageSize);

      // Query com paginação
      const paginatedQuery = query(
        collection(db, PARTICIPANTS_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      const snapshot = await getDocs(paginatedQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];

      return {
        data,
        total,
        page: pageNumber,
        totalPages,
      };
    } catch (error) {
      throw new Error(
        `Erro ao buscar todos os participantes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  },
};
