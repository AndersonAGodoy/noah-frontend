// lib/hooks/useGetActiveEncounter.ts
import { useQuery } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";

export const useGetActiveEncounter = () => {
  return useQuery({
    queryKey: ["activeEncounter"],
    queryFn: () => encountersService.getActiveEncounter(),
  });
};