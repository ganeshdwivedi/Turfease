import { HiOutlineCalendar } from "react-icons/hi2";
import { LuUser } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { GoSignOut } from "react-icons/go";
import { PiCourtBasketballLight } from "react-icons/pi";

export const sidebarItems = [
  {
    key: "calendars",
    path: "/club/calendars",
    icon: <HiOutlineCalendar className="!text-xl" />,
    label: "Calendar",
  },
  {
    key: "courts",
    path: "/club/courts",
    icon: <PiCourtBasketballLight className="!text-xl" />,
    label: "Courts",
  },
  {
    key: "payments",
    path: "/club/payments",
    icon: <CiDollar className="!text-xl" />,
    label: "Payments",
  },
  {
    key: "customers",
    path: "/club/customers",
    icon: <LuUser className="!text-xl" />,
    label: "Customers",
  },
  {
    key: "settings",
    path: "/club/settings",
    icon: <IoSettingsSharp className="!text-xl" />,
    label: "Settings",
  },
  {
    key: "logout",
    path: "/logout",
    icon: <GoSignOut className="!text-xl" />,
    label: "Logout",
  },
];
