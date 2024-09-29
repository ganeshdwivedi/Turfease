import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Routes";

function App() {
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
