// lib/hooks/useGetSermonsFirebase.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";

export function useGetSermonsFirebase({
  limit = 10,
  page = 1,
}: { limit?: number; page?: number } = {}) {
  return useQuery({
    queryKey: ["sermonsFirebase", page, limit],
    queryFn: async () => {
      return await sermonsService.getSermons(limit, page);
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGetPublishedSermonsFirebase({
  limit = 10,
}: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["publishedSermonsFirebase", limit],
    queryFn: async () => {
      console.log("🔍 Fetching published sermons with limit:", limit);
      try {
        const result = await sermonsService.getPublishedSermons(limit);
        console.log("✅ Published sermons fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("❌ Error fetching published sermons:", error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2, // Tentar 2 vezes em caso de erro
  });
}

export function useGetSermonFirebase(sermonId: string | null) {
  return useQuery({
    queryKey: ["sermonFirebase", sermonId],
    queryFn: async () => {
      if (!sermonId) return null;
      return await sermonsService.getSermon(sermonId);
    },
    enabled: !!sermonId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
