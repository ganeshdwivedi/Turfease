import React, { useState } from "react";
import dayjs from "dayjs";
import { Button } from "antd";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DateCarousel({ value, onChange }: any) {
  // Generate 5 dates centered on currentDate
  const getDates = () => {
    return [...Array(5)].map(
      (_, i) => value.add(i - 2, "day") // -2, -1, 0, +1, +2
    );
  };

  console.log("Current Date:", value.format("YYYY-MM-DD"));

  const goPrev = () => {
    onChange(value.subtract(1, "day"));
  };

  const goNext = () => {
    onChange(value.add(1, "day"));
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      <Button type="text" onClick={goPrev} icon={<FaChevronLeft />} />
      <div className="flex gap-2">
        {getDates().map((date, i) => {
          const isActive = date.isSame(value, "day");
          return (
            <div
              key={i}
              className={`text-center font-medium cursor-pointer hover:shadow-2xl hover:bg-gray-200 py-2 px-3 rounded-md ${
                isActive
                  ? "bg-[#508267] px-5 text-white hover:!bg-[#508267]  shadow-2xl"
                  : ""
              }`}
              onClick={() => {
                onChange(date);
              }}
            >
              <div>{days[date.day()]}</div>
              <div>{date.date()}</div>
            </div>
          );
        })}
      </div>
      <Button type="text" onClick={goNext} icon={<FaChevronRight />} />
    </div>
  );
}
