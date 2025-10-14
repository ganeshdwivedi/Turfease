import moment from "moment";
import React, { useEffect } from "react";
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
} from "antd";
import dayjs from "dayjs";
import type { ICreateBooking } from "../../Types/Booking";
import { useCreateBooking } from "../../api/Calendar";
import { CustomerSearchSelect } from "../../components/Search/CustomerSearch";

const CreateBookingModal = ({
  isOpen,
  onOpenChange,
  event,
}: {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  event: any;
}) => {
  const { mutateAsync: CreateBooking, isPending } = useCreateBooking();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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

  return (
    <Modal
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
          <p>null</p>
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
