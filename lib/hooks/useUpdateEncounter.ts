// lib/hooks/useUpdateEncounter.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";
import { UpdateEncounterData } from "../types/Encounter";

export const useUpdateEncounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEncounterData }) => 
      encountersService.updateEncounter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounters"] });
      queryClient.invalidateQueries({ queryKey: ["activeEncounter"] });
    },
  });
};