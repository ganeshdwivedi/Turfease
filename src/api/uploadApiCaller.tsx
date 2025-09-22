import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

export const uploadApiCaller = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

uploadApiCaller.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig<any>
  ): Promise<InternalAxiosRequestConfig<any>> => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === undefined) {
      localStorage.removeItem("accessToken");
      return config;
    }
    if (accessToken) {
      const header: string = `Bearer ${accessToken}`;
      config.headers["token"] = header;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
