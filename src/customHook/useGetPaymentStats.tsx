import dayjs from "dayjs";
import { apiCaller } from "../api/ApiCaller";
import { useQuery } from "@tanstack/react-query";

const useGetPaymentStats = ({ selectedDate }: { selectedDate: Date }) => {
  const date = dayjs(selectedDate).format("YYYY-MM-DD");

  const query = useQuery({
    queryKey: ["GetStatsByDate", selectedDate],
    queryFn: async () => {
      const response = await apiCaller.get(`/stats?date=${date}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  return { ...query };
};

export default useGetPaymentStats;
