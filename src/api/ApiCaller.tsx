import axios, { InternalAxiosRequestConfig } from "axios";

export const apiCaller = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});
apiCaller.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig<any>
  ): Promise<InternalAxiosRequestConfig<any>> => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken, "accessToken");
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
