import React from "react";
import { BiUser } from "react-icons/bi";
import { Outlet } from "react-router-dom";

const CustomerMainPage = () => {
  return (
    <div>
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-3xl font-bold text-brand-green">
              Courtify
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-brand-green"
              >
                My Bookings
              </a>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-green">
                <BiUser />
              </button>
            </div>
          </div>
        </div>
      </header>
      {Outlet && <Outlet />}
      All right reserveds
    </div>
  );
};

export default CustomerMainPage;
