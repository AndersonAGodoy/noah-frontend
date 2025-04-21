import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const publishSermon = async (id: string) => {
  const response = await fetch(`${API_URL}/sermons/${id}/publish`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to publish sermon");
  }

  return response.json();
};

export const usePublishSermonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishSermon,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["sermons"] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
    onError: (error) => {
      console.error("Error publishing sermon:", error);
    },
  });
};
