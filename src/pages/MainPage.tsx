import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../features/SideBar";
import { Button, Layout, Menu, Drawer, Grid ,message} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { IoSettingsOutline } from "react-icons/io5";
import Breadcrumbs from "../features/BreadCrumbs";

const { useBreakpoint } = Grid;

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
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const currentActiveKey = pathname.split("/")[1] || "calendar";

  const screens = useBreakpoint();
  const isMobile = !screens.md; // md breakpoint and below = mobile/tablet

  useEffect(() => {
    const handleOffline = () => {
      message.error("Looks Like you are Offline");
      // show offline notification here if needed
    };
    window.addEventListener("offline", handleOffline);
    if (!navigator.onLine) handleOffline();
    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const SidebarContent = (
    <div>
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
            onClick={() => {}}
            icon={<IoSettingsOutline />}
          />
        </div>
        {!collapsed && (
          <h3 className="!text-white capitalize font-semibold my-4 text-lg">
            {authStateUser?.name}
          </h3>
        )}
      </div>

      <Menu
        className="!h-auto"
        theme="light"
        mode="inline"
        onClick={(item) => {
          navigate(`/club/${item?.key}`);
          if (isMobile) setDrawerOpen(false); // auto close drawer on mobile
        }}
        defaultSelectedKeys={[currentActiveKey]}
        items={sidebarItems}
      />
    </div>
  );

  return (
    <Layout>
      {!isMobile ? (
        // Desktop Sidebar
        <Sider
          className="custom-sidebar"
          style={siderStyle}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          {SidebarContent}
        </Sider>
      ) : (
        // Mobile Drawer
        <Drawer
          className="!min-w-[230px] !w-[70%]"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          closable={false}
          bodyStyle={{ padding: 0 ,backgroundColor: "#508267",}}
        >
          {SidebarContent}
        </Drawer>
      )}

      <Layout>
        <Header style={{ padding: 0, background: "#fff" }}>
          <Button
            type="text"
            icon={
              collapsed ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />
            }
            onClick={() =>
              isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)
            }
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
