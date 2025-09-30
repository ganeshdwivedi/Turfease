import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Settings from "../pages/Settings";
import MainPage from "../pages/MainPage";
import Calendar from "../pages/Calendar";
import Payments from "../pages/Payments";
import Court from "../pages/Court";
import Customer from "../pages/Customer";
import Logout from "../pages/Logout";
import SignIn from "../pages/SignIn";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Plans from "../pages/Plans";
// import { RootState } from "../redux/store";

const RequireAuth: React.FC<any> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isauthenticated = useSelector((state: any) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        setAuthenticated(false);
        setLoading(false);
      }
      return;
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isauthenticated) {
    return <Navigate to="/dashboard" />;
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
    element: <Dashboard />,
  },
  {
    path: "/club",
    element: (
      <RequireAuth>
        <Navigate to="/calendars" />
      </RequireAuth>
    ),
  },

  {
    path: "/club/",
    // errorElement: <ErrorElement />,
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
      { path: "plans", element: <Plans /> },
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
    path: "/club/signin",
    element: <SignIn />,
  },
  {
    path: "/club/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Dashboard />,
  },
]);

export default router;
