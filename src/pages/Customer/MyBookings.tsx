import React, { useState } from "react";
import { appApiCaller } from "../../api/appApiCaller";
import { useQuery } from "@tanstack/react-query";
import BookingCard from "../../components/customer/BookingCard";
import BookingInfoModal from "../../components/customer/BookingInfoModal";

const MyBookings = () => {
  const [booking, setBooking] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllBookingsOfCustomer"],
    queryFn: async () => {
      const response = await appApiCaller.get(`/app/bookings`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <h3 className="font-bold mb-5 !text-2xl !text-[#508267]">My Bookings</h3>
      <div className="flex flex-col gap-5">
        {data?.map((item: any) => (
          <div
            onClick={() => {
              setBooking(item);
              setIsOpen(true);
            }}
          >
            <BookingCard booking={item} />
          </div>
        ))}
      </div>
      <BookingInfoModal
        booking={booking}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </div>
  );
};

export default MyBookings;
