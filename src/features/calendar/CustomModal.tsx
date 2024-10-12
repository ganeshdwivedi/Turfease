import {
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateBooking } from "../../api/Calendar";

interface extendedProps {
  address: string;
  location: string;
  ownedBy: string;
  pricePerHour: string;
  sportsAvailable: string[];
  workingHours: { start: string; end: string };
}

const CustomModal = ({
  isOpen,
  onOpenChange,
  event,
  AllCustomer,
  updateBookings,
}: {
  isOpen: boolean;
  onOpenChange: any;
  event: any;
  AllCustomer: any;
  updateBookings: any;
}) => {
  const { register, setValue, watch, handleSubmit } = useForm();
  const Resource = event?.resource?._resource;
  const extendedProps = Resource?.extendedProps;
  const flex: string = `flex flex-row my-1 items-center justify-between`;

  const onSubmit = async (data: any) => {
    const bookingDate = moment(event?.start).format("YYYY-MM-DD");
    const startTime = moment(event.start);
    const endTime = moment(event.end);
    const duration = moment.duration(endTime.diff(startTime));
    const totalAmount = duration.asHours() * extendedProps?.pricePerHour;
    const apidata = {
      ...data,
      court: Resource.id,
      bookingDate,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      payment: { totalAmount },
    };
    try {
      const response = await CreateBooking(apidata);
      updateBookings();
      onOpenChange(false);
    } catch (error) {
      console.log(error, "error in creating booking");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={() => onOpenChange(false)}>
      <ModalContent>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3">
              <div className={flex}>
                <p className="font-regular my-1">Booking Name</p>
                <input
                  {...register("bookingName", { required: true })}
                  className="border-1 px-1 border-[#a6a6a6] rounded-md"
                  type="text"
                  placeholder="Booking name"
                />
              </div>
              <div className={flex}>
                <p className="font-regular">Location</p>
                <p className="font-regular capitalize">
                  {extendedProps?.location?.state}{" "}
                  {extendedProps?.location?.city}
                </p>
              </div>
              <div className={flex}>
                <p className="font-regular">Address</p>
                <p className="font-regular capitalize">
                  {extendedProps?.address}
                </p>
              </div>
              <div className={`${flex} mt-2`}>
                <p className="font-regular">Sport</p>
                <Select
                  {...register("sport", { required: true })}
                  aria-label="select Sport"
                  className="max-w-32"
                >
                  {extendedProps?.sportsAvailable?.map((name: string) => (
                    <SelectItem key={name}>{name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className={flex}>
                <p className="font-regular">Booking Date</p>
                <p className="font-regular">
                  {moment(event?.start).format("DD MMMM")}
                </p>
              </div>
              <div className={flex}>
                <p className="font-regular">Booking Duration</p>
                <div className="flex flex-row gap-3">
                  <p className="font-regular">
                    {moment(event?.start).format("HH:mm a")}
                  </p>
                  <p className="font-regular">
                    {moment(event?.end).format("HH:mm a")}
                  </p>
                </div>
              </div>
              <div className={flex}>
                <p className="font-regular">Booking Price</p>
                <p className="font-regular">{extendedProps?.pricePerHour}</p>
              </div>
              <div className={flex}>
                <p className="font-regular">Booked By</p>
                <Select
                  {...register("customer", { required: true })}
                  aria-label="select customer"
                  className="max-w-32"
                >
                  {AllCustomer?.map((name: any) => (
                    <SelectItem key={name._id}>{name.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className={`${flex} mt-6`}>
                <button
                  onClick={() => onOpenChange(false)}
                  className="shadow-btn font-regular px-3 py-1 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-success shadow-btn text-white font-regular px-3 py-1 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
