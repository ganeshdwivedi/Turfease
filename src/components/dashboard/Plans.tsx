import React from "react";
import PlansCard from "./PlansCard";

const Plans = () => {
  return (
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
        For Court Owners
      </h2>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">
        Choose Your Path to Success
      </h3>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Subscribe to a plan that fits your needs and start managing your courts
        like a pro.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Plan Cards */}
        <PlansCard
          title="Starter"
          price="49"
          features={[
            "Up to 5 Courts",
            "Basic Booking Management",
            "Standard Reporting",
          ]}
        />
        <PlansCard
          title="Pro"
          price="99"
          features={[
            "Up to 20 Courts",
            "Advanced Management",
            "Customer Memberships",
            "Priority Support",
          ]}
          popular={true}
        />
        <PlansCard
          title="Enterprise"
          price="Contact Us"
          features={[
            "Unlimited Courts",
            "Custom Integrations",
            "Dedicated Account Manager",
          ]}
          isEnterprise={true}
        />
      </div>
    </div>
  );
};

export default Plans;
