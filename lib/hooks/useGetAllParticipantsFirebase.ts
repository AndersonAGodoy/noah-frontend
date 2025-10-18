// lib/hooks/useGetAllParticipantsFirebase.ts
import { useQuery } from "@tanstack/react-query";
import { participantsService } from "../firebase/services/participantsService";

interface UseGetAllParticipantsParams {
  limit?: number;
  page?: number;
}

export function useGetAllParticipantsFirebase({
  limit = 100,
  page = 1,
}: UseGetAllParticipantsParams = {}) {
  return useQuery({
    queryKey: ["participants", "all", limit, page],
    queryFn: () => participantsService.getAllParticipants(limit, page),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export default useGetAllParticipantsFirebase;
