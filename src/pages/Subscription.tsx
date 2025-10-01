import { message, Skeleton } from "antd";
import React from "react";
import PlanCard2 from "../components/dashboard/PlansCard2";
import { apiCaller } from "../api/ApiCaller";
import { useQuery } from "@tanstack/react-query";
import { uploadApiCaller } from "../api/uploadApiCaller";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { User } from "../Types/Customer";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Subscription = () => {
  const user: any = useSelector((state: RootState) => state.auth?.user);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllPlans"],
    queryFn: async () => {
      const response = await apiCaller.get(`/plans`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(user, "user");

  const handleSubscribe = async (selectedPlan: any) => {
    // Check if the script loader is working
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      message.error(
        "Razorpay SDK failed to load. Please check your internet connection and try again."
      );
      return;
    }
    if (!user) {
      message.error("please login to continue");
      return;
    }
    console.log("✅ Razorpay script loaded successfully.");

    try {
      // Step 1: Create subscription via backend
      console.log("➡️ Attempting to create subscription on backend...");
      const { data } = await uploadApiCaller.post("create-subscription", {
        planId: selectedPlan?.razorpayPlanId,
        email: user?.email,
        totalCount: 12,
      });

      console.log("✅ Backend response received:", data);
      const subscription = data.subscription;

      // Critical Check: Ensure you have a valid subscription object and ID
      if (!subscription || !subscription.id) {
        console.error(
          "❌ Invalid subscription data from backend:",
          subscription
        );
        alert("Failed to get a valid subscription from the server.");
        return;
      }
      console.log("✅ Subscription ID:", subscription.id);

      // Step 2: Prepare Razorpay Options
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
        subscription_id: subscription.id,
        name: "Turfeazze",
        description: "Subscription",
        prefill: { email: user?.email },
        theme: { color: "#3399cc" },
        handler: async (response: any) => {
          // This handler is your success trace point
          console.log("✅ Payment successful! Handler response:", response);
          try {
            console.log("➡️ Verifying payment on backend...");
            const verify = await uploadApiCaller.post("verify-subscription", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedPlan?._id,
              userId: user?._id,
            });

            console.log("✅ Verification response from backend:", verify.data);
            if (verify.data.success) {
              message.success("Subscription successful and verified!");
              navigate("/club/calendars");
              // Update UI here
            } else {
              message.error("Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Verification API call failed:", err);
            message.error("An error occurred during payment verification.");
          }
        },
      };

      console.log("➡️ Opening Razorpay Checkout with options:", options);
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("❌ An error occurred in handleSubscribe function:", err);
      alert("Something went wrong. Could not start the subscription process.");
    }
  };

  return (
    <div>
      <main className="p-6 md:p-8">
        {/* Display Section */}
        <div className="flex items-center justify-between !w-full !mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <Skeleton active />
          ) : (
            data?.map((plan: any, index: number) => (
              <PlanCard2
                handleSubscribe={handleSubscribe}
                key={index}
                plan={plan}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Subscription;
