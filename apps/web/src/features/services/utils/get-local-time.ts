import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { format } from "date-fns";

dayjs.extend(utc);

export function getLocalTime(date: Date | string, startTime: string): string {
  const parsedDate = new Date(date);
  const formattedDate = format(parsedDate, "yyyy-MM-dd");
  const utcDateTime = `${formattedDate}T${startTime}`;

  return dayjs.utc(utcDateTime).local().format("HH:mm");
}
