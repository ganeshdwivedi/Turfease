import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Switch,
  Tab,
  Tabs,
  cn,
} from "@nextui-org/react";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import Customer from "../../Types/Customer";
import useGetAllCustomerBookings from "../../customHook/useGetAllCustomerBookings";
import moment from "moment";
import axios from "axios";

interface formInput {
  _id: string;
  name: string;
  phone_number: string | any;
  profile: string;
  email: string;
  isLoading: boolean;
  isProfileSuccess: any;
  tempProfile: string;
  generatedUrl: string;
}

const CustomerModel = ({
  admin,
  isOpen,
  onOpenChange,
  update,
  uploadProfile,
}: {
  admin: Customer;
  isOpen: boolean;
  onOpenChange: any;
  update: any;
  uploadProfile: any;
}) => {
  const { isSuccess, isError, data, setCustomerId } =
    useGetAllCustomerBookings();
  const [isshowProfile, setIsShowProfile] = useState<boolean>(false);
  // all bookings of selectedCustomer
  const [AllPastBookings, SetAllPastBookings] = useState<any[]>([]);
  const [AllFutureBookings, SetAllFutureBookings] = useState<any[]>([]);
  const { register, watch, control, setValue, handleSubmit, reset } =
    useForm<formInput>();
  const [selectedKey, setSelectedKey] = useState<string>("past");
  const {
    _id,
    name,
    email,
    phone_number,
    generatedUrl,
    tempProfile,
    isProfileSuccess,
    isLoading,
    profile,
  } = watch();

  useEffect(() => {
    if (admin._id !== "0") {
      setCustomerId(admin?._id);

      reset({ ...admin, tempProfile: admin.profile });
      return;
    }
    reset({
      profile:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    });
  }, [admin]);

  useEffect(() => {
    if (isSuccess) {
      const pastBook = data?.filter((item: any) =>
        moment(item.bookingDate).isBefore(new Date())
      );
      const futureBook = data?.filter((item: any) =>
        moment(item.bookingDate).isAfter(new Date())
      );

      SetAllPastBookings(pastBook);
      SetAllFutureBookings(futureBook);
    }
  }, [isSuccess, isError, data]);

  const appendFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    tempProfile && formData.append("profile", tempProfile);

    return formData;
  };

  const OnSubmit = async () => {
    const apiData = appendFormData();
    try {
      const response = await update({
        customer_id: _id,
        updatedCustomer: apiData,
      });
      handleclose();
    } catch (error: any) {
      toast.error(error.error);
    }
  };

  const handleclose = () => {
    onOpenChange();
  };

  const handleImageUploader = (e: any, type?: string) => {
    setValue("profile", URL.createObjectURL(e.target.files[0]));
    setValue("tempProfile", e.target.files[0]);
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={handleclose}>
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody className="w-auto">
          <form onSubmit={handleSubmit(OnSubmit)}>
            <div className="flex flex-row items-center gap-3">
              <div className="relative">
                <img
                  className="rounded-full object-cover w-16 h-16"
                  src={profile ? profile : "/Images/Profile.svg"}
                  alt="admin-img"
                />

                <div
                  onClick={() => setIsShowProfile(true)}
                  className="rounded-full py-[3px] px-[3px] absolute bottom-0 right-0 bg-black text-white w-4 h-4"
                >
                  <input
                    type="file"
                    className="w-4 h-4 absolute opacity-0"
                    onChange={(e) => handleImageUploader(e, "profile")}
                  />
                  <FaCamera className="text-[10px]" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("name", { required: true })}
                  />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="border border-black border-opacity-30 h-10 rounded-md px-2"
                    {...register("phone_number", { required: true })}
                  />
                  <button
                    type="button"
                    className="font-regular bg-sidebar text-white px-2 py-1 rounded-md shadow-btn w-full"
                  >
                    Whatsapp
                  </button>
                </div>
              </div>
            </div>
            <Tabs
              color="primary"
              variant="underlined"
              classNames={{
                tabList:
                  "gap-6 relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-[#68947c]",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-[#68947c]",
              }}
              selectedKey={selectedKey}
              onSelectionChange={(e: string | any) => setSelectedKey(e)}
            >
              <Tab key="past" title="Past Bookings">
                <div className="grid grid-cols-5 font-semibold">
                  <p>Date</p>
                  <p>Court Name</p>
                  <p>Sport</p>
                  <p>Amount</p>
                  <p>Location</p>
                </div>
                <div className="flex flex-col">
                  {AllPastBookings?.length > 0 ? (
                    AllPastBookings?.map((item: any) => (
                      <div className="font-light grid grid-cols-5 text-sm">
                        <p className="flex flex-row items-center">
                          {moment(item.bookingDate).format("DD/MM/yyyy")}
                        </p>
                        <p>
                          {item.court ? item.court.courtName : "Court Deleted"}
                        </p>
                        <p>{item.sport}</p>
                        <p>{item.payment.totalAmount}</p>
                        <p>
                          {item.court
                            ? item.court.location.city
                            : "Court Deleted"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center font-light p-2">
                      No Upcoming Bookings Found
                    </p>
                  )}
                </div>
              </Tab>
              <Tab key="future" title="Upcoming Bookings">
                <div className="grid grid-cols-5 font-semibold">
                  <p>Date</p>
                  <p>Court Name</p>
                  <p>Sport</p>
                  <p>Amount</p>
                  <p>Location</p>
                </div>
                <div className="flex flex-col">
                  {AllFutureBookings?.length > 0 ? (
                    AllFutureBookings?.map((item: any) => (
                      <div className="font-light grid grid-cols-5 text-sm">
                        <p className="flex flex-row items-center">
                          {moment(item.bookingDate).format("DD/MM/yyyy")}
                        </p>
                        <p>{item.court.courtName}</p>
                        <p>{item.sport}</p>
                        <p>{item.payment.totalAmount}</p>
                        <p>{item.court.location.city}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center font-light p-2">
                      No Upcoming Bookings Found
                    </p>
                  )}
                </div>
              </Tab>
            </Tabs>
            <div
              className={`flex flex-row my-1 items-center justify-between mt-6`}
            >
              <button
                onClick={handleclose}
                className="shadow-btn font-regular px-3 py-1 rounded-md"
              >
                {!!admin ? "Delete" : "Cancel"}
              </button>
              <button
                type="submit"
                className="bg-sidebar text-white shadow-btn font-regular px-3 py-1 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomerModel;
