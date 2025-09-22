import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllCustomerBookings = () => {
  const [CustomerId, setCustomerId] = useState<string>("");

  const query = useQuery({
    queryKey: ["GetAllBoookingsOfCustomer", CustomerId],
    queryFn: async () => {
      const response = await apiCaller.get(`/customersbookings/${CustomerId}`);
      return response.data.data;
    },
    enabled: !!CustomerId,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { setCustomerId, ...query };
};

export default useGetAllCustomerBookings;
