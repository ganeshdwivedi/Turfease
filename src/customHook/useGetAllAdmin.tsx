import { useState } from "react";
import { useQuery } from "react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllAdmin = () => {
  const [selectedLocation, setSelectedLocation] = useState();

  const query = useQuery(
    ["GetAllAdmin"],

    async () => {
      const response = await apiCaller.get(`/allAdmin`);
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

export default useGetAllAdmin;
