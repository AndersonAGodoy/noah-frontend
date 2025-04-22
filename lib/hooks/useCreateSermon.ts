import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSermonInput } from "../types/CreateSermon";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useCreateSermon() {
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
