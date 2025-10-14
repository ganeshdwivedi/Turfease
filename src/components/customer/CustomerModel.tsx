import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import type { Customer } from "../../Types/Customer";
import useGetAllCustomerBookings from "../../hooks/useGetAllCustomerBookings";
import axios from "axios";
import moment from "moment";
import {
  Button,
  Card,
  Image,
  Input,
  Modal,
  Table,
  Tabs,
  type TabsProps,
} from "antd";
import { FaEye, FaWhatsapp } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appApiCaller } from "../../api/appApiCaller";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../ToastProvider";

interface formInput {
  _id: string;
  name: string;
  phone_number: string | any;
  profile: string;
  email: string;
  password: string;
}

const profile_img = "/placeholder-img.jpg";
const CustomerModel = ({
  customer,
  isOpen,
  onOpenChange,
}: {
  customer: Customer | null;
  isOpen: boolean;
  onOpenChange: any;
}) => {
  const antToast = useToast();
  const { isSuccess, isError, data, setCustomerId } =
    useGetAllCustomerBookings();
  const PastBooking =
    data?.filter((item: any) =>
      moment(item.bookingDate).isBefore(new Date())
    ) || [];
  const FutureBooking =
    data?.filter((item: any) => moment(item.bookingDate).isAfter(new Date())) ||
    [];
  const queryClient = useQueryClient();
  const [isshowProfile, setIsShowProfile] = useState<boolean>(false);
  // all bookings of selectedCustomer
  const { register, watch, control, setValue, handleSubmit, reset } =
    useForm<formInput>();
  const [selectedKey, setSelectedKey] = useState<string>("upcoming");
  const { name, email, phone_number, password, profile } = watch();

  useEffect(() => {
    if (customer?._id) {
      setCustomerId(customer?._id);

      reset(customer);
      return;
    }
    reset({
      profile: profile_img,
    });
  }, [customer]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (apiData: any) =>
      await appApiCaller.post("/app/auth/register", apiData),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["GetAllCustomer"] });
    },
    onError: (error) => {
      antToast.error("Failed to create customer. Please try again.");
      console.error("Error creating court:", error);
    },
  });

  const OnSubmit = async () => {
    const apiData = {
      email,
      phone_number,
      profile: profile_img,
      name,
      password,
      source: "admin",
    };
    mutate(apiData);
  };

  const handleclose = () => {
    onOpenChange(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date: string) => moment(date).format("DD/MM/yyyy"),
    },
    {
      title: "Court Name",
      dataIndex: ["court", "courtName"],
      key: "courtName",
    },
    {
      title: "Sport",
      dataIndex: "sport",
      key: "sport",
    },
    {
      title: "Amount",
      dataIndex: ["payment", "totalAmount"],
      key: "amount",
      render: (amount: number) => `₹${amount}`,
    },
    {
      title: "Location",
      dataIndex: ["court", "location", "city"],
      key: "location",
    },
  ];

  const items: TabsProps["items"] = [
    ...(!customer
      ? [
          {
            key: "config",
            label: "Settings",
            children: (
              <Card>
                <div className="flex !flex-row items-center gap-36 justify-between">
                  <label className="!text-gray-600">Password</label>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter Password"
                        iconRender={(visible) =>
                          visible ? <FiEye /> : <FiEyeOff />
                        }
                      />
                    )}
                  />
                </div>
              </Card>
            ),
          },
        ]
      : []),
    {
      key: "upcoming",
      label: "Upcoming Bookings",
      children: (
        <Table
          scroll={{ x: 700 }}
          columns={columns}
          dataSource={FutureBooking}
          rowKey="_id"
          pagination={false}
          locale={{
            emptyText: "No Upcoming Bookings Found",
          }}
          bordered
          size="middle"
          className="shadow-sm rounded-lg"
        />
      ),
    },
    {
      key: "past",
      label: "Past Bookings",
      children: (
        <Table
          scroll={{ x: 700 }}
          columns={columns}
          dataSource={PastBooking}
          rowKey="_id"
          pagination={false}
          locale={{
            emptyText: "No Past Bookings Found",
          }}
          bordered
          size="middle"
          className="shadow-sm rounded-lg"
        />
      ),
    },
  ];

  return (
    <Modal footer={null} open={isOpen} closable centered onCancel={handleclose}>
      <form className="mt-6" onSubmit={handleSubmit(OnSubmit)}>
        <div className="!flex flex-col md:!flex-row !items-center gap-3 !p-4 rounded-md shadow-btnInset">
          <div className="relative">
            <Image
              className="rounded-full object-cover !w-20 !h-20 md:!w-16 md:!h-16"
              src={profile ? profile : profile_img}
              alt="admin-img"
            />

            <div
              onClick={() => setIsShowProfile(true)}
              className="rounded-full py-[3px] px-[3px] absolute bottom-0 right-0 bg-black text-white w-4 h-4"
            >
              <input
                type="file"
                className="w-4 h-4 absolute opacity-0"
                // onChange={(e) => handleImageUploader(e, "profile")}
              />
              <FaCamera className="text-[10px]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input type="text" placeholder="Enter Name" {...field} />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input type="email" placeholder="Enter Email" {...field} />
                )}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <Controller
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Enter Phone Number"
                    {...field}
                  />
                )}
              />
              <Button
                icon={<FaWhatsapp />}
                type="primary"
                className="font-regular bg-sidebar text-white px-2 py-1 rounded-md shadow-btn w-full"
              >
                Whatsapp
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          defaultActiveKey={selectedKey}
          onChange={(key: string) => setSelectedKey(key)}
          color="primary"
          items={items}
        />

        <div className={`flex flex-row my-1 items-center justify-between mt-6`}>
          <Button
            onClick={handleclose}
            className="shadow-btn font-regular px-3 py-1 rounded-md"
          >
            {!!customer ? "Delete" : "Cancel"}
          </Button>
          <Button
            loading={isPending}
            type="primary"
            htmlType="submit"
            className="bg-sidebar text-white shadow-btn font-regular px-3 py-1 rounded-md"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModel;
