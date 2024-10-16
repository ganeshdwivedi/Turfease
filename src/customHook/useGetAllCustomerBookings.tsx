import { useState } from "react";
import { useQuery } from "react-query";
import { apiCaller } from "../api/ApiCaller";

const useGetAllCustomerBookings = () => {
  const [CustomerId, setCustomerId] = useState<string>();

  const query = useQuery(
    ["GetAllBoookingsOfCustomer",CustomerId],

    async () => {
      const response = await apiCaller.get(`/customersbookings/${CustomerId}`);
      return response.data.data;
    },
    {
      enabled: !!CustomerId?true:false,
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return { setCustomerId,...query };
};

export default useGetAllCustomerBookings;
