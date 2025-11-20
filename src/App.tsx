import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Routes";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthState } from "./redux/authSlice";
import { RootState } from "./redux/store";
import { LoginME } from "./api/User";
import toast from "react-hot-toast";
import { GenerateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const GETUSER = async () => {
    try {
      const user = await LoginME();
      dispatch(
        updateAuthState({
          isLoggedIn: true,
          user,
        })
      );
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   GenerateToken();
  //   onMessage(messaging, (payload) => {
  //     console.log(payload, "payloaddd");
  //   });

  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/firebase-messaging-sw.js")
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch((err) => {
  //         console.error("Service Worker registration failed:", err);
  //       });
  //   }
  // }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      GETUSER();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.umami) {
      console.log("umami loaded---");

      window.umami.track("User Viewing", {
        userId: (authState as any)?.user?._id || "no login user",
      });
    } else {
      console.warn("Umami not loaded yet");
    }
  }, [authState]);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <div className="min-w-full min-h-full flex flex-row">
        <SideBar />
        <div className="grow bg-[#EEEFF5] min-h-full">{children}</div>
      </div> */}
    </div>
  );
}

export default App;
