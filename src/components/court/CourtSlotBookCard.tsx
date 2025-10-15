import { Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { MdSportsBasketball } from "react-icons/md";
import GlobalBookingModal from "./GolbalBookingModal";
import type { IavailableSlots } from "../../Types/Court";
import { useDispatch } from "react-redux";
import { openBookingModal } from "../../redux/bookingSlice";
import { PiNeedleBold } from "react-icons/pi";
import { RiMapPin2Fill } from "react-icons/ri";
import handleOpenMap from "../../utility/mapOpen";
import { useMutation } from "@tanstack/react-query";
import { appApiCaller } from "../../api/appApiCaller";

interface CourtCardProps {
  courtData: IavailableSlots;
  selectedDate: Dayjs;
  //   onBookSlot: (courtData: CourtData, slot: Slot) => void;
}

interface IPaymentInitate {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

const CourtSlotBookCard: React.FC<CourtCardProps> = ({
  courtData,
  selectedDate,
  //   onBookSlot,
}) => {
  const dispatch = useDispatch();
  const { court, availableSlots } = courtData;

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ apiData }: { apiData: IPaymentInitate }) =>
      await appApiCaller.post(`app/initiate-payment`, apiData),
    onSuccess: (response: any) => {
      const {
        data: { data },
      } = response;
      dispatch(openBookingModal(data));
    },
  });

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
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm text-gray-500 mt-1">
            {court.address}, {court?.location?.city}, {court?.location?.state}
          </p>
          <Button
            className="text-brand-green"
            icon={<RiMapPin2Fill />}
            type="text"
            onClick={() =>
              handleOpenMap(
                court?.location?.latitude || 0,
                court?.location?.longitude || 0
              )
            }
          >
            Map
          </Button>
        </div>
        <p className="flex gap-3 items-center mt-2">
          <MdSportsBasketball className="!text-gray-600" />
          {court?.sportsAvailable.join(", ")}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            Available Slots for :
          </p>
          <div className="grid !grid-cols-2 md:grid-cols-3 gap-2">
            {availableSlots?.length > 0 ? (
              availableSlots?.map((slot, index: number) => {
                const slotLabel = `${dayjs(slot?.startTime, "HH:mm:ss").format(
                  "hh:mm"
                )} - ${dayjs(slot?.endTime, "HH:mm:ss").format("hh:mm a")}`;
                const isBooked = false;

                return (
                  <Button
                    loading={isPending}
                    key={slotLabel + index}
                    type="primary"
                    // disabled={isBooked}
                    onClick={() =>
                      mutate({
                        apiData: {
                          courtId: court._id,
                          bookingDate: selectedDate.format("YYYY-MM-DD"),
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        },
                      })
                    }
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
      <GlobalBookingModal />
    </div>
  );
};

export default CourtSlotBookCard;
