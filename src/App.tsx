import { useEffect, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginME } from "./api/User";
import router from "./router/Routes";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthState } from "./redux/authSlice";

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  const authState = useSelector((state: any) => state.auth);
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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      GETUSER();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="App !overflow-auto !h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
