import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiCaller } from "../api/ApiCaller";
import toast from "react-hot-toast";
import Customer, { BECustomerUpdate } from "../Types/Customer";

interface BECustomer {
    message: string,
    user: {
        _id: string,
        name: string,
        email: string,
        phone_number: number,
        profile: string,
    }

}

const useGetAllCustomer = () => {
  const [selectedLocation, setSelectedLocation] = useState();
  const queryClient = useQueryClient(); 

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


  const mutation = useMutation(
    async ({customer_id,updatedCustomer}:{customer_id:string,updatedCustomer:BECustomerUpdate}) => {
      const response = await apiCaller.patch(`/customer/${customer_id}`, updatedCustomer);
      return response.data;
    },
    {
      // On success, update the cache with the new customer data
      onSuccess: (data:BECustomer) => {
        queryClient.setQueryData<Customer[]>(["GetAllCustomer"], (oldData:any) => {
          return oldData.map((customer:Customer) =>
            customer._id === data.user._id ? { ...customer, ...data.user } : customer
          );
        });
        toast.success(data.message);
      },
    }
  );

  return { ...query, updateCustomer: mutation.mutate };
};

export default useGetAllCustomer;
