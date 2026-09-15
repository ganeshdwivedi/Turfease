import dayjs from "dayjs";

export const getDurationInHours = (startTime: string, endTime: string) => {
  //   const bookingDate = dayjs().format("YYYY-MM-DD");
  const start = dayjs(`${startTime}`, "HH:mm:ss");
  const end = dayjs(`${endTime}`, "HH:mm:ss");
  if (!start.isValid() || !end.isValid()) {
    return null;
  }
  const duration = end.diff(start, "hour", true);
  return duration;
};
