import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { apiCaller } from "../api/ApiCaller";
import { useQuery } from "@tanstack/react-query";
import { Avatar, DatePicker, Table, Tag } from "antd";
import dayjs from "dayjs";

interface date {
  year: number;
  month: number;
  day: number;
}

const TodayDate = moment(new Date()).format("YYYY-MM-DD");
const Payments = () => {
  const { watch, setValue, control } = useForm<any>({
    defaultValues: {
      DateRange: { start_date: TodayDate, end_date: TodayDate },
    },
  });
  const {
    DateRange: { start_date, end_date },
  } = watch();

  const { data, isLoading } = useQuery({
    queryKey: ["GetAllPaymentsByDate", start_date, end_date],
    queryFn: async () => {
      const response = await apiCaller.get(
        `/payments?start_date=${start_date}&end_date=${end_date}`
      );

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "date",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Time",
      dataIndex: "bookingDate",
      key: "time",
      render: (_: any, record: any) => {
        return (
          <div>
            {record?.startTime}-{record?.endTime}
          </div>
        );
      },
    },
    {
      title: "Court",
      dataIndex: "court",
      key: "court",
      render: (court: any) => court?.courtName,
    },
    {
      title: "Customer",
      dataIndex: "name",
      key: "customer",
      render: (_: any, record: any) => (
        <div className="flex flex-row items-center gap-2">
          <Avatar
            size="small"
            src={record?.customer?.profile || "/placeholder-img.jpg"}
            icon={record?.customer?.name.charAt(0)}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record?.customer?.name}</div>
            <div style={{ color: "#888", fontSize: 12 }}>
              {record?.customer?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "payment",
      key: "status",
      render: (payment: any) => {
        return (
          <Tag color={payment?.remainingAmount === 0 ? "green" : "red"}>
            {payment?.remainingAmount === 0 ? "Paid" : "Pending Payment"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
    },
  ];

  return (
    <div>
      <div className="flex w-full flex-wrap md:flex-nowrap !mb-6 md:mb-0 gap-4">
        <Controller
          name="DateRange"
          control={control}
          render={({ field }) => (
            <DatePicker.RangePicker
              className="!bg-transparent"
              value={
                field.value
                  ? [
                      field.value.start_date
                        ? dayjs(field.value.start_date)
                        : null,
                      field.value.end_date ? dayjs(field.value.end_date) : null,
                    ]
                  : [null, null]
              }
              onChange={(dates) => {
                field.onChange({
                  start_date: dates?.[0] ? dates[0].format("YYYY-MM-DD") : "",
                  end_date: dates?.[1] ? dates[1].format("YYYY-MM-DD") : "",
                });
              }}
              format="YYYY-MM-DD"
            />
          )}
        />
      </div>

      <Table
        scroll={{ x: 700 }}
        columns={columns}
        key={"_id"}
        dataSource={data}
        loading={isLoading}
      />
    </div>
  );
};

export default Payments;
