import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCaller } from "./ApiCaller"; // your existing API function
import type { ICreateBooking } from "../Types/Booking";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiData: ICreateBooking) =>
      apiCaller.post("/booking", apiData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBookingByDate"] });
    },
    onError: (error: any) => {
      console.error("Booking creation failed:", error);
    },
  });
};

export const useGetAllBookings = () => {
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () =>
      await apiCaller.get("/payments").then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCourts = () => {
  return useQuery({
    queryKey: ["allCourts"],
    queryFn: async () =>
      await apiCaller.get("/allCourts").then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
