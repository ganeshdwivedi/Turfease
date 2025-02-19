import { apiCaller } from "./ApiCaller";

export const getAllPayemnts = async ({
  start_date,
  end_date,
}: {
  start_date: Date;
  end_date: Date;
}) => {
  const res = await apiCaller.get(
    `/payments?start_date=${start_date}&end_date=${end_date}`
  );
  return res;
};
