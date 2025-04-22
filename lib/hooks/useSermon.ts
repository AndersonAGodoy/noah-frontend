import { useQuery } from "@tanstack/react-query";
import { Sermon } from "../types/Sermon";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSermon(id?: string | number) {
  return useQuery<Sermon>({
    queryKey: ["sermon", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sermons/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar o sermão");
      }
      return await response.json();
    },
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}
