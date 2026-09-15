import React from "react";
import { BiMobile } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiCommunityFill } from "react-icons/ri";

const WhyChooseUs = () => {
  return (
    <div className="container mx-auto px-6 text-center py-5 my-10">
      <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
        Why Choose Us
      </h2>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">
        Everything You Need, All in One Place
      </h3>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <BiMobile />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">For Players</h4>
            <p className="mt-2 text-base text-gray-600">
              An intuitive, mobile-first design makes it effortless to find,
              compare, and book courts from anywhere. See real-time availability
              and secure your spot in seconds.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <MdAdminPanelSettings />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">For Court Owners</h4>
            <p className="mt-2 text-base text-gray-600">
              A powerful admin panel to manage bookings, set custom pricing,
              handle memberships, and gain insights with detailed analytics.
              Maximize your court utilization and revenue.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <RiCommunityFill />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">Community Focused</h4>
            <p className="mt-2 text-base text-gray-600">
              We're more than a booking platform. We're a community of sports
              lovers. Join events, find partners, and share your passion for the
              game.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
