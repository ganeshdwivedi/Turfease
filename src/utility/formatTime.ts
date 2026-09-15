import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * Formats a time string like "00:00" or "00:00:00" to "hh:mm" or "hh:mm a".
 *
 * @param timeStr - e.g. "00:00", "01:00", "13:30:00"
 * @param includeAmPm - whether to include am/pm suffix
 */
export const formatSlotTime = (
  timeStr?: string,
  includeAmPm: boolean = true
): string => {
  if (!timeStr) return "";

  const parts = timeStr.trim().split(":");
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1].slice(0, 2).padStart(2, "0");
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const formattedHour = hour12.toString().padStart(2, "0");
      return includeAmPm
        ? `${formattedHour}:${minute} ${ampm}`
        : `${formattedHour}:${minute}`;
    }
  }

  // Fallback for full ISO dates
  const parsed = dayjs(timeStr);
  if (parsed.isValid()) {
    return parsed.format(includeAmPm ? "hh:mm a" : "hh:mm");
  }

  return timeStr;
};

/**
 * Formats start and end times into a range label like "12:00 - 01:00 am".
 */
export const formatSlotRange = (
  startTime?: string,
  endTime?: string
): string => {
  const start = formatSlotTime(startTime, false);
  const end = formatSlotTime(endTime, true);
  if (!start && !end) return "";
  return `${start} - ${end}`;
};
