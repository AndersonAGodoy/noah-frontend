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

      // Enviar notificação push para todos os usuários
      try {
        const response = await fetch("/api/send-mass-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Novo Sermão Disponível",
            body: sermon.title,
            url: `/sermons/sermon/${sermon.id}`,
            imageUrl: "/icons/icon-192x192.png",
          }),
        });

        if (!response.ok) {
          console.error("Failed to send notification");
        } else {
          const result = await response.json();
          console.log(`Notification sent to ${result.successCount} devices`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    },
    onError: (error) => {
      console.error("Error creating sermon:", error);
    },
  });
}
