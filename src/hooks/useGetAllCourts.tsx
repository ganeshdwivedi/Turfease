import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllCourts = () => {
  const query = useQuery({
    queryKey: ["GetAllCourts"],
    queryFn: async () => {
      const response = await apiCaller.get(`/allcourts`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { ...query };
};

export const useGetCourtByID = () => {
  const [courtId, setCourtID] = useState<string>("");

  const query = useQuery({
    queryKey: ["GetCourtById", courtId],
    queryFn: async () => {
      const response = await apiCaller.get(`/court/${courtId}`);
      return response.data.data;
    },
    enabled: !!courtId,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { ...query, setCourtID };
};

export default useGetAllCourts;
