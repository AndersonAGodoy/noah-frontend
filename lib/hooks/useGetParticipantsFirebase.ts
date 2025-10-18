// lib/hooks/useGetParticipantsFirebase.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { participantsService } from "../firebase/services/participantsService";

export function useGetParticipantsFirebase(
  {
    encounterId,
    limit = 10,
    page = 1,
  }: { encounterId: string; limit?: number; page?: number } = {
    encounterId: "",
  }
) {
  return useQuery({
    queryKey: ["participantsFirebase", encounterId, page, limit],
    queryFn: async () => {
      if (!encounterId) {
        throw new Error("encounterId é obrigatório");
      }

      const result = await participantsService.getParticipants(
        encounterId,
        limit,
        page
      );
      return {
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          limit,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPreviousPage: result.page > 1,
        },
      };
    },
    enabled: !!encounterId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
