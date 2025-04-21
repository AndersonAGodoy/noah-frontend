import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateSermonInput = {
  title: string;
  description: string;
  date: string;
  speaker: string;
};

export function useCreateSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSermon: CreateSermonInput) => {
      const response = await fetch(`${API_URL}/sermons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSermon),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sermão");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
}
