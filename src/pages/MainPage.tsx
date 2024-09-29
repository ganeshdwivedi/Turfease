import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../features/SideBar";

const MainPage: React.FC<any> = () => {
  useEffect(() => {
    // Apply styles to body
    document.body.style.background = "#889AB626";

    // Clean up the styles when the component unmounts
    return () => {
      document.body.style.background = "";
    };
  }, []);

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
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <SideBar />
      {/* <div style={{ display: { xs: "block", md: "none" } }}>
        <MobileDrawer />
      </div> */}
      <div style={{ flexGrow: 1, width: "93%" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
