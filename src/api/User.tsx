import toast from "react-hot-toast";
import { BECustomerUpdate } from "../Types/Customer";
import { apiCaller } from "./ApiCaller";

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
    const response = await apiCaller.get("/me");
    return response.data.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const UpdateAdminInfo = async (apidata: BECustomerUpdate) => {
  try {
    const response = await apiCaller.patch("/profileUpdate", apidata);
  } catch (error: any) {
    const errMessage = error.response.data.message;
    toast.error(errMessage);
  }
};

// update profile of Self
export const UpdateSelfDetails = async (apidata: { profile: string }) => {
  try {
    const response = await apiCaller.patch(`/profile/upload`, apidata);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
