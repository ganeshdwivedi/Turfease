import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { store } from "./redux/store";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Providers from "./features/QueryClient.tsx";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { ConfigProvider } from "antd";
import { ToastProvider } from "./components/ToastProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#508267",
        },
      }}
    >
      <ToastProvider>
        <Provider store={store}>
          <Providers>
            <NextUIProvider>
              <Toaster />
              <App />
            </NextUIProvider>
          </Providers>
        </Provider>
      </ToastProvider>
    </ConfigProvider>
  </StrictMode>
);
