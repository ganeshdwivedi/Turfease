import { useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Settings from "../pages/Settings";
import ErrorElement from "../pages/ErrorElement";
import MainPage from "../pages/MainPage";
import Calendar from "../pages/Calendar";
import Payments from "../pages/Payments";
import Court from "../pages/Court";
import Customer from "../pages/Customer";
import Logout from "../pages/Logout";

const RequireAuth: React.FC<any> = ({ children }) => {
  //   const context = useContext(MainContext);
  //   const authenticated = context?.authenticated;
  const authenticated: boolean = true;

  //   useEffect(() => {
  //     const token = localStorage.getItem("accessToken");
  //     if (token) {
  //       const decodedToken: any = jwtDecode(token);

  //       if (decodedToken.exp * 1000 < Date.now()) {
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("userData");
  //         window.location.href = "/signin";
  //       }
  //     }
  //   }, [context]);

  if (!authenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

const RequireAdminRole: React.FC<any> = ({ children }) => {
  // const user_data = JSON.parse(localStorage?.getItem("user") || "");

  const userRole: string = "Admin";

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
      { path: "courts", element: <Court /> },
      { path: "customers", element: <Customer /> },
      //   { path: "services", element: <Services /> },
      //   { path: "stats", element: <Statistics /> },
      //   { path: "POS", element: <POS /> },
      {
        path: "Settings",
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
    // element: <SignIn />,
  },
  // Redirect for any non-existing route
  {
    path: "*",
    element: <Navigate to="/calendars" />,
  },
]);

export default router;
