import React, { useState } from "react";
import { Modal, Button, Input, Form, Divider, Radio, Space } from "antd";
import { CloseOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { appApiCaller } from "../../api/appApiCaller";
import { loadRazorpayScript } from "../../utility/razorpayScriptLoad";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import dayjs from "dayjs";
import { closeBookingModal, openBookingModal } from "../../redux/bookingSlice";
import type { User } from "../../Types/Customer";
import { useToast } from "../ToastProvider";
import { RiMapPin2Fill } from "react-icons/ri";
import handleOpenMap from "../../utility/mapOpen";
import { IoWallet } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";

interface FormValues {
  coupon: string;
  paymentMode: string;
}

interface ApplyCoupon {
  couponCode: string;
  basePrice: number;
}
const GlobalBookingModal = () => {
  const antToast = useToast();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const { auth, booking: bookingState } = state;
  const user: any = auth?.user;
  const { isOpen, data } = bookingState;
  const { watch, control, setValue, setError, reset, handleSubmit } =
    useForm<FormValues>({
      defaultValues: {
        coupon: "",
        paymentMode: "online",
      },
    });
  const { coupon, paymentMode } = watch();
  const [step, setStep] = useState(1);

  // Preparing payload for booking
  const payload = {
    bookingDate: dayjs(data?.booking?.date).format("YYYY-MM-DD"),
    startTime: data?.booking?.startTime,
    endTime: data?.booking?.endTime,
    court: data?.court?.id,
    sport: "Badminton",
    payment: { paymentMode },
    totalAmount: data?.pricing?.totalAmount,
    couponCode: coupon || null,
  };

  const renderForm = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold !text-center text-[#508267]">
              Booking Information
            </h2>
            <p className="text-gray-500 text-center">
              On Cancellation you will not get refund on this booking
            </p>
            <div className="mt-6 space-y-3 bg-gray-100 p-2 rounded-md text-gray-600 border-b border-gray-200 pb-4">
              <h3 className="!text-lg font-bold -mb-3">
                <span className="text-gray-500 font-normal">Court: </span>
                {data?.court?.name}
              </h3>
              <Divider />
              <div className="grid grid-cols-2">
                <div>
                  <strong>Location</strong>
                  <p>{data?.court?.address}</p>
                  <div
                    className="text-brand-green flex gap-2 items-center cursor-pointer"
                    onClick={() =>
                      handleOpenMap(
                        data?.court?.location?.latitude || 0,
                        data?.court?.location?.longitude || 0
                      )
                    }
                  >
                    <RiMapPin2Fill /> Map
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <strong className="font-semibold text-gray-800">
                    Date & Time{" "}
                  </strong>
                  {dayjs(data?.booking?.date).format("DD MMMM YYYY ")}
                  <p>
                    {dayjs(data?.booking?.startTime, "HH:mm:ss").format(
                      "hh:mm"
                    )}{" "}
                    -{" "}
                    {dayjs(data?.booking?.endTime, "HH:mm:ss").format(
                      "hh:mm a"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-500">Total</span>
              <span className="text-2xl font-bold ">
                ₹{data?.pricing?.totalAmount}
              </span>
            </div>
            <div className="mt-8">
              <Button
                loading={isPending}
                type="primary"
                className="w-full" //mutate({ apiData: payload })
                onClick={() => setStep(2)}
              >
                Book Now
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            {" "}
            <h2 className="text-2xl font-bold !text-center text-[#508267]">
              Payment Information
            </h2>
            <p className="text-gray-500 text-center">
              Select your preferred payment method
            </p>
            <div className="mb-5 !mt-9">
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Controller
                  control={control}
                  name="coupon"
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item
                      help={error?.message}
                      validateStatus={error ? "error" : ""}
                      label={
                        <p className="text-[#508267] font-semibold">
                          Do you have a coupon code? (Optional)
                        </p>
                      }
                    >
                      <Input
                        {...field}
                        suffix={
                          <Button
                            loading={isCouponPending}
                            onClick={() =>
                              applyCoupon({
                                couponCode: coupon,
                                basePrice: data?.pricing?.basePrice || 0,
                              })
                            }
                            type="text"
                            className="!text-[#508267] !font-semibold"
                          >
                            Apply
                          </Button>
                        }
                        placeholder="Enter coupon code"
                      />
                    </Form.Item>
                  )}
                />
                <Controller
                  control={control}
                  name="paymentMode"
                  render={({ field }) => (
                    <Form.Item>
                      <Radio.Group
                        {...field}
                        className=" !flex !flex-col gap-3"
                        defaultValue={paymentMode}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="online">
                          <div className="flex !items-center gap-4 !flex-row">
                            <IoWallet />
                            Pay Now
                          </div>
                        </Radio.Button>
                        <Radio.Button value="pay_on_arrival">
                          Pay on Arrival
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  )}
                />

                <Button
                  loading={isPending}
                  htmlType="submit"
                  className="items-center !w-full !font-semibold"
                  type="primary"
                >
                  Proceed to Payment
                </Button>
              </Form>
            </div>
          </>
        );
    }
  };

  // For applying coupon
  const { mutate: applyCoupon, isPending: isCouponPending } = useMutation({
    mutationFn: async (data: ApplyCoupon) =>
      await appApiCaller.post(`app/apply-coupon`, data),
    onSuccess: (response: any) => {
      antToast.success("Coupon applied successfully");
      const couponResponse = response?.data?.data;
      dispatch(
        openBookingModal({
          ...data,
          pricing: {
            basePrice: data?.pricing?.basePrice ?? 0,
            discount: couponResponse?.discount || 0,
            totalAmount:
              couponResponse?.totalAmount || data?.pricing?.basePrice,
          },
        })
      );
    },
    onError: (error: any) => {
      setValue("coupon", "");
      setError("coupon", {
        message: error?.response?.data?.message || "Failed to apply coupon",
      });
      setTimeout(() => {
        setError("coupon", {});
      }, 3500);
    },
  });

  // For handling payment and booking
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ apiData }: { apiData: any }) =>
      await appApiCaller.post(`/app/booking`, apiData),
    onSuccess: async (response: any) => {
      const { data } = response;

      if (payload.payment.paymentMode === "pay_on_arrival") {
        antToast.success("Booking created! Please pay at the venue.");
        handleClose();
        return;
      }

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      // Step 3: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "Courtify",
        description: "Booking Payment",
        handler: async (response: any) => {
          // Step 4: Verify payment on backend
          await appApiCaller.post("verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: data.bookingId,
          });
          handleClose();
          antToast.success("Payment successful! Booking confirmed.");
        },
        prefill: {
          email: user?.email,
          contact: user?.phone_number,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      // queryClient.invalidateQueries({ queryKey: ["GetAllCourts"] });
    },
    onError: (error: any) => {
      antToast.error(
        error?.response?.data?.message || "Failed to process payment"
      );
    },
  });

  const handleClose = () => {
    reset();
    dispatch(closeBookingModal());
    setStep(1);
  };

  const onSubmit = () => {
    mutate({ apiData: payload });
  };

  return (
    <Modal open={isOpen} onCancel={handleClose} footer={null} closable centered>
      {renderForm(step)}
    </Modal>
  );
};

export default GlobalBookingModal;
