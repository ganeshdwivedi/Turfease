import React from "react";
import { Modal, Button, Tag, Typography, Divider } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDurationInHours } from "../../utility/getDurationInHours";
import getStatusColor from "../../utility/getStatusColor";

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
  const isUpcoming = booking?.status === "Upcoming";
  const isPayOnArrival = booking?.payment?.paymentMode === "pay_on_arrival";

  return (
    <Modal
      closable={false}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      {/* Image Header */}
      <img
        src={booking?.court?.profile_img}
        alt={booking?.court?.courtName}
        className="!w-full !h-full  object-cover"
      />

      {/* Modal Content */}
      <div style={{ padding: "24px" }}>
        <Tag
          className="capitalize !text-[14px] font-semibold"
          color={getStatusColor(booking?.payment?.status)}
        >
          {booking?.payment?.status}
        </Tag>

        <Title level={3} className="!my-2 !flex !items-center justify-between">
          {booking?.court?.courtName} <Tag color="blue">{booking?.sport}</Tag>
        </Title>

        <Divider style={{ margin: "12px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Text>
            <CalendarOutlined style={{ color: "#00b96b", marginRight: 8 }} />
            {dayjs(booking?.bookingDate).format("DD MMMM, YYYY")}
          </Text>

          <Text>
            <ClockCircleOutlined style={{ color: "#00b96b", marginRight: 8 }} />
            {dayjs(booking?.startTime, "HH:mm:ss").format("hh:mm a")} -{" "}
            {dayjs(booking?.endTime, "HH:mm:ss").format("hh:mm a")} (
            {getDurationInHours(booking?.startTime, booking?.endTime)} hrs )
          </Text>

          <Text>
            <EnvironmentOutlined style={{ color: "#00b96b", marginRight: 8 }} />
            {booking?.court?.address}
          </Text>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <Text type="secondary" strong>
              Total Paid
            </Text>
            <Title level={4} style={{ margin: 0 }}>
              ₹ {booking?.payment?.amountPaid}
            </Title>
          </div>
          <div className="text-right mt-1">
            <button
              onClick={() => setShowBill(!showBill)}
              className="text-sm font-semibold text-brand-green hover:underline"
            >
              {showBill ? "Hide Bill" : "View Detailed Bill"}
            </button>
          </div>
        </div>
        {showBill && (
          <div className="animate-fade-in translate-0.5 mt-4 pt-4 border-t border-gray-200 text-sm space-y-2">
            {isPayOnArrival ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="text-gray-700">
                    ₹ {booking?.payment?.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-red-500">
                    -₹ {booking?.payment?.discount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className=" text-gray-700">
                    ₹ {booking?.payment?.amountPaid}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
                  <span className="text-gray-800">Remaining Amount</span>
                  <span className="text-brand-green">
                    ₹ {booking?.payment?.remainingAmount}
                  </span>
                </div>
                <div className="mt-4 text-center text-xs p-2 bg-yellow-100 text-yellow-800 rounded-md">
                  Payment will be collected upon arrival.
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Court Price</span>
                  <span className="text-gray-700">
                    ₹ {booking?.payment?.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-red-500">
                    -₹ {booking?.payment?.discount}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
                  <span className="text-gray-800">Total Paid</span>
                  <span className="text-gray-800">
                    ₹ {booking?.payment?.amountPaid}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {isUpcoming ? (
          <Button className="!mt-5" block danger size="large">
            Cancel Booking
          </Button>
        ) : (
          <Button className="!mt-5" block type="primary" size="large">
            Book Again
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default BookingInfoModal;
