import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Divider,
  Radio,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { appApiCaller } from "../../api/appApiCaller";
import { loadRazorpayScript } from "../../utility/razorpayScriptLoad";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import dayjs from "dayjs";
import { closeBookingModal, type InitiatePaymentResponse } from "../../redux/bookingSlice";
import { useToast } from "../ToastProvider";
import { RiMapPin2Fill } from "react-icons/ri";
import handleOpenMap from "../../utility/mapOpen";
import { IoWallet } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import { formatSlotRange } from "../../utility/formatTime";

interface FormValues {
  coupon: string;
  paymentMode: "online" | "pay_on_arrival";
}

interface ApplyCouponPayload {
  couponCode: string;
  basePrice: number;
}

interface CreateBookingPayload {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  sport: string;
}

interface InitiatePaymentPayload {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  sport: string;
}

interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  sport: string;
}



declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;

  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  theme?: {
    color?: string;
  };
}

const GlobalBookingModal = () => {
  const antToast = useToast();
  const dispatch = useDispatch();

  const { auth, booking: bookingState } = useSelector(
    (state: RootState) => state
  );

  const user: any = auth?.user;
  const { isOpen, data } = bookingState;

  const {
    watch,
    control,
    setValue,
    setError,
    reset,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      coupon: "",
      paymentMode: "online",
    },
  });

  console.log(data)

  const { coupon, paymentMode } = watch();

  const [step, setStep] = useState(1);

  /**
   * ---------------------------------------------------------
   * Booking values
   * ---------------------------------------------------------
   */

  const courtId = data?.court?.id || "";

  const bookingDate = data?.booking?.date
    ? dayjs(data.booking.date).format("YYYY-MM-DD")
    : "";

  const startTime = data?.booking?.startTime || "";
  const endTime = data?.booking?.endTime || "";

  const sport = data?.sport || "Badminton";

  /**
   * Calculate duration and amount from selected court.
   * Backend remains the source of truth for final payment amount.
   */
  const durationInHours = (() => {
    if (!startTime || !endTime) {
      return 0;
    }

    const [startHour, startMinute] = startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = endTime
      .split(":")
      .map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    let difference = end - start;

    if (difference <= 0) {
      difference += 24 * 60;
    }

    return difference / 60;
  })();

  const calculatedTotalAmount =
    (data?.court?.pricePerHour || 0) *
    durationInHours;

  const totalAmount =
    (data as any)?.pricing?.totalAmount ??
    calculatedTotalAmount;

  /**
   * ---------------------------------------------------------
   * Pay Upon Arrival
   * ---------------------------------------------------------
   */

  const {
    mutate: createBooking,
    isPending: isCreatingBooking,
  } = useMutation({
    mutationFn: async (
      apiData: CreateBookingPayload
    ) => {
      return await appApiCaller.post(
        "/app/booking",
        apiData
      );
    },

    onSuccess: () => {
      antToast.success(
        "Booking created successfully! Please pay at the venue."
      );

      handleClose();
    },

    onError: (error: any) => {
      antToast.error(
        error?.response?.data?.message ||
          "Failed to create booking"
      );
    },
  });

  /**
   * ---------------------------------------------------------
   * Initiate Online Payment
   *
   * Actual API response:
   *
   * {
   *   message: "...",
   *   data: {
   *     order: {...},
   *     totalAmount: 45,
   *     court: {...},
   *     booking: {...}
   *   }
   * }
   * ---------------------------------------------------------
   */

  const {
    mutate: initiatePayment,
    isPending: isInitiatingPayment,
  } = useMutation<
    any,
    any,
    InitiatePaymentPayload
  >({
    mutationFn: async (
      apiData: InitiatePaymentPayload
    ) => {
      return await appApiCaller.post(
        "/app/initiate-payment",
        apiData
      );
    },

    onSuccess: async (
      response: any
    ) => {
      try {
      console.log(response?.data,'response')
        const paymentData = response?.data?.data;

        if (!paymentData) {
          antToast.error(
            "Invalid payment response received from server."
          );

          return;
        }

        const order = paymentData?.order;

        if (!order?.id) {
          antToast.error(
            "Invalid payment order received from server."
          );

          return;
        }

        /**
         * Load Razorpay SDK
         */
        const loaded = await loadRazorpayScript();

        if (!loaded) {
          antToast.error(
            "Failed to load Razorpay. Please try again."
          );

          return;
        }

        /**
         * Razorpay amount is in paise.
         *
         * Example:
         *
         * totalAmount = 45 INR
         * order.amount = 4500 paise
         */

        const options: RazorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,

          amount: order.amount,

          currency: order.currency,

          order_id: order.id,

          name: "Courtify",

          description: `Booking for ${
            paymentData.court?.name || "Court"
          }`,

          handler: async (razorpayResponse) => {
            await verifyPayment({
              razorpay_order_id:
                razorpayResponse.razorpay_order_id,

              razorpay_payment_id:
                razorpayResponse.razorpay_payment_id,

              razorpay_signature:
                razorpayResponse.razorpay_signature,

              courtId:
                paymentData.court?.id ||
                courtId,

              bookingDate:
                paymentData.booking?.date ||
                bookingDate,

              startTime:
                paymentData.booking?.startTime ||
                startTime,

              endTime:
                paymentData.booking?.endTime ||
                endTime,

              sport,
            });
          },

          prefill: {
            name:
              user?.name ||
              user?.fullName ||
              user?.firstName ||
              "",

            email: user?.email || "",

            contact:
              user?.phone_number ||
              user?.phone ||
              "",
          },

          theme: {
            color: "#508267",
          },
        };

        const razorpay =
          new window.Razorpay(options);

        razorpay.open();
      } catch (error: any) {
        console.error(
          "Razorpay initialization error:",
          error
        );

        antToast.error(
          "Unable to open payment gateway."
        );
      }
    },

    onError: (error: any) => {
      antToast.error(
        error?.response?.data?.message ||
          "Failed to initiate payment"
      );
    },
  });

  /**
   * ---------------------------------------------------------
   * Verify Online Payment
   * ---------------------------------------------------------
   */

  const {
    mutateAsync: verifyPayment,
    isPending: isVerifyingPayment,
  } = useMutation({
    mutationFn: async (
      apiData: VerifyPaymentPayload
    ) => {
      return await appApiCaller.post(
        "/app/verify-payment",
        apiData
      );
    },

    onSuccess: () => {
      antToast.success(
        "Payment successful! Booking confirmed."
      );

      handleClose();
    },

    onError: (error: any) => {
      antToast.error(
        error?.response?.data?.message ||
          "Payment verification failed."
      );
    },
  });

  /**
   * ---------------------------------------------------------
   * Apply Coupon
   * ---------------------------------------------------------
   */

  const {
    mutate: applyCoupon,
    isPending: isCouponPending,
  } = useMutation({
    mutationFn: async (
      couponData: ApplyCouponPayload
    ) => {
      return await appApiCaller.post(
        "/app/verifyCoupon",
        couponData
      );
    },

    onSuccess: () => {
      antToast.success(
        "Coupon applied successfully"
      );
    },

    onError: (error: any) => {
      setValue("coupon", "");

      setError("coupon", {
        type: "manual",
        message:
          error?.response?.data?.message ||
          "Failed to apply coupon",
      });

      setTimeout(() => {
        setError("coupon", {
          type: "manual",
          message: "",
        });
      }, 3500);
    },
  });

  /**
   * ---------------------------------------------------------
   * Submit
   * ---------------------------------------------------------
   */

  const onSubmit = () => {
    if (
      !courtId ||
      !bookingDate ||
      !startTime ||
      !endTime
    ) {
      antToast.error(
        "Booking information is incomplete."
      );

      return;
    }

    /**
     * Pay Upon Arrival
     */
    if (paymentMode === "pay_on_arrival") {
      createBooking({
        courtId,
        bookingDate,
        startTime,
        endTime,
        sport,
      });

      return;
    }

    /**
     * Online Payment
     */
    initiatePayment({
      courtId,
      bookingDate,
      startTime,
      endTime,
      sport,
    });
  };

  /**
   * ---------------------------------------------------------
   * Close modal
   * ---------------------------------------------------------
   */

  const handleClose = () => {
    reset({
      coupon: "",
      paymentMode: "online",
    });

    dispatch(closeBookingModal());

    setStep(1);
  };

  /**
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
   */

  const isPending =
    isCreatingBooking ||
    isInitiatingPayment ||
    isVerifyingPayment;

  /**
   * ---------------------------------------------------------
   * Step 1 - Booking Information
   * ---------------------------------------------------------
   */

  const renderBookingInformation = () => {
    if (!data) {
      return null;
    }

    return (
      <div>
        <h2 className="text-2xl font-bold !text-center text-[#508267]">
          Booking Information
        </h2>

        <p className="text-gray-500 text-center">
          On cancellation you will not get refund on
          this booking
        </p>

        <div className="mt-6 space-y-3 bg-gray-100 p-3 rounded-md text-gray-600 border-b border-gray-200 pb-4">
          <h3 className="!text-lg font-bold">
            <span className="text-gray-500 font-normal">
              Court:{" "}
            </span>

            {data.court?.name}
          </h3>

          <Divider />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Location</strong>

              <p className="break-words">
                {data.court?.address}
              </p>

              <div
                className="text-brand-green flex gap-2 items-center cursor-pointer"
                onClick={() =>
                  handleOpenMap(
                    Number(
                      data.court?.location?.latitude ||
                        0
                    ),
                    Number(
                      data.court?.location?.longitude ||
                        0
                    )
                  )
                }
              >
                <RiMapPin2Fill />

                Map
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <strong className="font-semibold text-gray-800">
                Date & Time
              </strong>

              <span>
                {dayjs(data.booking?.date).format(
                  "DD MMMM YYYY"
                )}
              </span>

              <p>
                {formatSlotRange(
                  data.booking?.startTime,
                  data.booking?.endTime
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-500">
            Total
          </span>

          <span className="text-2xl font-bold">
            ₹{totalAmount}
          </span>
        </div>

        <div className="mt-8">
          <Button
            loading={isPending}
            disabled={isPending}
            type="primary"
            className="w-full"
            onClick={() => setStep(2)}
          >
            Book Now
          </Button>
        </div>
      </div>
    );
  };

  /**
   * ---------------------------------------------------------
   * Step 2 - Payment Information
   * ---------------------------------------------------------
   */

  const renderPaymentInformation = () => {
    return (
      <>
        <h2 className="text-2xl font-bold !text-center text-[#508267]">
          Payment Information
        </h2>

        <p className="text-gray-500 text-center">
          Select your preferred payment method
        </p>

        <div className="mb-5 !mt-9">
          <Form
            onFinish={handleSubmit(onSubmit)}
            layout="vertical"
          >
            <Controller
              control={control}
              name="coupon"
              render={({
                field,
                fieldState: { error },
              }) => (
                <Form.Item
                  help={error?.message}
                  validateStatus={
                    error?.message
                      ? "error"
                      : ""
                  }
                  label={
                    <p className="text-[#508267] font-semibold">
                      Do you have a coupon code?
                      (Optional)
                    </p>
                  }
                >
                  <Input
                    {...field}
                    disabled={isPending}
                    suffix={
                      <Button
                        loading={isCouponPending}
                        disabled={
                          isPending ||
                          isCouponPending ||
                          !coupon?.trim()
                        }
                        onClick={() =>
                          applyCoupon({
                            couponCode:
                              coupon.trim(),

                            basePrice:
                              totalAmount,
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
                    className="!flex !flex-col gap-3"
                  >
                    <Radio.Button value="online">
                      <div className="flex !items-center gap-4 !flex-row">
                        <IoWallet />

                        <span>
                          Pay Now
                        </span>
                      </div>
                    </Radio.Button>

                    <Radio.Button value="pay_on_arrival">
                      Pay on Arrival
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              )}
            />

            <div className="mb-4 flex justify-between items-center">
              <span className="text-gray-500">
                Total Amount
              </span>

              <span className="text-xl font-bold">
                ₹{totalAmount}
              </span>
            </div>

            <Button
              loading={isPending}
              disabled={isPending}
              htmlType="submit"
              className="items-center !w-full !font-semibold"
              type="primary"
            >
              {paymentMode === "pay_on_arrival"
                ? "Confirm Booking"
                : "Proceed to Payment"}
            </Button>
          </Form>
        </div>
      </>
    );
  };

  /**
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closable
      centered
      destroyOnClose
    >
      {step === 1
        ? renderBookingInformation()
        : renderPaymentInformation()}
    </Modal>
  );
};

export default GlobalBookingModal;