import { useState } from "react";
import { useQuery } from "react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllCourts = () => {
  const query = useQuery(
    ["GetAllCourts"],

    async () => {
      const response = await apiCaller.get(`/allcourts`);
      return response.data.data;
    },
    {
      enabled: true,
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return { ...query };
};

export const useGetCourtByID = () => {
  const [courtId, setCourtID] = useState<string>("");
  const query = useQuery(
    ["GetCourtById", courtId],

    async () => {
      const response = await apiCaller.get(`/court/${courtId}`);
      return response.data.data;
    },
    {
      enabled: !!courtId,
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return { ...query, setCourtID };
};

export default useGetAllCourts;
