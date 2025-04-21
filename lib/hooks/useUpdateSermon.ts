import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type UpdateSermon = {
  id: string;
  title?: string;
  description?: string;
  speaker?: string;
  duration?: string;
  date?: string;
  time?: string;
  eventType?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  references: {
    id?: string;
    reference?: string;
    text?: string;
    sermonId?: string;
  }[];
  contentSections: {
    id?: string;
    type?: string;
    content?: string;
    sermonId?: string;
  }[];
};

export function useUpdateSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateSermon) => {
      const response = await fetch(`${API_URL}/sermons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar sermão");
      }

      return await response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
      queryClient.invalidateQueries({ queryKey: ["sermon", id] });
    },
  });
}
