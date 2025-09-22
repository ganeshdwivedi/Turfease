import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCaller } from "../api/ApiCaller";
import toast from "react-hot-toast";
import type { Customer, BECustomerUpdate } from "../Types/Customer";

interface BECustomer {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone_number: number;
    profile: string;
  };
}

const useGetAllCustomer = () => {
  const [selectedLocation, setSelectedLocation] = useState();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["GetAllCustomer"],
    queryFn: async () => {
      const response = await apiCaller.get(`/customers`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async ({
      customer_id,
      updatedCustomer,
    }: {
      customer_id: string;
      updatedCustomer: BECustomerUpdate;
    }) => {
      const response = await apiCaller.patch(
        `/customer/${customer_id}`,
        updatedCustomer
      );
      return response.data;
    },
    // On success, update the cache with the new customer data
    onSuccess: (data: BECustomer) => {
      queryClient.setQueryData<Customer[]>(["GetAllCustomer"], (oldData) => {
        // Safely map over oldData, returning an empty array if it's undefined
        return (oldData ?? []).map((customer: Customer) =>
          customer._id === data.user._id
            ? { ...customer, ...data.user }
            : customer
        );
      });
      toast.success(data.message);
    },
  });

  const update = useMutation({
    mutationFn: async ({
      customer_id,
      updatedCustomer,
    }: {
      customer_id: string;
      updatedCustomer: BECustomerUpdate;
    }) => {
      const response = await apiCaller.patch(
        `/customer/profile/upload/${customer_id}`,
        updatedCustomer
      );
      return response.data;
    },
    // On success, update the cache with the new customer data
    onSuccess: (data: BECustomer) => {
      queryClient.setQueryData<Customer[]>(["GetAllCustomer"], (oldData) => {
        // Safely map over oldData, returning an empty array if it's undefined
        return (oldData ?? []).map((customer: Customer) =>
          customer._id === data.user._id
            ? { ...customer, ...data.user }
            : customer
        );
      });
      toast.success(data.message);
    },
  });

  return {
    ...query,
    updateCustomer: mutation.mutate,
    uploadProfile: update.mutate,
  };
};

export default useGetAllCustomer;
