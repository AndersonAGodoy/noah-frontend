import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../config";
import type { Encounter, CreateEncounterData, UpdateEncounterData } from "../../types/Encounter";

const ENCOUNTERS_COLLECTION = "encounters";

export const encountersService = {
  // Criar novo encontro
  async createEncounter(data: CreateEncounterData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ENCOUNTERS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar encontro:", error);
      throw error;
    }
  },

  // Buscar encontros com paginação
  async getEncounters(pageSize: number = 10, pageNumber: number = 1) {
    try {
      const q = query(
        collection(db, ENCOUNTERS_COLLECTION),
        orderBy("startDate", "desc"),
        limit(pageSize * pageNumber)
      );

      const snapshot = await getDocs(q);
      const encounters: Encounter[] = [];
      
      snapshot.forEach((doc) => {
        encounters.push({
          id: doc.id,
          ...doc.data()
        } as Encounter);
      });

      return {
        data: encounters.slice((pageNumber - 1) * pageSize),
        total: encounters.length,
        page: pageNumber,
        totalPages: Math.ceil(encounters.length / pageSize),
      };
    } catch (error) {
      console.error("Erro ao buscar encontros:", error);
      throw error;
    }
  },

  // Buscar encontro ativo
  async getActiveEncounter(): Promise<Encounter | null> {
    try {
      const q = query(
        collection(db, ENCOUNTERS_COLLECTION),
        where("isActive", "==", true),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const docSnapshot = snapshot.docs[0];
      const encounter = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as Encounter;

      // Verificar se a data do encontro já passou
      const encounterDate = encounter.startDate instanceof Date 
        ? encounter.startDate 
        : encounter.startDate.toDate();
      
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
      
      // Se a data já passou, retornar null (encontro não está mais ativo)
      if (encounterDate < now) {
        return null;
      }

      return encounter;
    } catch (error) {
      console.error("Erro ao buscar encontro ativo:", error);
      throw error;
    }
  },

  // Atualizar encontro
  async updateEncounter(id: string, data: UpdateEncounterData): Promise<void> {
    try {
      const docRef = doc(db, ENCOUNTERS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar encontro:", error);
      throw error;
    }
  },

  // Desativar todos os encontros
  async deactivateAllEncounters(): Promise<void> {
    try {
      const q = query(
        collection(db, ENCOUNTERS_COLLECTION),
        where("isActive", "==", true)
      );

      const snapshot = await getDocs(q);
      const batch = [];

      for (const docSnapshot of snapshot.docs) {
        batch.push(
          updateDoc(doc(db, ENCOUNTERS_COLLECTION, docSnapshot.id), {
            isActive: false,
            updatedAt: serverTimestamp(),
          })
        );
      }

      await Promise.all(batch);
    } catch (error) {
      console.error("Erro ao desativar encontros:", error);
      throw error;
    }
  },

  // Definir encontro ativo
  async setActiveEncounter(id: string): Promise<void> {
    try {
      // Primeiro desativa todos os encontros
      await this.deactivateAllEncounters();
      
      // Depois ativa o encontro específico
      const docRef = doc(db, ENCOUNTERS_COLLECTION, id);
      await updateDoc(docRef, {
        isActive: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao definir encontro ativo:", error);
      throw error;
    }
  },
};