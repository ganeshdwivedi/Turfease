import dayjs from "dayjs";
import React from "react";

const BookingCard = ({ booking }: any) => {
  const isUpcoming = booking.status === "Upcoming";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-green/30">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800 text-lg">
          {dayjs(booking?.startTime, "HH:mm:ss").format("hh:mm a")} -{" "}
          {dayjs(booking?.endTime, "HH:mm:ss").format("hh:mm a")}
        </span>
        <span className="font-semibold text-gray-600 text-sm uppercase tracking-wider">
          {booking?.court?.address}
        </span>
      </div>
      <div className="border-t border-gray-100 my-3"></div>
      <div className="text-gray-500 text-sm">
        <p className="font-semibold text-gray-700">BOOKING</p>
        <div className="mt-2 flex justify-between">
          <span>{booking?.court?.courtName}</span>
          <span>Duration: {booking.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
