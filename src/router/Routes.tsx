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
import { jwtDecode } from "jwt-decode"; // Correct import

const RequireAuth: React.FC<any> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(authenticated, "authenticated", loading);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token, "toeknnnn");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken.exp * 1000 > Date.now(), "helllooooo");
        if (decodedToken.exp * 1000 > Date.now()) {
          setAuthenticated(true);
          setLoading(false);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userData");
          setAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("Invalid token format");
        setAuthenticated(false);
        setLoading(false);
      }
    }
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
    return <Settings />; // Redirect to Settings if not SUPER_ADMIN
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
            <Settings />
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
    element: <Calendar />, // Handle unknown routes gracefully
  },
]);

export default router;
