// lib/hooks/useUpdateSermonFirebase.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";
import type { UpdateSermonFormData } from "../schemas";

export default function useUpdateSermonFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSermonFormData;
    }) => {
      await sermonsService.updateSermon(id, {
        title: data.title,
        description: data.description,
        speaker: data.speaker,
        duration: data.duration,
        date: data.date,
        time: data.time,
        eventType: data.eventType,
        references: data.references,
        contentSections: data.contentSections,
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
    },
    onError: (error) => {
      console.error("Error updating sermon:", error);
    },
  });
}
