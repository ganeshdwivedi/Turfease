import moment from "moment";
import React, { useEffect, useEffectEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Select,
  Button,
  Form,
  DatePicker,
  Row,
  Col,
  TimePicker,
  Card,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import type { ICreateBooking } from "../../Types/Booking";
import { useCreateBooking } from "../../api/Calendar";
import { CustomerSearchSelect } from "../../components/Search/CustomerSearch";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { FaIndianRupeeSign } from "react-icons/fa6";
const { Text } = Typography;
const CreateBookingModal = ({
  isOpen,
  onOpenChange,
  event,
  defaultValue

}: {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  event: any;
  defaultValue?:any
}) => {
  const { mutateAsync: CreateBooking, isPending } = useCreateBooking();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    getValues
  } = useForm<ICreateBooking>({
    defaultValues: {
      startTime: dayjs(event?.start).format("HH:mm:ss"),
      endTime: dayjs(event?.end).format("HH:mm:ss"),
    },
  });

  const { endTime, startTime } = watch();

  const onSubmit = async (data: ICreateBooking) => {
    const bookingDate = moment(event?.start).format("YYYY-MM-DD");

    const apidata = {
      ...data,
      startTime: startTime,
      endTime: endTime,
      court: event?.resourceId,
      bookingDate,
    };

    CreateBooking(apidata, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const { data } = useQuery({
    queryKey: [
      "booking-price",
      {
        startTime,
        endTime,
        court: event?.resourceId,
      },
    ],

    queryFn: async () => {
      const response = await apiCaller.post("/booking/initiateBooking", {
        startTime,
        endTime,
        court: event?.resourceId,
      });

      return response?.data?.data;
    },

    enabled: !!event?.resourceId && !!startTime && !!endTime,
    staleTime: 60 * 1000,
  });

    const { data:bookingData, isLoading:isBookingLoading, } = useQuery({
    queryKey: [
      "Booking-info",defaultValue?._id,],

    queryFn: async () => {
      const response = await apiCaller.get(`/booking/${defaultValue?._id}`);
      return response?.data?.data;
    },

    enabled: !!defaultValue?._id,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
  if (!isOpen || !bookingData || !defaultValue) return;

  reset({
    sport: bookingData.sport,
    customer: bookingData.customer?._id,
    court: bookingData.court?._id,
    bookingDate: bookingData.bookingDate,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    payment: bookingData.payment,
  });
}, [isOpen, bookingData, reset]);

  console.log(bookingData,'booking')

  return (
    <Modal
     title="Create Booking"
      closable
      open={isOpen}
      footer={null}
      onCancel={() => onOpenChange(false)}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Sport */}
        <Form.Item
          label="Sport"
          validateStatus={errors.sport ? "error" : ""}
          help={errors.sport?.message}
        >
          <Controller
            name="sport"
            control={control}
            rules={{ required: "Sport is required" }}
            render={({ field }) => (
              <Select {...field} placeholder="Enter sports">
                <Select.Option value="Football">Football</Select.Option>
                <Select.Option value="Badminton">Badminton</Select.Option>
                <Select.Option value="Tennis">Tennis</Select.Option>
              </Select>
            )}
          />
        </Form.Item>

        <Row>
          <Col span={12}>
            {/* Booking Date */}
            <Form.Item label="Booking Date">
              <DatePicker disabled value={dayjs(event?.start)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Booking Duration */}
            <Form.Item label="Booking Duration">
              <div className="flex gap-3">
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field: { value, onChange, ...newField } }) => (
                    <TimePicker
                      minuteStep={30}
                      onChange={(date) => onChange(date.format("HH:mm:ss"))}
                      value={dayjs(value, "HH:mm:ss")}
                      format={"HH:mm a"}
                      {...newField}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field: { value, onChange, ...newField } }) => (
                    <TimePicker
                      minuteStep={30}
                      onChange={(date) => onChange(date.format("HH:mm:ss"))}
                      value={dayjs(value, "HH:mm:ss")}
                      format={"HH:mm a"}
                      {...newField}
                    />
                  )}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Price */}
        <Form.Item label="Booking Price">
          <Card
            size="small"
            style={{
              background: "#f8f9fc",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
            styles={{
              body: {
                padding: "14px 16px",
              },
            }}
          >
            {isPending ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 40,
                }}
              >
                <Spin size="small" />

                <Text type="secondary">Calculating booking price...</Text>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "#f0f2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaIndianRupeeSign />
                  </div>

                  <div>
                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        fontSize: 12,
                      }}
                    >
                      Total Booking Price
                    </Text>

                    <Text
                      strong
                      style={{
                        fontSize: 20,
                        color: "#1f2937",
                      }}
                    >
                    ₹{watch('payment.totalAmount') ?? data ?? 0}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Form.Item>

        {/* Customer */}
        <Form.Item
          label="Booked By"
          validateStatus={errors.customer ? "error" : ""}
          help={errors.customer?.message}
        >
          <Controller
            name="customer"
            control={control}
            rules={{ required: "Customer is required" }}
            render={({ field }) => <CustomerSearchSelect {...field} />}
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <div className="flex justify-end gap-3">
            <Button loading={isPending} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button loading={isPending} type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBookingModal;
