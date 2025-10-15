import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { apiCaller } from "../../api/ApiCaller";
import { appApiCaller } from "../../api/appApiCaller";
import CourtSlotBookCard from "../../components/court/CourtSlotBookCard";
import DateCarousel from "../../features/calendar/DateCrousel";
import dayjs, { Dayjs } from "dayjs";
import { Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { DebouncedInput } from "../../components/settings/DebounceInput";
import { CiSearch } from "react-icons/ci";

interface FormState {
  selectedDate: Dayjs;
  duration: number;
  search: string;
  sports: string;
}
const Book = () => {
  const { control, watch } = useForm<FormState>({
    defaultValues: {
      selectedDate: dayjs(),
      duration: 60,
    },
  });
  const { selectedDate, search, duration, sports } = watch();

  const { data } = useQuery({
    queryKey: ["getSlotsByDate", selectedDate, search, duration, sports],
    queryFn: async () => {
      const params = [
        `date=${selectedDate.format("YYYY-MM-DD")}`,
        `duration=${duration}`,
      ];
      if (search) {
        params.push(`search=${search}`);
      }
      if (sports) {
        params.push(`sport=${sports}`);
      }
      const response = await appApiCaller.get(
        `/app/bookable-slots?${params.join("&")}`
      );
      return response?.data?.courts;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  return (
    <div className="!overflow-x-hidden">
      <div className="mb-4">
        <Controller
          control={control}
          name="selectedDate"
          render={({ field: { value, onChange } }) => (
            <DateCarousel value={value} onChange={onChange} />
          )}
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-3 grid-cols-1">
        <Controller
          name="search"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <DebouncedInput
              suffix={<CiSearch />}
              onDebounce={onChange}
              {...field}
              placeholder="Search court"
            />
          )}
        />
        <Controller
          name="sports"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <DebouncedInput
              suffix={<CiSearch />}
              onDebounce={onChange}
              {...field}
              placeholder="Search Sport"
            />
          )}
        />
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="select a time"
              className="!w-full"
              options={[
                { label: "30 min", value: 30 },
                { label: "60 min", value: 60 },
                { label: "90 min", value: 90 },
              ]}
            />
          )}
        />
      </div>
      <div className="lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 grid py-7 gap-6 mt-4">
        {data?.map((item: any) => (
          <CourtSlotBookCard
            selectedDate={selectedDate}
            key={item?.courtId}
            courtData={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Book;
