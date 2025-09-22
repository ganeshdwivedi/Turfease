import React from "react";
import type { Booking } from "../../Types/Booking";
import UserProfile from "../../components/UserProfile";
import dayjs from "dayjs";

interface EventPopoverProps {
  event: Booking;
}

const EventPopover = ({ event }: EventPopoverProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p>{dayjs(event?.startTime).format("HH:mm a")}</p>
        <p>{dayjs(event?.endTime).format("HH:mm a")}</p>
      </div>
      <strong>
        {event.court?.courtName} - ({event?.sport})
      </strong>
      <div className="flex justify-between items-center my-2 text-sm">
        <p>Payment</p>
        <p className="text-red-600">{event?.payment?.remainingAmount}</p>
      </div>
      <UserProfile user={event?.customer} />
    </div>
  );
};

export default EventPopover;
