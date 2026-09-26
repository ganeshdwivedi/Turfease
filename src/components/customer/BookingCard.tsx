import React from "react";
import { formatSlotRange } from "../../utility/formatTime";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlinePayments, MdOutlineSportsTennis, MdOutlineWatchLater } from "react-icons/md";
import { Button, Card, Typography } from "antd";
import { CiCalendar, CiLocationOn, CiPhone } from "react-icons/ci";
import dayjs from "dayjs";
import { PiCourtBasketballLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { getDurationInHours } from "../../utility/getDurationInHours";
const { Text, Title } = Typography;


const bookingInfo={
  "cancelled":{
    class:"bg-red-100",
    icon:IoWarningOutline ,
    value:"This booking has been cancelled."
  },
   "confirmed":{
    class:"bg-green-100",
    icon:FaRegCircleCheck  ,
    value:"Your booking is confirmed. You're all set!"
  },
  "pending":{
    class:"bg-blue-100",
    icon:BsInfoCircle,
    value:"Your booking is pending approval. You'll be notified once the court confirms your booking."
  }
}

const BookingCard = ({ booking ,callback}: any) => {
  const status= booking?.isCanceled ?"cancelled":booking?.IsApproved ? "confirmed" : "pending";
  const info = bookingInfo[status];

const Icon = info?.icon;
  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <div className="border-b pb-3 border-gray-200 grid  grid-cols-1 gap-4 md:grid-cols-2 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-md">
            <MdOutlineSportsTennis size={20} />
          </div>
          <div>
            <Title level={5} className="!my-0">
              {booking?.sport}
            </Title>
            <Text>{booking?.court?.courtName}</Text>
          </div>
        </div>
        <div className="flex items-center gap-3 ">
          <div className="bg-blue-100 rounded-md p-2">
            <CiCalendar />
          </div>
          <div>
            <Title level={5}>
              {dayjs(booking?.bookingDate).format("MMM DD, YYYY")}
            </Title>
            <Text className="!text-gray-400">
              {dayjs(booking?.startTime, "HH:mm").format("HH:mm a")} -{" "}
              {dayjs(booking?.endTime, "HH:mm").format("HH:mm a")}
            </Text>
          </div>
        </div>
      </div>
      <div className="grid nd:grid-cols-2 grid-cols-1 gap-5 lg:grid-cols-3 pt-2 border-b border-gray-200 pb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <PiCourtBasketballLight size={20} />
            <Text className="text-lg font-semibold">Court Details</Text>
          </div>
          <Text>{booking?.court?.courtName}</Text>
          <Text>{booking?.court?.address}</Text>
          <Link
            className="flex flex-row gap-2"
            target="_blank"
            to={`https://www.google.com/maps?q=${booking?.court?.location?.latitude},${booking?.court?.location?.longitude}`}
          >
            <CiLocationOn size={20} />
            <Text>
              {booking?.court?.location?.city},{" "}
              {booking?.court?.location?.state}
            </Text>
          </Link>
          <Text className="flex flex-row items-center gap-2">
            <CiPhone size={20} />
            {booking?.court?.contactNumber}
          </Text>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <MdOutlineWatchLater size={20} />
            <Text className="text-lg font-semibold">Booking Details</Text>
          </div>
          <div className="flex flex-row items-center gap-2 ">
            <span>Start Time</span>
            <Text>{dayjs(booking?.startTime, "HH:mm").format("HH:mm a")}</Text>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span>Start Time</span>
            <Text>{dayjs(booking?.startTime, "HH:mm").format("HH:mm a")}</Text>
          </div>
           <div className="flex flex-row items-center gap-2">
            <span>Duration</span>
            <Text>{getDurationInHours(booking?.startTime,booking?.endTime)} Hrs</Text>
          </div>

        </div>

         <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <MdOutlinePayments size={20} />
            <Text className="text-lg font-semibold">Payment Details</Text>
          </div>
          <div className="flex flex-row items-center gap-2 ">
            <span>Payment Status</span>
            <Text className="capitalize bg-blue-100 p-1 rounded-md !text-blue-600">{booking?.payment?.Paymentstatus}</Text>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span>Method</span>
            <Text className="capitalize">{booking?.payment?.method}</Text>
          </div>
            <div className="flex flex-row items-center gap-2">
            <span>Amount Paid</span>
            <Text>₹{booking?.payment?.amountPaid}</Text>
          </div>
           <div className="flex flex-row items-center gap-2">
            <span>Remaining Amount</span>
            <Text>₹{booking?.payment?.remainingAmount}</Text>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span>Discount</span>
            <Text>₹{booking?.payment?.discount}</Text>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span>Total Amount</span>
            <Text>₹{booking?.payment?.totalAmount}</Text>
          </div>

        </div>
      </div>
      <div className={` ${bookingInfo[status]?.class} mt-2 p-2 rounded-md flex flex-col md:flex-row  justify-between md:items-center gap-2`}>
        <Text className={`${bookingInfo[status]?.class} flex items-center gap-2`}>
        <Icon/> {bookingInfo[status]?.value}
        </Text>
        <Button type="primary" onClick={callback} >View Details</Button>
      </div>
    </Card>
  );
};

export default BookingCard;
