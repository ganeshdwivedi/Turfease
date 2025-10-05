import { Button } from "antd";
import dayjs from "dayjs";
import React from "react";
import { MdSportsBasketball } from "react-icons/md";

interface Slot {
  startTime: string;
  endTime: string;
}

interface Court {
  _id: string;
  courtName: string;
  address: string;
  profile_img?: string;
  location: {
    city: string;
    state: string;
  };
  sportsAvailable: string[];
}

interface CourtData {
  courtId: string;
  court: Court;
  availableSlots: Slot[];
  bookedSlots?: Record<string, string[]>; // Optional: booked slots per date
}

interface CourtCardProps {
  courtData: CourtData;
  //   selectedDate: string;
  //   onBookSlot: (courtData: CourtData, slot: Slot) => void;
}

const CourtSlotBookCard: React.FC<CourtCardProps> = ({
  courtData,
  //   selectedDate,
  //   onBookSlot,
}) => {
  const { court, availableSlots } = courtData;
  //   const booked = courtData.bookedSlots?.[selectedDate] || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-shadow hover:shadow-xl">
      <img
        src={court?.profile_img || "/placeholder.png"}
        alt={court?.courtName}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{court?.courtName}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {court.address}, {court?.location?.city}, {court?.location?.state} •
        </p>
        <p className="flex gap-3 items-center">
          <MdSportsBasketball className="!text-gray-600" />
          {court.sportsAvailable.join(", ")}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            Available Slots for :
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {availableSlots?.length > 0 ? (
              availableSlots?.map((slot, index: number) => {
                const slotLabel = `${slot?.startTime} - ${dayjs(
                  slot?.endTime,
                  "HH:mm"
                ).format("hh:mm a")}`;
                const isBooked = false;

                return (
                  <Button
                    key={slotLabel + index}
                    type="primary"
                    // disabled={isBooked}
                    // onClick={() => !isBooked && onBookSlot(courtData, slot)}
                    className={`!text-xs !font-semibold  !transition-colors ${
                      isBooked
                        ? "!bg-gray-200 !text-gray-400 cursor-not-allowed"
                        : "!bg-green-100 !text-green-800 hover:!text-white "
                    }`}
                  >
                    {slotLabel}
                  </Button>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm col-span-full">
                No slots available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtSlotBookCard;
