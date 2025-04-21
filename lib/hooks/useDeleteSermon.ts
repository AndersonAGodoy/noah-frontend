import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useDeleteSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/sermons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar sermão");
      }

      return true;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
      queryClient.removeQueries({ queryKey: ["sermon", id] });
    },
  });
}
