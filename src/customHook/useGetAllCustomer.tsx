import { useState } from "react";
import { useQuery } from "react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllCustomer = () => {
  const [selectedLocation, setSelectedLocation] = useState();

  const query = useQuery(
    ["GetAllCustomer"],

    async () => {
      const response = await apiCaller.get(`/customers`);
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

export default useGetAllCustomer;
