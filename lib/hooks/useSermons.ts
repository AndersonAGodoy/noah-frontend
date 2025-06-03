"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { SermonPage } from "../types/Sermon";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSermons({
  limit = 10,
  eventType,
}: { limit?: number; eventType?: string } = {}) {
  return useInfiniteQuery<SermonPage>({
    queryKey: ["sermons", eventType],
    queryFn: async ({ pageParam }) => {
      // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate a delay
      const cursor = typeof pageParam === "string" ? pageParam : null;

      const params = new URLSearchParams();
      params.append("limit", String(limit));

      if (eventType && eventType.trim() !== "") {
        params.append("eventType", eventType);
      }

      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await fetch(`${API_URL}/sermons?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar os sermões");
      }

      return response.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
