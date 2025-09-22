import dayjs from "dayjs";
import { apiCaller } from "../api/ApiCaller";
import { useQuery } from "@tanstack/react-query";

const useGetBookingsByDate = ({ selectedDate }: { selectedDate: Date }) => {
  const date = dayjs(selectedDate).format("YYYY-MM-DD");

  const query = useQuery({
    queryKey: ["GetBookingByDate", selectedDate],
    queryFn: async () => {
      const response = await apiCaller.get(
        `/payments?start_date=${date}&end_date=${date}`
      );
      return response.data.data?.map((item: any) => ({
        ...item,
        startTime: dayjs(
          `${date} ${item.startTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate(),
        endTime: dayjs(
          `${date} ${item.endTime}`,
          "YYYY-MM-DD HH:mm:ss"
        ).toDate(),
        courtID: item.court._id,
      }));
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  return { ...query };
};

export default useGetBookingsByDate;
