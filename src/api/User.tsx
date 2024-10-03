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
