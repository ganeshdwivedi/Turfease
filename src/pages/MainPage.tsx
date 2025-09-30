import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../features/SideBar";
import { Button, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { IoSettingsOutline } from "react-icons/io5";
import Breadcrumbs from "../features/BreadCrumbs";

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  backgroundColor: "#508267",
};
const MainPage: React.FC<any> = () => {
  const authStateUser: any = useSelector((state: RootState) => state.auth.user);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const currentActiveKey = pathname.split("/")[1] || "calendar";

  useEffect(() => {
    const handleOffline = () => {
      //   setNotification({
      //     isShow: true,
      //     message: "No Internet Connection",
      //     subMessage: "",
      //     type: "error",
      //   });
    };

    window.addEventListener("offline", handleOffline);

    // Check initial connection status
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Layout>
      <Sider
        className="custom-sidebar"
        // className="!bg-green-700"
        style={siderStyle}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="flex flex-col my-5 items-center">
          <div className="relative mt-5">
            <img
              className={`rounded-full object-cover w-24 h-24 ${
                collapsed ? "!w-16 !h-16" : ""
              }`}
              src={
                authStateUser?.profile
                  ? authStateUser?.profile
                  : "/Images/Profile.svg"
              }
              alt="admin-img"
            />

            <Button
              shape="circle"
              className="!absolute bottom-0 right-0 !p-0"
              onClick={() => setIsOpen(true)}
              icon={<IoSettingsOutline className="" />}
            />
          </div>
          <h3
            className={`${
              collapsed ? "hidden" : "!text-white capitalize"
            } font-semibold my-4 text-lg`}
          >
            {authStateUser?.name}
          </h3>
        </div>
        <Menu
          className="!h-auto"
          theme="light"
          mode="inline"
          onClick={(item) => navigate(`/club/${item?.key}`)}
          defaultSelectedKeys={[currentActiveKey]}
          items={sidebarItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#ffff" }}>
          <Button
            type="text"
            icon={collapsed ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "auto",
            height: "calc(100vh - 112px)",
          }}
        >
          <Breadcrumbs />
          <div>{Outlet && <Outlet />}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
