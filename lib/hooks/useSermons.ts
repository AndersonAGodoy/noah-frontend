"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Sermon = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  duration: string;
  date: string;
  time: string;
  eventType: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  references: {
    id: string;
    reference: string;
    text: string;
    sermonId: string;
  }[];
  contentSections: {
    id: string;
    type: string;
    content: string;
    sermonId: string;
  }[];
};

type SermonPage = {
  items: Sermon[];
  nextCursor: string | null;
};

export function useSermons({
  limit = 10,
  eventType,
}: { limit?: number; eventType?: string } = {}) {
  return useInfiniteQuery<SermonPage>({
    queryKey: ["sermons", eventType],
    queryFn: async ({ pageParam }) => {
      // await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate a delay
      const cursor = typeof pageParam === "string" ? pageParam : null;

      const params = new URLSearchParams({
        limit: String(limit),
        ...(eventType && { eventType }),
        ...(cursor && { cursor }),
      });

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
