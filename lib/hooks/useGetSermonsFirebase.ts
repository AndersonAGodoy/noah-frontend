// lib/hooks/useGetSermonsFirebase.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";

// Configurações padrão de queries
const DEFAULT_QUERY_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutos
  gcTime: 1000 * 60 * 30, // 30 minutos
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
};

export function useGetSermonsFirebase({
  limit = 10,
  page = 1,
}: { limit?: number; page?: number } = {}) {
  return useQuery({
    queryKey: ["sermonsFirebase", page, limit],
    queryFn: async () => {
      return await sermonsService.getSermons(limit, page);
    },
    ...DEFAULT_QUERY_CONFIG,
  });
}

export function useGetPublishedSermonsFirebase({
  limit = 10,
}: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["publishedSermonsFirebase", limit],
    queryFn: async () => {
      return await sermonsService.getPublishedSermons(limit);
    },
    ...DEFAULT_QUERY_CONFIG,
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
    ...DEFAULT_QUERY_CONFIG,
  });
}
