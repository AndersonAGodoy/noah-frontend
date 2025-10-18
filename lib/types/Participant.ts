export type Participant = {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string | null;
  observations: string;
  typeOfParticipation: "firstTime" | "returning" | "leadership";
  phoneNumber: string;
  encounterId: string;
  createdAt?: Date | { toDate(): Date };
  updatedAt?: Date | { toDate(): Date };
};

export type ParticipantPage = {
  data: Participant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
