import toast from "react-hot-toast";
import type { BECustomerUpdate } from "../Types/Customer";
import { apiCaller } from "./ApiCaller";
import { uploadApiCaller } from "./uploadApiCaller";

interface user {
  email: string;
  password: string;
}

export const Login = async (apidata: user) => {
  try {
    const response = await apiCaller.post("/auth/login", apidata);
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const LoginME = async () => {
  try {
    const response = await uploadApiCaller.get("/app/me");
    return response.data.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const UpdateAdminInfo = async (apidata: BECustomerUpdate | any) => {
  const response = await apiCaller.patch("/profileUpdate", apidata);
  return response;
};
