// lib/types/Encounter.ts
export type Encounter = {
  id: string;
  title: string;
  description?: string;
  startDate: Date | { toDate(): Date };
  endDate: Date | { toDate(): Date };
  location?: string;
  maxParticipants?: number;
  isActive: boolean;
  createdAt?: Date | { toDate(): Date };
  updatedAt?: Date | { toDate(): Date };
};

export type EncounterPage = {
  data: Encounter[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CreateEncounterData = Omit<Encounter, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateEncounterData = Partial<Omit<Encounter, 'id' | 'createdAt' | 'updatedAt'>>;