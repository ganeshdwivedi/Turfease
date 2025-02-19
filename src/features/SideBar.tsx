import React, { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi2";
import { LuUser2 } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import { PiCourtBasketballLight } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import UpdateDetailsModel from "./UpdateDetailsModel";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const SideBar = () => {
  const authStateUser: any = useSelector((state: RootState) => state.auth.user);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#508267] w-[250px] min-h-[100vh] flex flex-col items-center text-white font-regular">
      {/* <img src="Images/Logo.png" className="w-40 h-40" alt="logo" /> */}
      <div className="flex flex-col my-5 items-center">
        <div className="relative mt-5">
          <img
            className="rounded-full object-cover w-24 h-24"
            src={
              authStateUser?.profile
                ? authStateUser?.profile
                : "/Images/Profile.svg"
            }
            alt="admin-img"
          />
          <div
            onClick={() => setIsOpen(true)}
            className="rounded-full py-[3.5px] px-[4px] absolute bottom-0 right-0 bg-black text-white w-7 h-7"
          >
            <IoMdSettings className="text-[20px]" />
          </div>
        </div>
        <h3 className="font-semibold my-4 text-lg">{authStateUser?.name}</h3>
      </div>
      <div className="flex flex-col text-left mt-20 gap-4">
        <Link
          className={`${
            pathname === "/calendars"
              ? "bg-white text-black rounded-r-full px-5 py-1 "
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/calendars"}
        >
          <HiOutlineCalendar className="text-xl" /> Calendar
        </Link>
        <Link
          className={`${
            pathname === "/courts" ? "bg-white text-black rounded-r-full" : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/courts"}
        >
          <PiCourtBasketballLight className="text-xl" />
          Courts
        </Link>
        <Link
          className={`${
            pathname === "/payments" ? "bg-white text-black rounded-r-full" : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/payments"}
        >
          <CiDollar className="text-xl" />
          Payments
        </Link>
        <Link
          className={`${
            pathname === "/customers"
              ? "bg-white text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/customers"}
        >
          <LuUser2 className="text-xl" />
          Customers
        </Link>
        <Link
          className={`${
            pathname === "/settings" ? "bg-white text-black rounded-r-full" : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/settings"}
        >
          <IoSettingsSharp className="text-xl" />
          Settings
        </Link>
        <Link
          className={`${
            pathname === "/logout" ? "bg-white text-black rounded-r-full" : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/logout"}
        >
          <GoSignOut className="text-xl" />
          Logout
        </Link>
      </div>
      <UpdateDetailsModel isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default SideBar;
