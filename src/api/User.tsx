import { apiCaller } from "./ApiCaller";

interface user {
  email: string;
  password: string;
}

export const Login = async (apidata: user) => {
  try {
    const response = await apiCaller.post(
      "/auth/login",
      apidata
    );
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};


export const UpdateCustomer = async (customer_id:string,apidata: user) => {
  try {
    const response = await apiCaller.patch(
      `/customer/${customer_id}`,
      apidata
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};