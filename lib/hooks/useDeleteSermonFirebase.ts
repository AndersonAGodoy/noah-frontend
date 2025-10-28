// lib/hooks/useDeleteSermonFirebase.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonsService } from "../firebase/services/sermonsService";
import { triggerRevalidation } from "../utils/revalidation";

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
    onSuccess: async (sermonId) => {
      // Invalidar queries do React Query
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSermonsFirebase"] });

      // Trigger manual revalidation para SSG
      try {
        await triggerRevalidation("sermon-published", sermonId);
        console.log(
          "🎉 Sermão publicado e cache SSG atualizado automaticamente!"
        );
      } catch (error) {
        console.error(
          "⚠️ Sermão publicado, mas falha na revalidação do cache:",
          error
        );
        // Não interrompe o fluxo - o sermão foi publicado com sucesso
        // Na próxima visita às páginas, o conteúdo será atualizado
      }
    },
    onError: (error) => {
      console.error("Error publishing sermon:", error);
    },
  });
}

export function useUnpublishSermonFirebase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sermonsService.unpublishSermon(id);
      return id;
    },
    onSuccess: async (sermonId) => {
      // Invalidar queries do React Query
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSermonsFirebase"] });

      // Trigger manual revalidation para SSG
      try {
        await triggerRevalidation("sermon-unpublished", sermonId);
        console.log(
          "📝 Sermão despublicado e cache SSG atualizado automaticamente!"
        );
      } catch (error) {
        console.error(
          "⚠️ Sermão despublicado, mas falha na revalidação do cache:",
          error
        );
        // Não interrompe o fluxo - o sermão foi despublicado com sucesso
      }
    },
    onError: (error) => {
      console.error("Error unpublishing sermon:", error);
    },
  });
}
