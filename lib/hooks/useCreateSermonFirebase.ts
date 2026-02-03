// lib/hooks/useCreateSermonFirebase.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";
import type { SermonFormData } from "../schemas";

export default function useCreateSermonFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SermonFormData) => {
      const sermonId = await sermonsService.createSermon({
        title: data.title,
        description: data.description,
        speaker: data.speaker,
        duration: data.duration,
        date: data.date,
        time: data.time,
        eventType: data.eventType,
        references: data.references,
        contentSections: data.contentSections,
        markdownContent: data.markdownContent,
        spotifyEmbed: data.spotifyEmbed,
        isPublished: false,
      });

      // Retornar os dados completos para usar no onSuccess
      return {
        id: sermonId,
        ...data,
      };
    },
    onSuccess: async (sermon) => {
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
    },
    onError: (error) => {
      console.error("Error creating sermon:", error);
    },
  });
}
