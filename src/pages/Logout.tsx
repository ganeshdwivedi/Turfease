import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../redux/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // dispatch(
    //   updateAuthState({
    //     isLoggedIn: false,
    //     user: null,
    //   })
    // );
  }, []);

  return <div></div>;
};

export default Logout;
