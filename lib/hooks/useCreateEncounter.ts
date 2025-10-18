// lib/hooks/useCreateEncounter.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";
import { CreateEncounterData } from "../types/Encounter";

export const useCreateEncounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEncounterData) => encountersService.createEncounter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounters"] });
      queryClient.invalidateQueries({ queryKey: ["activeEncounter"] });
    },
  });
};