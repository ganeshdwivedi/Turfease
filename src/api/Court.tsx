import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiCaller } from "./ApiCaller";

// 🔹 Delete Court
export const useDeleteCourt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (court_id: string) =>
      await apiCaller.delete(`/court/${court_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts"] });
    },
  });
};
