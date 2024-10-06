import { useState } from "react";
import { useQuery } from "react-query";
import { apiCaller } from "../api/ApiCaller";
import moment from "moment";

const useGetBookingsByDate = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedLocation, setSelectedLocation] = useState();
  const date = moment(selectedDate).format("YYYY-MM-DD");

  const query = useQuery(
    ["GetBookingByDate", selectedDate],

    async () => {
      const response = await apiCaller.get(`/payments?date=${date}`);
      return response.data.data;
    },
    {
      enabled: !!selectedDate ? true : false,
      cacheTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return { setSelectedDate, ...query };
};

export default useGetBookingsByDate;
