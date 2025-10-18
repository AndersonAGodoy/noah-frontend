// lib/hooks/useDeleteSermonFirebase.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";

export default function useDeleteSermonFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sermonsService.deleteSermon(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
    },
    onError: (error) => {
      console.error("Error deleting sermon:", error);
    },
  });
}

export function usePublishSermonFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sermonsService.publishSermon(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSermonsFirebase"] });
    },
    onError: (error) => {
      console.error("Error publishing sermon:", error);
    },
  });
}
