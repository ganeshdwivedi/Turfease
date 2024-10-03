import { apiCaller } from "./ApiCaller";

export const getAllBookings = async () => {
  try {
    const response = await apiCaller.get("/calendars");
    return response.data;
  } catch (error: any) {
    throw error.message;
  }
};
