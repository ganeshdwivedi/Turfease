import React, { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi2";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import { PiCourtBasketballFill } from "react-icons/pi";
import { FaCamera } from "react-icons/fa6";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import UpdateDetailsModel from "./UpdateDetailsModel";

const SideBar = () => {
  const { pathname } = useLocation();
  const [isOpen,setIsOpen] =useState<boolean>(false);

  return (
    <div className="bg-[#424B96] w-[250px] min-h-[100vh] flex flex-col items-center text-white font-regular">
      {/* <img src="Images/Logo.png" className="w-40 h-40" alt="logo" /> */}
      <div className="flex flex-col my-5 items-center">
      <div className="relative">
            <img
              className="rounded-full object-cover w-16 h-16"
              src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwToT4pHMbCNnVbkhRbvFCouhqu9nn4M2mSg&s'}
              alt="admin-img"
            />
            <div onClick={()=>setIsOpen(true)} className="rounded-full py-[3px] px-[3.5px] absolute bottom-0 right-0 bg-black text-white w-4 h-4">
            <FaCamera className="text-[10px]"/>
            </div>
            </div>
        <h3 className="font-semibold my-4 text-lg">Eren Yeager</h3>
      </div>
      <div className="flex flex-col text-left mt-20 gap-4">
        <Link
          className={`${
            pathname === "/calendars"
              ? "bg-[#C3BEF5] text-black rounded-r-full px-5 py-1 "
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/calendars"}
        >
          <HiOutlineCalendar /> Calendar
        </Link>
        <Link
          className={`${
            pathname === "/courts"
              ? "bg-[#bfbbf0] text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/courts"}
        >
          <PiCourtBasketballFill className="color" />
          Courts
        </Link>
        <Link
          className={`${
            pathname === "/payments"
              ? "bg-[#bfbbf0] text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/payments"}
        >
          <FaFileInvoiceDollar />
          Payments
        </Link>
        <Link
          className={`${
            pathname === "/customers"
              ? "bg-[#bfbbf0] text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/customers"}
        >
          <IoPersonSharp />
          Customers
        </Link>
        <Link
          className={`${
            pathname === "/settings"
              ? "bg-[#bfbbf0] text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/settings"}
        >
          <IoSettingsSharp />
          Settings
        </Link>
        <Link
          className={`${
            pathname === "/logout"
              ? "bg-[#bfbbf0] text-black rounded-r-full"
              : ""
          } flex flex-row items-center gap-[6px] px-5 py-1 font-semibold`}
          to={"/logout"}
        >
          <GoSignOut />
          Logout
        </Link>
      </div>
     <UpdateDetailsModel isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default SideBar;
