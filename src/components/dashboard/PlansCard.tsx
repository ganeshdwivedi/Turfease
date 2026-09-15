import React from "react";
import { MdCheckCircleOutline } from "react-icons/md";

const PlansCard = ({
  title,
  price,
  features,
  popular = false,
  isEnterprise = false,
}: any) => {
  return (
    <div
      className={`border rounded-2xl p-8 text-left flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
        popular
          ? "relative border-2 border-brand-green shadow-2xl scale-105"
          : "border-gray-200"
      }`}
    >
      {popular && (
        <span className="absolute top-0 right-8 -translate-y-1/2 bg-brand-green text-white px-4 py-1 text-sm font-bold rounded-full">
          MOST POPULAR
        </span>
      )}
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-gray-500 mt-1">
        {isEnterprise
          ? "For large-scale operations"
          : `For ${
              title === "Starter" ? "new facilities" : "growing businesses"
            }`}
      </p>
      <p className="mt-6 text-4xl font-bold">
        {isEnterprise ? price : `$${price}`}
        {!isEnterprise && (
          <span className="text-lg font-normal text-gray-500">/mo</span>
        )}
      </p>
      <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
        {features?.map((feature: any) => (
          <li key={feature} className="flex items-center">
            <MdCheckCircleOutline />
            {feature}
          </li>
        ))}
      </ul>
      <a
        href="#"
        className={`w-full mt-8 text-center rounded-full px-6 py-3 font-semibold transition duration-300 ${
          popular
            ? "bg-brand-green text-white hover:opacity-90"
            : "text-brand-green border border-brand-green hover:bg-brand-green hover:text-white"
        }`}
      >
        {isEnterprise ? "Contact Sales" : "Get Started"}
      </a>
    </div>
  );
};

export default PlansCard;
