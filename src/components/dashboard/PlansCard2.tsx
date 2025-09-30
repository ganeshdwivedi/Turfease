import { Button } from "antd";
import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { uploadApiCaller } from "../../api/uploadApiCaller";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanCard2 = ({ plan, className }: any) => {
  const handleSubscribe = async (planId: string) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }
    try {
      // Step 1: Create subscription from backend
      const { data } = await uploadApiCaller.post("create-subscription", {
        planId,
        customerEmail: "customer@example.com",
        totalCount: 12,
      });
      console.log(data, "data--->");

      const subscription = data.subscription;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
        subscription_id: subscription.id,
        name: "Your Company Name",
        description: subscription.item.name,
        prefill: {
          email: "customer@example.com",
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response: any) {
          console.log(response, "res-->");
          // Step 3: Verify payment on backend
          // await axios.post("/api/subscription/verify-subscription", {
          //   razorpay_payment_id: response.razorpay_payment_id,
          //   razorpay_subscription_id: response.razorpay_subscription_id,
          //   razorpay_signature: response.razorpay_signature,
          // });
          alert("Subscription successful!");
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert("Subscription failed!");
    }
  };

  return (
    <div
      className={`border rounded-2xl p-6 text-left flex flex-col transition-all relative duration-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
        plan.popular ? "border-2 border-brand-green" : "border-gray-200"
      } ${className}`}
    >
      {plan.popular && (
        <span className="absolute top-0 right-6 -translate-y-1/2 bg-brand-green text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
          Popular
        </span>
      )}
      <h4 className="text-xl font-bold text-gray-800">{plan.name}</h4>
      <p className="mt-4 text-4xl font-extrabold text-gray-800">
        {(plan.price / 100).toLocaleString("en-IN", {
          style: "currency",
          currency: plan.currency,
          minimumFractionDigits: 0,
        })}
        <span className="text-base font-medium text-gray-500">
          /{plan.durationType}
        </span>
      </p>
      <div className="border-t border-gray-100 my-6"></div>
      <ul className="space-y-3 text-gray-600 flex-grow">
        {plan?.features?.map((feature: any) => (
          <li key={feature} className="flex items-start">
            <IoCheckmarkCircleOutline className="w-5 h-5 text-brand-green mr-3 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          handleSubscribe(plan?.razorpayPlanId);
        }}
        className="mt-5"
        type={plan.popular ? "primary" : "default"}
      >
        Manage Plan
      </Button>
    </div>
  );
};
export default PlanCard2;
