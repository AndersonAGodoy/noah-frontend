// lib/hooks/useCreateParticipantFirebase.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { participantsService } from "../firebase/services/participantsService";
import type { EncontroComDeusFormData } from "../schemas";

export default function useCreateParticipantFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: EncontroComDeusFormData & { encounterId: string }
    ) => {
      const participantData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        age: data.age,
        address: data.address || null,
        observations: data.observations || "",
        typeOfParticipation: data.typeOfParticipation,
        encounterId: data.encounterId,
      };

      return await participantsService.createParticipant(participantData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
    onError: (error) => {
      // console.error("Error creating participant:", error);
    },
  });
}
