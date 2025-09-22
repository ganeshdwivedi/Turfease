import { Card, Skeleton } from "antd";
import React from "react";
import useGetPaymentStats from "../../customHook/useGetPaymentStats";

interface StatsCardProps {
  selectedDate: Date;
}

const StatsCard = ({ selectedDate }: StatsCardProps) => {
  const { data, isLoading } = useGetPaymentStats({ selectedDate });
  return (
    <>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Card
          style={{ boxShadow: "inset 0px 2px 6px rgba(0, 0, 0, 0.15)" }}
          className="inset-shadow-2xl !bg-gray-100 !p-0"
        >
          <div className="!text-xs">
            <p className="">Daily Occupancy {data?.dailyOccupancyHours} hrs</p>
            <p>Daily Occupancy Rate: {data?.dailyOccupancyRate}</p>
            <p>Total Bookings {data?.totalBookings}</p>
            <p>Pending Amount: {data?.pendingAmount}</p>
            <p>Cancelled Bookings: {data?.cancelledBookings}</p>
          </div>
        </Card>
      )}
    </>
  );
};

export default StatsCard;
