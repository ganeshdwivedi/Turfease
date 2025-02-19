import { apiCaller } from "./ApiCaller";

export const CreateCourt = async (apiData: any) => {
  const response = await apiCaller.post("/court", apiData);
  return response.data;
};

export const UpdateCourt = async (court_id:string,apiData: any) => {
  const response = await apiCaller.patch(`/court/${court_id}`, apiData);
  return response.data;
};

export const DeleteCourt = async (court_id: string) => {
  const response = await apiCaller.delete(`/court/${court_id}`);
  return response.data;
};


export const GetallCourt = async () => {
  const response = await apiCaller.get("/allcourts");
  return response.data.data;
};

export const GetCourt = async (court_id: string) => {
  const response = await apiCaller.get(`/court/${court_id}`);
  return response.data.data;
};
