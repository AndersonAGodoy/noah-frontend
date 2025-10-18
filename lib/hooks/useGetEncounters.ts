// lib/hooks/useGetEncounters.ts
import { useQuery } from "@tanstack/react-query";
import { encountersService } from "../firebase/services";

export const useGetEncounters = () => {
  return useQuery({
    queryKey: ["encounters"],
    queryFn: () => encountersService.getEncounters(),
  });
};