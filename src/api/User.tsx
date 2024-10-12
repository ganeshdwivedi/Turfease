import axios from "axios";
import { apiCaller } from "./ApiCaller";

interface user {
  email: string;
  password: string;
}

export const Login = async (apidata: user) => {
  try {
    const response = await axios.post(
      "https://turfeasebe.onrender.com/api/auth/admin/login",
      apidata
    );
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};
