import React from "react";
import { Modal, Button, Tag, Typography, Divider, Image, Avatar } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  InfoCircleFilled,
  WalletOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDurationInHours } from "../../utility/getDurationInHours";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";

const { Title, Text } = Typography;

interface BookingInfoModalProps {
  booking: any;
  onClose: any;
  isOpen: boolean;
}

const BookingInfoModal = ({
  booking,
  onClose,
  isOpen,
}: BookingInfoModalProps) => {
  const [showBill, setShowBill] = React.useState(true);
  const isUpcoming = dayjs(booking?.bookingDate).isAfter(dayjs().add(1, "day"));
  const isPayOnArrival = booking?.payment?.Paymentstatus === "PayUponArrival";
  console.log(booking, "booking");
  return (
    <Modal
      closable={false}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-row items-start gap-4 ">
        <Image
          src={booking?.court?.profile_img}
          alt={booking?.court?.courtName}
          className="!w-24 !h-24 rounded-md object-cover"
        />
        <div className="flex flex-col gap-2">
          <Title level={3} className="!my-0">
            {booking?.court?.courtName}
          </Title>
       
            <Link
            className="flex flex-row gap-2"
            target="_blank"
            to={`https://www.google.com/maps?q=${booking?.court?.location?.latitude},${booking?.court?.location.longitude}`}
          >
            <CiLocationOn size={20} />
            <Text>
              {booking?.court?.location?.city},{" "}
              {booking?.court?.location?.state}
            </Text>
          </Link>
        </div>
      </div>
      {/* Image Header */}

      {/* Modal Content */}
      <div style={{ padding: "24px" }}>
        <Divider style={{ margin: "12px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="flex flex-row items-center justify-between">
           <div className="flex flex-row items-center gap-2">
         
         <Avatar
          size={36}
          icon={<CalendarOutlined  />}
          className="!bg-blue-200 !text-blue-600"
        />
           <div className="flex flex-col">
            <Text className="text-sm font-light">Booking Date</Text>
            <Text className="text-lg font-semibold">
            {dayjs(booking?.bookingDate).format("DD MMMM, YYYY")}
          </Text>
          <Text className="text-sm font-light">
             {dayjs(booking?.bookingDate).format("dddd")}
          </Text>
            </div>
         </div>
          <div className="flex flex-row items-center gap-2">
         
         <Avatar
          size={36}
          icon={ <ClockCircleOutlined/>}
          className="!bg-green-100 !text-green-600"
        />
           <div className="flex flex-col">
            <Text className="text-sm font-light">Time Slot</Text>
            <Text className="text-lg font-semibold">
          {dayjs(booking?.startTime, "HH:mm:ss").format("hh:mm a")} -{" "} 
            {dayjs(booking?.endTime, "HH:mm:ss").format("hh:mm a")}
          </Text>
          <Text className="text-sm font-light">
             {getDurationInHours(booking?.startTime, booking?.endTime)} hrs 
          </Text>
            </div>
         </div>
        </div>

         

          <Text>
            <EnvironmentOutlined style={{ color: "#00b96b", marginRight: 8 }} />
            {booking?.court?.address}
          </Text>
        </div>

        <Divider style={{ margin: "16px 0" }} />

      {/* ================= PAYMENT DETAILS ================= */}
<div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">

  {/* Header */}
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div
        className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-full bg-emerald-100
        "
      >
        <WalletOutlined
          className="text-[20px] text-emerald-600"
        />
      </div>

      <div>
        <div className="text-base font-bold text-slate-900">
          Payment Details
        </div>

        <div className="mt-0.5 text-xs text-slate-500">
          Booking payment summary
        </div>
      </div>
    </div>

    {/* Payment Method */}
    <div
      className="
        rounded-full bg-emerald-100
        px-3.5 py-1.5
        text-xs font-semibold
        text-emerald-700
        whitespace-nowrap
      "
    >
      {isPayOnArrival ? "Pay Upon Arrival" : "Paid Online"}
    </div>
  </div>

  {/* Payment Information */}
  <div className="mt-5 space-y-4">

    {/* Method */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">
        Method
      </span>

      <span className="text-sm font-semibold capitalize text-slate-900">
        {booking?.payment?.method || "-"}
      </span>
    </div>

    {/* Amount Paid */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">
        Amount Paid
      </span>

      <span className="text-sm font-semibold text-slate-900">
        ₹ {booking?.payment?.amountPaid ?? 0}
      </span>
    </div>

    {/* Remaining Amount */}
    {isPayOnArrival && (
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Remaining Amount
        </span>

        <span className="text-sm font-semibold text-slate-900">
          ₹ {booking?.payment?.remainingAmount ?? 0}
        </span>
      </div>
    )}

    {/* Discount */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">
        Discount
      </span>

      <span className="text-sm font-medium text-red-500">
        -₹ {booking?.payment?.discount ?? 0}
      </span>
    </div>

  </div>

  {/* Divider */}
  <div className="my-5 border-t border-emerald-100" />

  {/* Total */}
  <div className="flex items-center justify-between">
    <span className="text-base font-bold text-slate-900">
      Total Amount
    </span>

    <span className="text-xl font-bold text-emerald-600">
      ₹ {booking?.payment?.totalAmount ?? 0}
    </span>
  </div>

  {/* Pay Upon Arrival Information */}
  {isPayOnArrival && (
    <div
      className="
        mt-5 flex items-start gap-3
        rounded-2xl
        bg-indigo-50
        px-4 py-3.5
      "
    >
      <InfoCircleFilled
        className="
          mt-0.5 shrink-0
          text-lg text-indigo-500
        "
      />

      <p className="m-0 text-sm leading-5 text-slate-500">
        Your booking is confirmed. Please pay the remaining
        amount at the court as per the selected payment method.
      </p>
    </div>
  )}

</div>
      </div>
    </Modal>
  );
};

export default BookingInfoModal;
