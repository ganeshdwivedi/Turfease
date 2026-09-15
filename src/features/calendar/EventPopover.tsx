import React from "react";
import type { Booking } from "../../Types/Booking";
import UserProfile from "../../components/UserProfile";
import dayjs from "dayjs";

interface EventPopoverProps {
  event: Booking;
}

const EventPopover = ({ event }: EventPopoverProps) => {
  return (
    <div className="!bg-[#00A0DF1F] !p-2 !w-[250px] overflow-hidden">
      <div className="flex gap-2 items-center !text-gray-500 !font-semibold">
        <p>{dayjs(event?.startTime).format("HH:mm")}</p>
        <p>{dayjs(event?.endTime).format("HH:mm")}</p>
      </div>
      <strong className="!text-blue-500">
        Booking - {event.court?.courtName}
      </strong>
      <div className="mt-2">
        <strong className="!text-gray-600">Booked By</strong>
        <UserProfile user={event?.customer} />
      </div>

      <div className="flex justify-between items-center my-2 text-sm">
        <strong>Pending Payment</strong>
        <p className="bg-red-600 text-white break-words rounded-lg px-2">
          {event?.payment?.remainingAmount} INR
        </p>
      </div>
    </div>
  );
};

export default EventPopover;
