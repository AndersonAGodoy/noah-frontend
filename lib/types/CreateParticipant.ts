export type CreateParticipantInput = {
  name: string;
  phoneNumber: string;
  email: string;
  age: number;
  address?: string;

  typeOfParticipation: "firstTime" | "returning" | "leadership";
  observations: string;
};
