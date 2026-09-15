import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllAdmin = () => {
  const [selectedLocation, setSelectedLocation] = useState();

  const query = useQuery({
    queryKey: ["GetAllAdmin"],
    queryFn: async () => {
      const response = await apiCaller.get(`/allAdmin`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { ...query };
};

export default useGetAllAdmin;
