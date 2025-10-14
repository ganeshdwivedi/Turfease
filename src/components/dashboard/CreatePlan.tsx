import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  List,
  Typography,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { useToast } from "../ToastProvider";

const { Option } = Select;
const { Text } = Typography;

interface CreatePlanFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlanForm = ({ isOpen, onClose }: CreatePlanFormProps) => {
  const antToast = useToast();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      planName: "",
      amount: "",
      currency: "INR",
      period: "monthly",
      interval: 1,
      features: [],
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (apiData: any) => await apiCaller.post("/plan", apiData),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["GetAllPlans"] });
    },
    onError: (error) => {
      antToast.error("Failed to Create Plan. Please try again.");
      console.error("Error creating court:", error);
    },
  });

  const onSubmit = (values: any) => {
    const newPlan = {
      ...values,
      amount: parseInt(values.amount, 10) * 100, // convert to paise
      interval: parseInt(values.interval, 10),
      popular: false,
    };
    console.log(newPlan);
    // reset form
    mutate(newPlan);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal footer={null} closable centered open={isOpen} onCancel={handleClose}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Typography.Title level={3}>Create New Plan</Typography.Title>

        {/* Plan Name */}
        <Form.Item label="Plan Name" required>
          <Controller
            name="planName"
            control={control}
            rules={{ required: "Plan name is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="Enter plan name" />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Form.Item>

        {/* Amount & Currency */}
        <Form.Item label="Amount" required>
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required" }}
            render={({ field, fieldState }) => (
              <>
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Enter amount"
                />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Currency">
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select {...field} style={{ width: "100%" }}>
                <Option value="INR">INR</Option>
                <Option value="USD">USD</Option>
              </Select>
            )}
          />
        </Form.Item>

        {/* Billing Period & Interval */}
        <Form.Item label="Billing Period">
          <Controller
            name="period"
            control={control}
            render={({ field }) => (
              <Select {...field} style={{ width: "100%" }}>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label="Interval" required>
          <Controller
            name="interval"
            control={control}
            rules={{ required: "Interval is required" }}
            render={({ field, fieldState }) => (
              <>
                <InputNumber {...field} min={1} style={{ width: "100%" }} />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Form.Item>

        {/* Features */}
        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <Form.Item label="Features">
              <Select
                maxCount={15}
                {...field}
                mode="tags"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              />
            </Form.Item>
          )}
        />

        {/* Submit */}
        <Form.Item>
          <Button loading={isPending} type="primary" htmlType="submit" block>
            Create Plan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePlanForm;
