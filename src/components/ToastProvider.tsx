import React, { createContext, useContext } from "react";
import { message } from "antd";

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
  loading: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const antToast = {
    success: (msg: string) => messageApi.success(msg),
    error: (msg: string) => messageApi.error(msg),
    warning: (msg: string) => messageApi.warning(msg),
    info: (msg: string) => messageApi.info(msg),
    loading: (msg: string) => messageApi.loading(msg),
  };

  return (
    <ToastContext.Provider value={antToast}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook for easy use
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
