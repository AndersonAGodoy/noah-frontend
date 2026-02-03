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
      // Buscar dados do sermão ANTES de publicar (enquanto ainda está no cache)
      const cachedData = queryClient.getQueryData<any>(["sermonsFirebase"]);
      let sermon;

      if (Array.isArray(cachedData)) {
        sermon = cachedData.find((s: any) => s.id === id);
      } else if (cachedData?.data) {
        sermon = cachedData.data.find((s: any) => s.id === id);
      }

      // Se não encontrou no cache, buscar do Firestore
      if (!sermon) {
        sermon = await sermonsService.getSermon(id);
      }

      // Publicar o sermão
      await sermonsService.publishSermon(id);

      return { id, sermon };
    },
    onSuccess: async ({ id: sermonId, sermon }) => {
      // Invalidar queries do React Query
      queryClient.invalidateQueries({ queryKey: ["sermonsFirebase"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSermonsFirebase"] });

      // Enviar notificação push para todos os dispositivos
      if (sermon) {
        try {
          // Construir URL absoluta para a imagem
          const baseUrl =
            typeof window !== "undefined"
              ? window.location.origin
              : process.env.NEXT_PUBLIC_BASE_URL || "https://noahrn.com.br";
          const imageUrl = `${baseUrl}/icons/icon-192x192.png`;

          const response = await fetch("/api/send-mass-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Enviar cookies de sessão
            body: JSON.stringify({
              title: "Novo Sermão Disponível",
              body: sermon.title,
              url: `/sermons/sermon/${sermon.id}`,
              imageUrl,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Failed to send notification:", errorText);
          } else {
            await response.json();
          }
        } catch (error) {
          console.error("❌ Error sending notification:", error);
        }
      }

      // Trigger manual revalidation para SSG
      try {
        await triggerRevalidation("sermon-published", sermonId);
      } catch (error) {
        console.error(
          "⚠️ Sermão publicado, mas falha na revalidação do cache:",
          error,
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
          "📝 Sermão despublicado e cache SSG atualizado automaticamente!",
        );
      } catch (error) {
        console.error(
          "⚠️ Sermão despublicado, mas falha na revalidação do cache:",
          error,
        );
        // Não interrompe o fluxo - o sermão foi despublicado com sucesso
      }
    },
    onError: (error) => {
      console.error("Error unpublishing sermon:", error);
    },
  });
}
