import { useContext, useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Settings from "../pages/Settings";
import ErrorElement from "../pages/ErrorElement";
import MainPage from "../pages/MainPage";
import Calendar from "../pages/Calendar";
import Payments from "../pages/Payments";
import Court from "../pages/Court";
import Customer from "../pages/Customer";
import Logout from "../pages/Logout";
import SignIn from "../pages/SignIn";
import { jwtDecode } from "jwt-decode";

const RequireAuth: React.FC<any> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        setAuthenticated(false);
      }
    }
    setLoading(false); // No matter the condition, we set loading to false
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

const RequireAdminRole: React.FC<any> = ({ children }) => {
  const userRole: string = "Admin"; // You can replace this with your actual role-fetching logic

  if (userRole === "SUPER_ADMIN") {
    return children;
  } else {
    return <Settings />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Navigate to="/calendars" />
      </RequireAuth>
    ),
  },
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: (
      <RequireAuth>
        <MainPage />
      </RequireAuth>
    ),
    children: [
      { path: "calendars", element: <Calendar /> },
      { path: "logout", element: <Logout /> },
      { path: "courts", element: <Court /> },
      { path: "payments", element: <Payments /> },
      { path: "customers", element: <Customer /> },
      {
        path: "settings",
        element: (
          <RequireAdminRole>
            <Calendar />
          </RequireAdminRole>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <Navigate to="/calendars" />,
  },
]);

export default router;
