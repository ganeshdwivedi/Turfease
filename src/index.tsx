import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Add Umami Tracking Script
const umamiScript = document.createElement("script");
umamiScript.async = true;
umamiScript.defer = true;
umamiScript.src = "https://umami-murex-omega.vercel.app/script.js";
umamiScript.setAttribute("data-website-id", "YOUR_WEBSITE_ID");
document.head.appendChild(umamiScript);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <Toaster />
          <App />
        </NextUIProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
