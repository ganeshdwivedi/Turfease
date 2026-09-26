import { Button, Layout, Popover } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React from "react";
import { BiUser } from "react-icons/bi";
import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import { FaRegUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const CustomerMainPage = () => {
  const handleLogout=()=>{
 localStorage.clear();
 window.location.href="/"
  }
  return (
    <Layout>
      <Header className="!bg-white/90 !p-0 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="md:container !w-full !mx-0 md:!mx-auto !px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-3xl font-bold text-brand-green">
              Courtify
            </a>
            <div className="flex items-center space-x-4">
              <Link
                to="/book/my-bookings"
                className="text-sm font-medium !text-gray-600 hover:text-brand-green"
              >
                My Bookings
              </Link>
              <Popover
             content={
              <div className="flex flex-col gap-2 !min-w-32">
                   <Button href="/book/courts" icon={<GoHome  />} type="text"  className="" > Home</Button>
                <Button href="/book/profile" icon={<FaRegUser />} type="text"  className="" > Profile</Button>
                <Button className="!text-red-500" icon={<FaSignOutAlt />} type="text" onClick={handleLogout}  > Logout</Button>
              </div>
             }
                >
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-green">
                <BiUser />
              </button></Popover>
            </div>
          </div>
        </div>
      </Header>
      <Content
        style={{
          margin: "24px 24px 0",
          overflow: "auto",
        }}
      >
        {Outlet && <Outlet />}
      </Content>
      <Footer />
    </Layout>
  );
};

export default CustomerMainPage;
