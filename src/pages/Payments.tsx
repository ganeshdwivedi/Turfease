import { DateRangePicker } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllPayemnts } from "../api/Payments";
import moment from "moment";

interface date {
  year: number;
  month: number;
  day: number;
}
const formatDate = ({ start, end }: { start: date; end: date }) => {
  const { year, month, day } = start;
  const { year: endYear, month: endMonth, day: endDay } = end;

  // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  const formattedEndDate = `${endYear}-${String(endMonth).padStart(
    2,
    "0"
  )}-${String(endDay).padStart(2, "0")}`;

  return { start_date: formattedDate, end_date: formattedEndDate };
};

const TodayDate = moment(new Date()).format("YYYY-MM-DD");
const Payments = () => {
  const [AllPayments, setAllPayments] = useState<any[]>([]);
  const { watch, setValue, register } = useForm<any>({
    defaultValues: { start_date: TodayDate, end_date: TodayDate },
  });
  const { start_date, end_date } = watch();

  const handleValue = (value: { start: date; end: date }) => {
    const dates = formatDate(value);
    setValue(`start_date`, dates.start_date);
    setValue(`end_date`, dates.end_date);
  };

  const getAllPayments = async () => {
    try {
      const response = await getAllPayemnts({ start_date, end_date });
      setAllPayments(response.data.data);
    } catch (error) {
      setAllPayments([]);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, [start_date, end_date]);

  return (
    <div>
      <div>Payments</div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <DateRangePicker
          onChange={(value: any) => handleValue(value)}
          label="Stay duration"
          className="max-w-xs"
        />
      </div>
    </div>
  );
};

export default Payments;
