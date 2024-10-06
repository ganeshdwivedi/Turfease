import { apiCaller } from "./ApiCaller";

export const getAllBookings = async () => {
  try {
    const response = await apiCaller.get("/payments");
    return response.data.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const getAllCourts = async () => {
  try {
    const response = await apiCaller.get("/allCourts");
    return response.data.data;
  } catch (error: any) {
    throw error.message;
  }
};

export const CreateBooking = async (apiData: any) => {
  try {
    const response = await apiCaller.post("/booking", apiData);
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};
