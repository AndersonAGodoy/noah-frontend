// lib/hooks/useSetActiveEncounter.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";

export const useSetActiveEncounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encounterId: string) => encountersService.setActiveEncounter(encounterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounters"] });
      queryClient.invalidateQueries({ queryKey: ["activeEncounter"] });
    },
  });
};